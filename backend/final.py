import pandas as pd
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE
import lightgbm as lgb
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import matplotlib.pyplot as plt


# import the admissions csv file
admission_df = pd.read_csv('/kaggle/input/veersa-hackathon/admissions_202208161605.csv')
admission_df = admission_df.drop(columns=['deathtime', 
                                          'language', 'religion', 'marital_status', 
                                          'ethnicity', 'edregtime', 'edouttime','row_id'])

# import the patients csv file
patients_df = pd.read_csv('/kaggle/input/veersa-hackathon/patients_202208161605.csv')
patients_df = patients_df.drop(columns=['dod','dod_hosp','dod_ssn','row_id'])

# apply inner join on admissions and patients and storing it in df
df = admission_df.merge(patients_df, how= 'inner', on=['subject_id'])

# delete the previous two dataframes to free up memory
del patients_df
del admission_df

# import the cpevents csv files
cpevents_df = pd.read_csv('/kaggle/input/veersa-hackathon/diagnoses_icd_202208161605.csv', low_memory=False)
cpevents_df = cpevents_df.drop(columns='row_id')

# perform right join on cpevents and df and updating in df
df = cpevents_df.merge(df,how='right', on=['hadm_id','subject_id'])

# delete cpevents file to free up memory 
del cpevents_df

#import the diagnoses_icd for icd9_code 
diagnoses_df = pd.read_csv('/kaggle/input/veersa-hackathon/diagnoses_icd_202208161605.csv')
diagnoses_df = diagnoses_df.drop(columns=['row_id'])

# Group the diagnoses by 'hadm_id' and collect all 'icd9_code' values into a list
diagnoses_df_grouped = diagnoses_df.groupby('hadm_id')['icd9_code'].apply(list).reset_index()

# Merge the grouped diagnoses with the main dataframe 'df' based on 'hadm_id'
df = df.merge(diagnoses_df_grouped, how='left', on='hadm_id')

# Expand the list of diagnosis codes so that each code gets its own row
df = df.explode('icd9_code_y')

df =df.drop(columns=['icd9_code_x'])
del diagnoses_df_grouped
del diagnoses_df

# import drgcodes csv file
drgcodes_df = pd.read_csv('/kaggle/input/veersa-hackathon/drgcodes_202208161605.csv')

# filter out rows where 'drg_severity' or 'drg_mortality' is missing (NaN)
filtered_df = drgcodes_df[drgcodes_df['drg_severity'].notna() & drgcodes_df['drg_mortality'].notna()]

# drop the 'row_id' column since it's not needed for further analysis
filtered_df = filtered_df.drop(columns=['row_id'])

# merge the filtered dataframe with our original df
df = df.merge(filtered_df, how='left', on=['subject_id', 'hadm_id'])

del drgcodes_df
del filtered_df

# filter out records where the subset columns are NaN
df = df.dropna(subset=[ 'expire_flag', 
                        'icd9_code_y', 'drg_type', 'drg_code', 
                        'description', 'drg_severity', 'drg_mortality'])

# import procedures for sequence number for a icd9_code
procedures_df = pd.read_csv('/kaggle/input/veersa-hackathon/procedures_icd_202208161605.csv')
procedures_df = procedures_df.drop(columns=['row_id'])

# left join df and procedures_df
df = df.merge(procedures_df, how='left', on=['subject_id', 'hadm_id', 'seq_num', 'icd9_code'])

# Ensure datetime columns are in proper format
df["admittime"] = pd.to_datetime(df["admittime"], errors='coerce')
df["dischtime"] = pd.to_datetime(df["dischtime"], errors='coerce')

# Sort by patient (`subject_id`) and admission time (`admittime`)
df = df.sort_values(["subject_id", "admittime"])

# Compute next admission time per patient
df["next_admittime"] = df.groupby("subject_id")["admittime"].shift(-1)

# Create binary readmission label directly: 1 if readmitted within 30 days, else 0
df["readmitted"] = (
    ((df["next_admittime"] - df["dischtime"]).dt.days < 30) 
    & ((df["next_admittime"] - df["dischtime"]).dt.days >= 0)
).fillna(False).astype(int)

# Sort the DataFrame by 'readmitted' in ascending order, so 0 (not readmitted) comes before 1 (readmitted)
df = df.sort_values('readmitted', ascending=True)

# Drop duplicate 'subject_id' entries, keeping only the last occurrence (which will be the one with 'readmitted' = 1 if both 0 and 1 exist)
df = df.drop_duplicates('subject_id', keep='last')

# import labevents csv file
labevents_df = pd.read_csv('/kaggle/input/veersa-hackathon/labevents_202208161605.csv')
labevents_df= labevents_df.drop(columns=['charttime','valueuom'])
labevents_df = labevents_df.dropna()
labevents_df = labevents_df.drop_duplicates()

# left join of df on labevents to map new features 'itemid' , 'value' , 'valuenum' , 'flag'
df = df.merge(labevents_df, how = 'left', on = ['subject_id','hadm_id'])

# Sort the DataFrame by 'readmitted' in ascending order, so 0 (not readmitted) appears before 1 (readmitted)
df_filtered = df.sort_values('readmitted', ascending=True)

# Remove duplicate 'subject_id' entries, keeping only the last occurrence (which ensures keeping 'readmitted' = 1 if both 0 and 1 exist)
df_filtered = df_filtered.drop_duplicates('subject_id', keep='last')

# Convert date columns from object to datetime
date_cols = ["admittime", "dischtime", "dob", "next_admittime"]
for col in date_cols:
    df_filtered[col] = pd.to_datetime(df_filtered[col], errors="coerce")  # Convert & handle errors

# create time features from the date and time features to fed into the model 
df_filtered["length_of_stay"] = (df_filtered["dischtime"] - df_filtered["admittime"]).dt.days
df_filtered["admit_month"] = df_filtered["admittime"].dt.month
df_filtered["admit_day"] = df_filtered["admittime"].dt.day

# drop the date and time type columns
df_filtered = df_filtered.drop(columns=["admittime", "dischtime", "dob", "next_admittime"])

# identify categorical columns 
categorical_cols = df_filtered.select_dtypes(include=['object']).columns

# apply Label Encoding to each categorical column
label_encoders = {} 
for col in categorical_cols:
    le = LabelEncoder() 
    df_filtered[col] = le.fit_transform(df_filtered[col].astype(str))  # Ensure NaNs are handled as strings
    label_encoders[col] = le  

df_filtered = df_filtered.dropna()


X = df_filtered.drop(columns=['readmitted']) 
y = df_filtered['readmitted'] 

# split into train and test sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# checking shapes
print(f"Train set: X_train={X_train.shape}, y_train={y_train.shape}")
print(f"Test set: X_test={X_test.shape}, y_test={y_test.shape}")

# handle the class imbalance using SMOTE
smote = SMOTE(sampling_strategy=0.1, random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train, y_train)
X_test_resampled, y_test_resampled = smote.fit_resample(X_test, y_test)

# define the model params
lgbm_params = {
    "objective": "binary",
    "metric": "binary_logloss",
    "is_unbalance": True,
    "boosting_type": "gbdt",
    "learning_rate": 0.05,
    "num_leaves": 31,
    "random_state": 42,
    "verbose": 1
}

model = lgb.LGBMClassifier(**lgbm_params)
model.fit(X_train_resampled, y_train_resampled)

# Make predictions on training data
y_pred_prob = model.predict(X_train_resampled)
y_pred = (y_pred_prob > 0.5).astype(int)

# Evaluate model performance on training data
accuracy = accuracy_score(y_train_resampled, y_pred)
print(f"Model Accuracy: {accuracy:.4f}")

# Make predictions on test data
y_pred_prob = model.predict(X_test_resampled)
y_pred = (y_pred_prob > 0.5).astype(int)

# Evaluate model performance on test data
accuracy = accuracy_score(y_test_resampled, y_pred)
print(f"Model Accuracy: {accuracy:.4f}")

# calculating the feature importance for every feature and sorting them 
feature_importance = model.feature_importances_
importance_df = pd.DataFrame({
    'Feature': X_train_resampled.columns,
    'Importance': feature_importance
}).sort_values(by='Importance', ascending=False)
print(importance_df)

# compute the confusion maxtrix 
cm = confusion_matrix(y_test_resampled, y_pred)

# Display the confusion matrix
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=[0, 1])
disp.plot(cmap="Blues")
plt.title("Confusion Matrix")
plt.show()

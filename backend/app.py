import pandas as pd
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the trained LGBM model
try:
    with open("lgbm_model.pkl", "rb") as f:
        model = pickle.load(f)
    print("✅ Model loaded successfully!")
except FileNotFoundError:
    print("❌ Error: lgbm_model.pkl not found!")

@app.route("/", methods=["GET"])
def home():
    return "API is running!"

@app.route("/predict_json", methods=["POST"])
def predict_json():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    print("📂 Received file:", file.filename)

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        print("📊 Reading CSV file...")
        df = pd.read_csv(file)
        print("✅ CSV file loaded successfully!")
        print(df.head())  # Debugging: Print first few rows

        # Ensure the file contains `subject_id`
        if "subject_id" not in df.columns:
            return jsonify({"error": "Missing 'subject_id' column in uploaded file"}), 400

        # Rename subject_id to patient_id
        df.rename(columns={"subject_id": "patient_id"}, inplace=True)

        # Make predictions using all columns (no dropping)
        print("🔍 Predicting readmission...")
        predictions = model.predict(df)  # Using all features
        print("✅ Prediction completed!")

        # Prepare response with `patient_id` and predictions
        df["readmitted_prediction"] = predictions.tolist()

        return jsonify(df[["patient_id", "readmitted_prediction"]].to_dict(orient="records"))

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

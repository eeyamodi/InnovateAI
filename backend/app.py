# # from flask import Flask, request, jsonify
# # from flask_cors import CORS

# # app = Flask(__name__)
# # CORS(app)  # Enable CORS for React frontend

# # @app.route("/predict", methods=["POST"])
# # def predict():
# #     data = request.json  # Receive data from React
# #     return jsonify({"prediction": "This is a dummy response"})

# # if __name__ == "__main__":
# #     app.run(debug=True)


# from flask import Flask, request, jsonify
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)  # Enable CORS for React frontend

# # Default route to check if the server is running
# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"message": "Flask server is running!"})

# @app.route("/predict", methods=["POST"])
# def predict():
#     data = request.json  # Receive data from React
#     return jsonify({"prediction": "This is a dummy response"})

# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import lightgbm as lgb
import pickle

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load trained LightGBM model
with open("lgbm_model_patient_readmission.pkl", "rb") as model_file:
    model = pickle.load(model_file)

# Define expected features
FEATURE_COLUMNS = ["age", "blood_pressure", "cholesterol", "diabetes", "smoking", "previous_admissions"]

@app.route("/predict_csv", methods=["POST"])
def predict_csv():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    
    file = request.files["file"]
    df = pd.read_csv(file)
    
    # Validate CSV format
    if not all(col in df.columns for col in FEATURE_COLUMNS):
        return jsonify({"error": "Invalid columns in CSV. Required: " + ", ".join(FEATURE_COLUMNS)}), 400
    
    # Extract features for prediction
    X = df[FEATURE_COLUMNS]
    predictions = model.predict(X)
    df["predicted_readmission"] = predictions
    
    return jsonify(df.to_dict(orient="records"))

if _name_ == "_main_":
    app.run(debug=True)
    
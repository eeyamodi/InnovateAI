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
    print("Model loaded successfully!")
except FileNotFoundError:
    print("Error: lgbm_model.pkl not found!")

@app.route("/", methods=["GET"])
def home():
    return "API is running!"

@app.route("/predict_json", methods=["POST"])
def predict_json():
    if "file" not in request.files:
        return jsonify({"error": "No file part in request"}), 400

    file = request.files["file"]
    print("Received file:", file.filename)

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Debugging
        print("Reading CSV file...")
        df = pd.read_csv(file)
        print("CSV file loaded successfully!")
        print(df.head())  # Print first few rows for debugging

        # Ensure necessary columns exist before prediction
        if "patient_id" not in df.columns:
            df["patient_id"] = range(1, len(df) + 1)

        # Drop patient_id before prediction
        features = df.drop(columns=["patient_id"], errors="ignore")

        # Ensure input format matches model
        print("Predicting readmission...")
        predictions = model.predict(features)
        print("Prediction completed!")

        # Prepare response
        results = df[["patient_id"]].copy()
        results["readmitted_prediction"] = predictions.tolist()
        return jsonify(results.to_dict(orient="records"))

    except Exception as e:
        print("Error:", e)  # Print the error in Flask terminal
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

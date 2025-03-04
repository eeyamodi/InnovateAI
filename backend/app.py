from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import pickle
import lightgbm as lgb

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Load the trained LightGBM model from the pickle file
with open("lgbm_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

@app.route("/predict_csv", methods=["POST"])
def predict_csv():
    """API endpoint to accept a CSV file, preprocess it, and return readmission predictions."""
    
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    df = pd.read_csv(file)

    # Check if 'readmitted' column exists and remove it
    if "readmitted" in df.columns:
        df.drop(columns=["readmitted"], inplace=True)

    # Make predictions using the loaded LightGBM model
    predictions = model.predict(df)

    # Convert predictions into a new column
    df["predicted_readmitted"] = predictions.tolist()

    # Return predictions as JSON
    return jsonify(df.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(debug=True)

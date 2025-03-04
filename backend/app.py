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
import os
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allows requests from React

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"message": "No file found"}), 400

    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    if file:
        file_path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
        file.save(file_path)

        # Read the Excel file (optional)
        df = pd.read_excel(file_path)
        print(df.head())  # Print first few rows to verify

        return jsonify({"message": "File uploaded successfully!", "filename": file.filename}), 200

if __name__ == "__main__":
    app.run(debug=True)

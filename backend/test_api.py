import requests

# API URL
url = "http://127.0.0.1:5000/predict"

# Open the CSV file
file = {"file": open("data/heart_failure_data.csv", "rb")}

# Send request
response = requests.post(url, files=file)

# Print response
print(response.json())

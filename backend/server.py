from flask import Flask, request, jsonify, send_from_directory
from api_request import get_adaptive_question, category_scores
import os

app = Flask(__name__, static_folder='.')

# Serve the main HTML page
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

# API endpoint for getting next question
@app.route('/api/next_question', methods=['POST'])
def next_question():
    data = request.json
    previous_answer = data.get('previous_answer')
    previous_category = data.get('previous_category')
    
    stored_result, display_result = get_adaptive_question(previous_answer, previous_category)
    
    if display_result is None:
        return jsonify({"error": "Failed to generate question"}), 400
    
    # Add the scores to the response (hidden from user in frontend)
    response = {
        "question": display_result["question"],
        "category": display_result["category"],
        "choices": display_result["choices"],
        "scores": stored_result["scores"]  # This will be used by frontend but not shown to user
    }
    
    return jsonify(response)

# Optional: API endpoint for getting final results
@app.route('/api/results', methods=['POST'])
def get_results():
    # You could implement additional analysis here
    return jsonify({"category_scores": category_scores})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
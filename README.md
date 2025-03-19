# Psychometrics AI Engine

This project demonstrates a simple adaptive psychometric assessment workflow for founders. It includes:

- **Python backend (api_request.py)** that uses OpenAI’s API to generate dynamic questions based on user responses.  
- **HTML/JS frontend (index.html)** that displays questions and collects user input, rendering progress and results.  

## How It Works

1. **Question Generation**  
   The `api_request.py` script uses a system prompt that references psychometric frameworks (e.g., Big Five, Grit) for question generation.

2. **Adaptive Flow**  
   Each question builds on the user’s previous answers to provide a customized assessment experience.

3. **Results Calculation**  
   After 10 questions, the code aggregates category scores and displays them in a simple summary.

## Getting Started

1. **Install Requirements**  
   - Python 3.7+  
   - Install dependencies (e.g., `openai`).

2. **Set Up OpenAI Key**  
   - Replace `API_KEY` in `api_request.py` with your OpenAI API key.

3. **Run the Application**  
   - Run `api_request.py` to start a command-line version of the assessment.  
   - Open `index.html` in a browser for the sample UI (modify or integrate with a server as needed).

## Contributing

1. Fork and clone the repository.  
2. Create branches for new features or fixes.  
3. Submit a pull request and describe your changes.


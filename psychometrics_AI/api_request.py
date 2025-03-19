import openai
import json

# Set your OpenAI API Key
API_KEY = "add-your-api-key-here"

# Initialize OpenAI client
client = openai.OpenAI(api_key=API_KEY)

# Store category-wise scores
category_scores = {}

# Function to get a question based on previous answer
def get_adaptive_question(previous_answer=None, previous_category=None):
    messages = [
        {
            "role": "system",
            "content": """
            You are an AI that generates **psychometric assessment questions for startup founders**. 
            Each question should be based on **validated psychometric frameworks**, such as:
            1. Big Five Personality Traits (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism)
            2. Risk Tolerance Framework
            3. Entrepreneurial Mindset Profile
            4. Decision-Making Under Uncertainty
            5. Cognitive Flexibility
            6. Leadership Style
            7. Grit and Perseverance
            8. Strategic Thinking
            
            If the user has already answered a question, **use their response to generate the next relevant question**.
            
            ### **Format for response (JSON)**
            {
              "question": "Next question based on user's previous answer...",
              "choices": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
              ],
              "category": "Relevant Category",  
              "scores": [1, 2, 3, 4]  
            }
            """
        }
    ]

    # Modify the user prompt if answering adaptively
    if previous_answer:
        user_message = {
            "role": "user",
            "content": f"My previous answer was: '{previous_answer}'. The question was about {previous_category}. Generate the next most relevant question based on my response."
        }
        messages.append(user_message)

    # Get AI-generated question
    response = client.chat.completions.create(
        model="gpt-4",
        messages=messages
    )

    # Extract response text
    response_text = response.choices[0].message.content

    # Parse JSON response
    try:
        data = json.loads(response_text)

        # Store full data including scores (hidden from user)
        stored_data = {
            "question": data["question"],
            "category": data["category"],
            "choices": data["choices"],
            "scores": data["scores"]  # Hidden but stored for evaluation
        }

        # Display only question and choices to the user
        display_data = {
            "question": data["question"],
            "category": data["category"],
            "choices": data["choices"]
        }

        return stored_data, display_data
    except json.JSONDecodeError:
        return {"error": "Failed to parse response"}, None

# Function to run the adaptive assessment
def run_assessment():
    previous_answer = None
    previous_category = None
    total_questions = 10  # Limit to 10 questions
    answered_questions = 0

    while answered_questions < total_questions:
        stored_result, display_result = get_adaptive_question(previous_answer, previous_category)

        if "error" in stored_result:
            print("Error:", stored_result["error"])
            break

        # Show question to user
        print(f"\nCategory: {display_result['category']}")
        print(f"Question: {display_result['question']}")
        print("Choices:")
        for idx, choice in enumerate(display_result["choices"], start=1):
            print(f"{idx}. {choice}")

        # User selects an answer
        user_choice = input("Enter the number of your choice (or type 'exit' to stop): ").strip()
        if user_choice.lower() == "exit":
            break

        try:
            user_choice_index = int(user_choice) - 1
            if user_choice_index not in range(4):
                print("Invalid choice. Please enter a number between 1 and 4.")
                continue
        except ValueError:
            print("Invalid input. Please enter a valid number.")
            continue

        # Save user response for next iteration
        previous_answer = display_result["choices"][user_choice_index]
        previous_category = display_result["category"]

        # Store score for the category
        category = stored_result["category"]
        score = stored_result["scores"][user_choice_index]
        if category not in category_scores:
            category_scores[category] = []
        category_scores[category].append(score)

        answered_questions += 1

    # Show final results
    display_final_results()

# Function to calculate and display final category scores
def display_final_results():
    print("\n=== Psychometric Assessment Results ===")
    for category, scores in category_scores.items():
        average_score = sum(scores) / len(scores)
        print(f"{category}: {average_score:.2f} / 4")

    print("\nAssessment complete! Your results indicate your strengths and areas for improvement.")

# Start the assessment
if __name__ == "__main__":
    run_assessment()
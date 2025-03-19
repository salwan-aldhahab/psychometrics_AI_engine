import openai

API_KEY = "replace-with-your-api-key"

client = openai.OpenAI(api_key=API_KEY)

try:
    response = client.models.list()
    print("Available Models:", [model.id for model in response.data])
except openai.OpenAIError as e:
    print("Error:", e)
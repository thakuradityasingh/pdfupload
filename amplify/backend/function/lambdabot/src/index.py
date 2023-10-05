import json

def lambda_handler(event, context):
    try:
        # Get the user's question from the Lambda event
        user_question = event['body']['question']

        # Process the question and generate an answer (replace with your logic)
        answer = process_question(user_question)

        # Prepare the response
        response = {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",  # Enable CORS for your frontend
            },
            "body": json.dumps({"answer": answer})
        }

        return response
    except Exception as e:
        # Handle any errors and return an appropriate error response
        error_response = {
            "statusCode": 500,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",  # Enable CORS for your frontend
            },
            "body": json.dumps({"error": str(e)})
        }
        return error_response

def process_question(question):
    # Replace this with your own logic to process the question and generate an answer
    # For this example, we're returning a hardcoded answer
    if "PDF" in question:
        return "Sure, I can help you with PDF editing!"
    else:
        return "I'm sorry, I don't understand the question."

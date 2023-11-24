import json

def lambda_handler(event, context):
    try:
        user_question = event.get("question", "").lower()  # Get the user's question and convert it to lowercase for case-insensitive comparison

        if "pdf" in user_question:
            # If the user's question contains "pdf," respond accordingly
            response_message = "I can help you with PDFs."
        else:
            # For other questions, you can provide a default response
            response_message = "Hello! How can I assist you?"

        # Return the response
        response = {"message": response_message}
        return {
            'statusCode': 200,
            'body': json.dumps(response)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }

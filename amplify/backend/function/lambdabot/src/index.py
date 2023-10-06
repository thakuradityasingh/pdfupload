import json

def lambda_handler(event, context):
    print("Hello Adi")
    return {
        "statusCode": 200,
        "body": "Hello Adi"
    }

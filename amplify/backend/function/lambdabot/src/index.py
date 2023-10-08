import boto3

def lambda_handler(event, context):
    # Get the bucket name from the event
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    
    # Create an S3 client
    s3_client = boto3.client('s3')
    
    # List all objects in the bucket
    response = s3_client.list_objects_v2(Bucket=bucket_name)
    
    # Extract and print the object keys
    if 'Contents' in response:
        object_keys = [obj['Key'] for obj in response['Contents']]
        print("Uploaded Files:")
        for key in object_keys:
            print(key)
    else:
        print("No objects found in the bucket.")


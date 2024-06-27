#!/bin/bash

FUNCTION_NAME=weatherHandler
REGION=eu-central-1

# Package your Lambda function
echo "Packaging Lambda function..."
zip -r deployment.zip . > /dev/null 2>&1

echo "Checking if the function exists..."
aws lambda get-function --function-name $FUNCTION_NAME --region $REGION > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "Function exists, updating..."
    aws lambda update-function-code --function-name $FUNCTION_NAME \
    --zip-file fileb://deployment.zip --region $REGION > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "Function updated successfully."
    else
        echo "Failed to update function."
    fi
else
    echo "function doesn't exist, creating..."
    aws lambda create-function --function-name $FUNCTION_NAME \
        --runtime nodejs18.x --role arn:aws:iam::959316667373:role/weather-fetcher-lambdaRole \
        --handler dist/weatherHandler.handler --zip-file fileb://deployment.zip \
        --region $REGION > /dev/null 2>&1

    if [ $? -eq 0 ]; then
        echo "Function created successfully."
    else
        echo "Failed to create function."
    fi
fi
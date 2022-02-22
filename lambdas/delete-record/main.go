package main

import (
  "context"

  "github.com/aws/aws-lambda-go/lambda"
  "github.com/aws/aws-sdk-go/aws"
  "github.com/aws/aws-sdk-go/aws/session"
  "github.com/aws/aws-sdk-go/service/dynamodb"
)

type MyEvent struct {
  Id string `json:"Id"`
}

func HandleRequest(ctx context.Context, event MyEvent) (string, error) {
  sess := session.Must(session.NewSessionWithOptions(session.Options{
    SharedConfigState: session.SharedConfigEnable,
  }))

  svc := dynamodb.New(sess)

  input := &dynamodb.DeleteItemInput{
    Key: map[string]*dynamodb.AttributeValue{
      "Id": {
        S: aws.String(event.Id),
      },
    },
    TableName: aws.String("Appointments"),
  }

  _, err := svc.DeleteItem(input)
  if err != nil {
    return "", err
  }

  return "", nil
}

func main() {
  lambda.Start(HandleRequest)
}

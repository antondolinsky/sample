package main

import (
  "context"
  "encoding/json"
  "errors"

  "github.com/aws/aws-lambda-go/lambda"
  "github.com/aws/aws-sdk-go/aws"
  "github.com/aws/aws-sdk-go/aws/session"
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type MyEvent struct {
  Password string `json:"Password"`
}

type Record struct {
  Id string
  Name string
  DateOfBirth string
  PhoneNumber string
  Email string
  Address string
  Photo string
  AppointmentStart string
  AppointmentDuration string
}

type User struct {
  Id string
  Password string
  Type string
}

func HandleRequest(ctx context.Context, event MyEvent) (string, error) {
  sess := session.Must(session.NewSessionWithOptions(session.Options{
    SharedConfigState: session.SharedConfigEnable,
  }))

  svc := dynamodb.New(sess)

  passwordParams := &dynamodb.ScanInput{
    TableName: aws.String("Users"),
  }

  passwordResult, err := svc.Scan(passwordParams)
  if err != nil {
    return "", err
  }

  passwordMatch := false
  for _, i := range passwordResult.Items {
    item := User{}
    err = dynamodbattribute.UnmarshalMap(i, &item)
    if err != nil {
      return "", err
    }
    if item.Type == "admin" && item.Password == event.Password {
      passwordMatch = true
    }
  }

  if passwordMatch == false {
    return "", errors.New("Wrong password")
  }

  appointmentsParams := &dynamodb.ScanInput{
    TableName: aws.String("Appointments"),
  }

  appointmentsResults, err := svc.Scan(appointmentsParams)
  if err != nil {
    return "", err
  }

  endpoint_result := "["
  for index, i := range appointmentsResults.Items {
    item := Record{}
    err = dynamodbattribute.UnmarshalMap(i, &item)
    if err != nil {
      return "", err
    }
    item_jsonmarshalled, _ := json.Marshal(item)
    endpoint_result += string(item_jsonmarshalled)
    if index < len(appointmentsResults.Items) - 1 {
      endpoint_result += ","
    }
  }
  endpoint_result += "]"

  return endpoint_result, nil
}

func main() {
  lambda.Start(HandleRequest)
}

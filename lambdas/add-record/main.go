package main

import (
  "context"
  "time"

  "github.com/aws/aws-lambda-go/lambda"
  "github.com/aws/aws-sdk-go/aws"
  "github.com/aws/aws-sdk-go/aws/session"
  "github.com/aws/aws-sdk-go/service/dynamodb"
  "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

type MyEvent struct {
  Name string `json:"Name"`
  DateOfBirth string `json:"DateOfBirth"`
  PhoneNumber string `json:"PhoneNumber"`
  Email string `json:"Email"`
  Address string `json:"Address"`
  Photo string `json:"Photo"`
  AppointmentStart string `json:"AppointmentStart"`
  AppointmentDuration string `json:"AppointmentDuration"`
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

func HandleRequest(ctx context.Context, event MyEvent) (string, error) {
  sess := session.Must(session.NewSessionWithOptions(session.Options{
    SharedConfigState: session.SharedConfigEnable,
  }))

  svc := dynamodb.New(sess)

  item := Record{
    Id: time.Now().String(),
    Name: event.Name,
    DateOfBirth: event.DateOfBirth,
    PhoneNumber: event.PhoneNumber,
    Email: event.Email,
    Address: event.Address,
    Photo: event.Photo,
    AppointmentStart: event.AppointmentStart,
    AppointmentDuration: event.AppointmentDuration,
  }

  av, err := dynamodbattribute.MarshalMap(item)
  if err != nil {
    return "", err
  }

  input := &dynamodb.PutItemInput{
    Item: av,
    TableName: aws.String("Appointments"),
  }

  _, err = svc.PutItem(input)
  if err != nil {
    return "", err
  }

  return "", nil
}

func main() {
  lambda.Start(HandleRequest)
}

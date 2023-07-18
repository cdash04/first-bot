#!/bin/bash
awslocal dynamodb create-table \
   --table-name dev-Table \
   --attribute-definitions AttributeName=pk,AttributeType=S \
   --attribute-definitions AttributeName=sk,AttributeType=S \
   --key-schema AttributeName=pk,KeyType=HASH \
   --key-schema AttributeName=pk,KeyType=RANGE \
   --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

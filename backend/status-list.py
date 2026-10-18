import json, boto3
from SubmissionStatus import SubmissionStatus

def lambda_handler(event, context):
  ss          = SubmissionStatus()
  status_list = ss.get_list()
  
  return { 
    'isBase64Encoded' : False,
    'statusCode' : 200,
    'headers' : {'Access-Control-Allow-Origin' : '*'},
    'body' : json.dumps({
      'status'      : 'OK', 
      'status_list' : status_list
    })
  }
  
  
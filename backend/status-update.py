import base64, boto3, json
from datetime import datetime
from argon2 import PasswordHasher
from SubmissionStatus import SubmissionStatus

def lambda_handler(event, context):
  data        = json.loads(event['body'])
  username    = data['username'] 
  subToken    = data['token']
  salt        = data['salt']
  submission  = data['submission']
  status      = data['status']
    
  ip          = event['requestContext']['identity']['sourceIp']
  ua          = event['requestContext']['identity']['userAgent']
  ts          = int(event['requestContext']['requestTimeEpoch'])
  
  client      = boto3.client('dynamodb')
    
  ph          = PasswordHasher()

  day_of_year = datetime.now().timetuple().tm_yday
  today_str   = username + str(day_of_year) + ua + ip + salt
  
  try:
    stoken   = base64.b64decode(subToken)
    verified = ph.verify(stoken, today_str)

    response = client.query(
      TableName='TMA-intake-submissions',
      Limit=1,
      KeyConditionExpression = 'id = :id AND ts = :ts',
      ExpressionAttributeValues = {':id' : {'S' : 'submission'}, ':ts' : {'N' : str(submission)}}    
    )
    if len(response['Items']):
      Entry = response['Items'][0]
      
      client.put_item(
        TableName = 'TMA-intake-submissions',
        Item      = {
          'id'      : { 'S' : 'submission' },
          'ts'      : { 'N' : str(submission) },
          'status'  : { 'S' : status },
          'content' : { 'S' : Entry['content']['S'] }
        }
      )

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
      

  except: 
    return { 
      'isBase64Encoded' : False,
      'statusCode' : 200,
      'headers' : {'Access-Control-Allow-Origin' : '*'},
      'body' : json.dumps({
        'status'   : 'Expired', 
        'message'  : 'Your login token has expired'
      })
    }    
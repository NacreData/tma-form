import base64, boto3, json
from datetime import datetime
from argon2 import PasswordHasher

def lambda_handler(event, context):
  data        = json.loads(event['body'])
  username    = data['username'] 
  subToken    = data['token']
  last_ts     = data['last_ts']
  submission  = data['submission']
  
  ip          = event['requestContext']['identity']['sourceIp']
  ua          = event['requestContext']['identity']['userAgent']
  ts          = int(event['requestContext']['requestTimeEpoch'])
  
  client      = boto3.client('dynamodb')
    
  ph          = PasswordHasher()

  day_of_year = datetime.now().timetuple().tm_yday

  response = client.query(
    TableName = 'TMA-intake-logins',
    IndexName = 'IP-index',
    KeyConditionExpression = 'IP = :ip',
    ExpressionAttributeValues = {':ip' : {'S' : ip}}    
  )
  for entry in response['Items']:
    if entry['status']['BOOL'] and entry['IP']['S'] == ip and entry['username']['S'] == username:    
      today_str   = username + str(day_of_year) + ua + ip + entry['salt']['S']
    
      try:
        stoken   = base64.b64decode(subToken)
        verified = ph.verify(stoken, today_str)
      
        response = client.query(
          TableName='TMA-intake-notes',
          Limit=1,
          ScanIndexForward=True,
          IndexName='submission-index',
          KeyConditionExpression = 'ts > :ts AND submission = :s',
          ExpressionAttributeValues = {':ts' : {'N' : str(last_ts)}, ':s' : {'N' : str(submission)}}    
        )
        if len(response['Items']):
          Entry = response['Items'][0]
      
          return { 
            'isBase64Encoded' : False,
            'statusCode' : 200,
            'headers' : {'Access-Control-Allow-Origin' : '*'},
            'body' : json.dumps({
              'status'     : 'OK', 
              'message'    : 'The token checks out',
              'timestamp'  : Entry['ts']['N'],
              'content'    : Entry['content']['S'],
              'submission' : Entry['submission']['N']
            })
          }    
      
        else:
          return { 
            'isBase64Encoded' : False,
            'statusCode' : 200,
            'headers' : {'Access-Control-Allow-Origin' : '*'},
            'body' : json.dumps({
              'status'    : 'OK', 
              'message'   : 'no further data'
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
        
  return { 
    'isBase64Encoded' : False,
    'statusCode' : 200,
    'headers' : {'Access-Control-Allow-Origin' : '*'},
    'body' : json.dumps({
      'status'   : 'Expired', 
      'message'  : 'Your login token has expired'
    })
  }            
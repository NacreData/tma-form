import json, boto3, base64
from botocore.exceptions import ClientError
from argon2 import PasswordHasher
from datetime import datetime


def lambda_handler(event, context):
  data        = json.loads(event['body'])
  username    = data['username'] 
  subToken    = data['token']
  content     = data['content']
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
      today_str  = username + str(day_of_year) + ua + ip + entry['salt']['S']
  
      try:
        stoken   = base64.b64decode(subToken)
        
        verified = ph.verify(stoken, today_str)

        client.put_item(
          TableName = 'TMA-intake-notes',
          Item      = {
            'note'        : { 'S' : 'note' },
            'ts'          : { 'N' : str((ts * 1000)) },
            'submission'  : { 'N' : str(data['submission']) },
            'status'      : { 'S' : 'New' }, # what is this used for? Might be hold over from copy/paste of submission? 
            'content'     : { 'S' : data['content'] }
          },
          ConditionExpression='attribute_not_exists(id) AND attribute_not_exists(ts)'
        )
  
        return { 
          'isBase64Encoded' : False,
          'statusCode' : 200,
          'headers' : {'Access-Control-Allow-Origin' : '*'},
          'body' : json.dumps({
            'status' : 'OK', 
            'ts'     : ts
          })
        }

      except:
        return { 
            'isBase64Encoded' : False,
            'statusCode' : 401,
            'headers' : {'Access-Control-Allow-Origin' : '*'},
            'body' : json.dumps({'status' : 'Error', 'message': 'Login Expired'})
        }
        

  # get to here if no matching entry or token has expired  

  return { 
      'isBase64Encoded' : False,
      'statusCode' : 401,
      'headers' : {'Access-Control-Allow-Origin' : '*'},
      'body' : json.dumps({'status' : 'Error', 'message': 'Login Expired'})
  }

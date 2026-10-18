import base64, boto3, json
from datetime import datetime
from argon2 import PasswordHasher

def get_next(last_ts, client):
  response = client.query(
    TableName='TMA-intake-submissions',
    Limit=1,
    ScanIndexForward=True,
    KeyConditionExpression = 'id = :id AND ts > :ts',
    ExpressionAttributeValues = {':id' : {'S' : 'submission'}, ':ts' : {'N' : last_ts}}    
  )
  if len(response['Items']):
    Entry = response['Items'][0]
    if 'Archived' == Entry['status']['S']:
      return get_next(Entry['ts']['N'], client)
    else:
      return Entry
  else:
    return False

def lambda_handler(event, context):
  data        = json.loads(event['body'])
  username    = data['username'] 
  subToken    = data['token']
  last_ts     = data['last_ts']
    
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
        
        result   = get_next(last_ts, client)
        
        if result:
          return { 
            'isBase64Encoded' : False,
            'statusCode' : 200,
            'headers' : {'Access-Control-Allow-Origin' : '*'},
            'body' : json.dumps({
              'status'    : 'OK', 
              'message'   : 'The token checks out',
              'timestamp' : result['ts']['N'],
              'content'   : result['content']['S'],
              'status'    : result['status']['S']
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
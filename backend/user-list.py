import base64, boto3, json
from datetime import datetime
from argon2 import PasswordHasher

def lambda_handler(event, context):
  data        = json.loads(event['body'])
  username    = data['username'] 
  subToken    = data['token']
    
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
        
        resp     = client.scan(
          TableName = 'TMA-intake-users'
        )
        users = []
        for u in resp['Items']:                    
          users.append({
            'username' : u['username']['S'],
            'id'       : u['id']['S'],
            'admin'    : u['admin']['BOOL'],
            'active'   : u['active']['BOOL']
          })
                
        return { 
          'isBase64Encoded' : False,
          'statusCode' : 200,
          'headers' : {'Access-Control-Allow-Origin' : '*'},
          'body' : json.dumps({
            'status' : 'OK', 
            'users'  : users
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
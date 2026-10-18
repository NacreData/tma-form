import json, boto3, base64, os
from datetime import datetime
from argon2 import PasswordHasher

def lambda_handler(event, context):
  data        = json.loads(event['body'])
  username    = data['username'].strip()
  subToken    = data['token']

  newUsername = data['newUsername'].strip()
  newPassSalt = data['newPassSalt']
  newPassHash = data['newPassHash']
  newEncMPriv = data['newEncMasterPriv']

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
      today_str = username + str(day_of_year) + ua + ip + entry['salt']['S']

      try:
        stoken   = base64.b64decode(subToken)
        verified = ph.verify(stoken, today_str)
        
        if newUsername != username:
          resp = client.query(
            TableName = 'TMA-intake-users',
            IndexName = 'username-index',
            KeyConditionExpression = 'username = :username',
            ExpressionAttributeValues = {':username' : {'S' : newUsername}}    
          )
          if len(resp['Items']):
            return { 
              'isBase64Encoded' : False,
              'statusCode' : 400,
              'headers' : {'Access-Control-Allow-Origin' : '*'},
              'body' : json.dumps({'status' : 'Error', 'message': 'Username already in use'})
            }

        resp = client.query(
          TableName = 'TMA-intake-users',
          IndexName = 'username-index',
          KeyConditionExpression = 'username = :username',
          ExpressionAttributeValues = {':username' : {'S' : username}}    
        )
        userID = resp['Items'][0]['id']['S']
        
        client.put_item(
          TableName = 'TMA-intake-users',
          Item      = {
            'id'           : { 'S' : userID },
            'password'     : { 'S' : ph.hash(newPassHash) }, 
            'encPrivKey'   : { 'S' : newEncMPriv },
            'passwordSalt' : { 'S' : newPassSalt },
            'admin'        : { 'BOOL' : resp['Items'][0]['admin']['BOOL'] },
            'active'       : { 'BOOL' : resp['Items'][0]['active']['BOOL'] },
            'username'     : { 'S' : newUsername } 
          }
        )
        
        return { 
          'isBase64Encoded' : False,
          'statusCode' : 200,
          'headers' : {'Access-Control-Allow-Origin' : '*'},
          'body' : json.dumps({
            'status'   : 'OK' 
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

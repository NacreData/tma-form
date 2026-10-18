# "FunctionName": "TMA-intake-add-user",
# "FunctionArn": "arn:aws:lambda:us-east-1:966479574466:function:TMA-intake-add-user",
# "LogGroup": "/aws/lambda/TMA-intake-add-user"

# aws lambda update-function-code --function-name "TMA-intake-add-user" --zip-file fileb:///Users/devin/Documents/Sites/TriangleMutualAid/form/python/add-user.py.zip

import json, boto3, base64, os
from datetime import datetime
from argon2 import PasswordHasher
from random import choices

def new_id(client, n=1):
  chars       = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
  id = ''.join(choices(chars, k=n))
  
  response = client.query(
    TableName                 = 'TMA-intake-users',
    KeyConditionExpression    = 'id = :id ',
    ExpressionAttributeValues = {':id' : {'S' : id}}    
  )

  if len(response['Items']):
    n = n + 1
    return new_id(n)
  else:
    return id

# ref notes-list for auth
def lambda_handler(event, context):
  data         = json.loads(event['body'])
  username     = data['username'].strip()
  subToken     = data['token']

  newUsername  = data['newUsername'].strip()
  newPassSalt  = data['newPassSalt']
  newPassHash  = data['newPassHash']
  newUserAdmin = data['newUserAdmin']
  myEncMPriv   = data['myEncMasterPriv']

  ip           = event['requestContext']['identity']['sourceIp']
  ua           = event['requestContext']['identity']['userAgent']
  ts           = int(event['requestContext']['requestTimeEpoch'])
  
  client       = boto3.client('dynamodb')
    
  ph           = PasswordHasher()
  day_of_year  = datetime.now().timetuple().tm_yday
    
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

        # Extra check for admin privlege
        resp = client.query(
          TableName = 'TMA-intake-users',
          IndexName = 'username-index',
          KeyConditionExpression = 'username = :username',
          ExpressionAttributeValues = {':username' : {'S' : username}}    
        )
        if not len(resp['Items']) or not resp['Items'][0]['admin']:
          return { 
            'isBase64Encoded' : False,
            'statusCode' : 400,
            'headers' : {'Access-Control-Allow-Origin' : '*'},
            'body' : json.dumps({'status' : 'Error', 'message': 'Insufficient permission'})
          }
        
        # Is this username already taken?
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
        
        client.put_item(
          TableName = 'TMA-intake-users',
          Item      = {
            'id'           : { 'S' : new_id(client) },
            'password'     : { 'S' : ph.hash(newPassHash) }, 
            'encPrivKey'   : { 'S' : myEncMPriv },
            'passwordSalt' : { 'S' : newPassSalt },
            'admin'        : { 'BOOL' : newUserAdmin },
            'username'     : { 'S' : newUsername },
            'active'       : { 'BOOL' : True }
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
 
     
  

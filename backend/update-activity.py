import base64, boto3, json
from datetime import datetime
from argon2 import PasswordHasher

def lambda_handler(event, context):
  data        = json.loads(event['body'])
  username    = data['username'] 
  subToken    = data['token']
  user_id     = str(data['user_id'])
  active      = data['active']
    
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

        resp = client.query(
          TableName = 'TMA-intake-users',
          KeyConditionExpression = 'id = :id',
          ExpressionAttributeValues = {':id' : {'S' : user_id}}    
        )
        
        u = resp['Items'][0]

        client.put_item(
          TableName = 'TMA-intake-users',
          Item      = {
            'id'           : { 'S' : user_id },
            'password'     : { 'S' : u['password']['S'] }, 
            'encPrivKey'   : { 'S' : u['encPrivKey']['S'] },
            'passwordSalt' : { 'S' : u['passwordSalt']['S'] },
            'admin'        : { 'BOOL' : u['admin']['BOOL'] },
            'active'       : { 'BOOL' : active },
            'username'     : { 'S' : u['username']['S'] } 
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

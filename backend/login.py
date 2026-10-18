import base64, boto3, json, os
from random import randint
from datetime import datetime
from argon2 import PasswordHasher

def lambda_handler(event, context):
  data     = json.loads(event['body'])
  username = data['username'].strip()
  password = data['password'].strip()

  ip       = event['requestContext']['identity']['sourceIp']
  ua       = event['requestContext']['identity']['userAgent']
  ts       = int(event['requestContext']['requestTimeEpoch'])

  client   = boto3.client('dynamodb')
  
  ph       = PasswordHasher()
 
  response = client.query(
    TableName = 'TMA-intake-users',
    IndexName = 'username-index',
    KeyConditionExpression = 'username = :username',
    ExpressionAttributeValues = {':username' : {'S' : username}}    
  )
  
  if len(response['Items']) and response['Items'][0]['active']['BOOL']:
    hashed    = response['Items'][0]['password']['S'].strip()
    id        = response['Items'][0]['id']['S']
    admin     = response['Items'][0]['admin']['BOOL']
    ePrivKey  = response['Items'][0]['encPrivKey']['S']
    passSalt  = response['Items'][0]['passwordSalt']['S']
      
    five   = ts - (5 * 60 * 1000)
    thisip = []
  
    response = client.query(
      TableName = 'TMA-intake-logins',
      IndexName = 'IP-index',
      KeyConditionExpression = 'IP = :ip',
      ExpressionAttributeValues = {':ip' : {'S' : ip}}    
    )
    if len(response['Items']):
      total  = 0
      recent = 0
  
      for Item in response['Items']:
        if False != Item['status']['BOOL']:
          if Item['username']['S'] == username:
            thisip.append(Item['id']['S'])
          next
        total = total + 1
        if Item['username']['S'] == username:
          thisip.append(Item['id']['S'])
      
        if int(Item['timestamp']['N']) >= five:
          recent = recent + 1 
        
        if recent > 10 or total > 100:
          h   = ph.hash(username + ip + str(ts))
          hb  = h.encode('utf-8')
          h64 = base64.b64encode(hb).decode('utf-8')
          
          client.put_item(
            TableName = 'TMA-intake-logins',
            Item      = {
              'id'        : { 'S' : h64 },
              'username'  : { 'S' : username },
              'timestamp' : { 'N' : str(ts) },
              'status'    : { 'BOOL' : False },
              'IP'        : { 'S' : ip }
            }
          )
        
          return { 
              'isBase64Encoded' : False,
              'statusCode' : 401,
              'headers' : {'Access-Control-Allow-Origin' : '*'},
              'body' : json.dumps({'status' : 'Error', 'message': 'Allowed number of attempts exceeded'})
          }
  
  
    response = client.query(
      TableName = 'TMA-intake-logins',
      IndexName = 'username-index',
      KeyConditionExpression = 'username = :username',
      ExpressionAttributeValues = {':username' : {'S' : username}}    
    )
    if len(response['Items']):
      total  = 0
      recent = 0
  
      for Item in response['Items']:
        if False != Item['status']['BOOL']:
          next
        total = total + 1
      
        if int(Item['timestamp']['N']) >= five:
          recent = recent + 1 
        
        if recent > 10 or total > 100:
          h   = ph.hash(username + ip + str(ts))
          hb  = h.encode('utf-8')
          h64 = base64.b64encode(hb).decode('utf-8')

          client.put_item(
            TableName = 'TMA-intake-logins',
            Item      = {
              'id'        : { 'S' : h64 },
              'username'  : { 'S' : username },
              'timestamp' : { 'N' : str(ts) },
              'status'    : { 'BOOL' : False },
              'IP'        : { 'S' : ip }
            }
          )
        
          return { 
              'isBase64Encoded' : False,
              'statusCode' : 401,
              'headers' : {'Access-Control-Allow-Origin' : '*'},
              'body' : json.dumps({'status' : 'Error', 'message': 'Allowed number of attempts exceeded'})
          }
  
 
    
    try:
      verified = ph.verify(hashed, password)

      for attempt in thisip:
        client.delete_item(
          TableName = 'TMA-intake-logins',
          Key = {'id' : {'S' : attempt}}
        )  

      day_of_year = datetime.now().timetuple().tm_yday
      saltTok     = base64.urlsafe_b64encode(os.urandom(16)).decode('utf8')
      today_str   = username + str(day_of_year) + ua + ip + saltTok
      token       = base64.b64encode(ph.hash(today_str).encode('utf-8')).decode('utf-8')

      h   = ph.hash(username + ip + str(ts))
      hb  = h.encode('utf-8')
      h64 = base64.b64encode(hb).decode('utf-8')
      
      client.put_item(
        TableName = 'TMA-intake-logins',
        Item      = {
          'id'        : { 'S' : h64 },
          'username'  : { 'S' : username },
          'timestamp' : { 'N' : str(ts) },
          'status'    : { 'BOOL' : verified },
          'IP'        : { 'S' : ip },
          'token'     : { 'S' : token },
          'salt'      : { 'S' : saltTok }
        }
      )

      return { 
        'isBase64Encoded' : False,
        'statusCode' : 200,
        'headers' : {'Access-Control-Allow-Origin' : '*'},
        'body' : json.dumps({
          'status'   : 'OK', 
          'token'    : token,
          'admin'    : admin,
          'userID'   : id,
          'ePrivKey' : ePrivKey,  # master key, encoded with a pass-derived key
          'passSalt' : passSalt
        })
      }

      
    except:
      h   = ph.hash(username + ip + str(ts))
      hb  = h.encode('utf-8')
      h64 = base64.b64encode(hb).decode('utf-8')
      
      client.put_item(
        TableName = 'TMA-intake-logins',
        Item      = {
          'id'        : { 'S' : h64 },
          'username'  : { 'S' : username },
          'timestamp' : { 'N' : str(ts) },
          'status'    : { 'BOOL' : False },
          'IP'        : { 'S' : ip }
        }
      )
    
      return { 
          'isBase64Encoded' : False,
          'statusCode' : 401,
          'headers' : {'Access-Control-Allow-Origin' : '*'},
          'body' : json.dumps({
            'status' : 'Error', 
            'message': 'Incorrect login'
          })
      }
  
  else: 
    h   = ph.hash(username + ip + str(ts))
    hb  = h.encode('utf-8')
    h64 = base64.b64encode(hb).decode('utf-8')

    client.put_item(
      TableName = 'TMA-intake-logins',
      Item      = {
        'id'        : { 'S' : h64 },
        'username'  : { 'S' : username },
        'timestamp' : { 'N' : str(ts) },
        'status'    : { 'BOOL' : False },
        'IP'        : { 'S' : ip }
      }
    )
  
    return { 
        'isBase64Encoded' : False,
        'statusCode' : 401,
        'headers' : {'Access-Control-Allow-Origin' : '*'},
        'body' : json.dumps({'status' : 'Error', 'message': 'Incorrect login'})
    }
 
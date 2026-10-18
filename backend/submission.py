import json, boto3
from botocore.exceptions import ClientError

def lambda_handler(event, context):
  data   = json.loads(event['body'])
  ts     = int(event['requestContext']['requestTimeEpoch'] * 1000)
  client = boto3.client('dynamodb')
  
  try: 
    client.put_item(
      TableName = 'TMA-intake-submissions',
      Item      = {
        'id'      : { 'S' : 'submission' },
        'ts'      : { 'N' : str(ts) },
        'status'  : { 'S' : 'New' },
        'content' : { 'S' : data['content'] }
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
  

  except ClientError as e:
    try: 
      client.put_item(
        TableName = 'TMA-intake-submissions',
        Item      = {
          'id'      : { 'S' : 'submission' },
          'ts'      : { 'N' : str((ts + 1)) },
          'status'  : { 'S' : 'new' },
          'content' : { 'S' : data['content'] }
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
    

    except ClientError as e:
      try: 
        client.put_item(
          TableName = 'TMA-intake-submissions',
          Item      = {
            'id'      : { 'S' : 'submission' },
            'ts'      : { 'N' : str((ts + 2)) },
            'status'  : { 'S' : 'new' },
            'content' : { 'S' : data['content'] }
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
          'statusCode' : 400,
          'headers' : {'Access-Control-Allow-Origin' : '*'},
          'body' : json.dumps({
            'status'  : 'Error', 
            'message' : 'Error saving'
          })
        }
  
  
  
  
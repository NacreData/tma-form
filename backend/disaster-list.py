import json, boto3

def lambda_handler(event, context):

  client   = boto3.client('dynamodb')
  response = client.scan(
    TableName = 'TMA-intake-configuration',
  )   
  for c in response['Items']:
    return { 
      'isBase64Encoded' : False,
      'statusCode' : 200,
      'headers' : {'Access-Control-Allow-Origin' : '*'},
      'body' : json.dumps({
        'status' : 'OK', 
        'flood'  : c['flood']['BOOL'],
        'storm'  : c['storm']['BOOL'],
        'snow'   : c['snow']['BOOL'],
        'heat'   : c['heat']['BOOL'],
        'fire'   : c['fire']['BOOL']
      })
    }
    
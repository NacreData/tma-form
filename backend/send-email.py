import json, boto3

def lambda_handler(event, context):

  data = json.loads(event['body'])
  username    = data['username'] 
  subToken    = data['token']
  
  newUsername = data['newUsername']
  email       = data['email']
  newPassword = data['newPassword']
  
  msgPlain = f"""
Welcome to the TMA Disaster Response Backend. 
Your username is: {newUsername}
Your password is: {newPassword}
"""

  msgHtml = msgPlain.replace("\n", "<br>\n")
  sendMessage('info@nacredata.com', email, 'TMA Disaster Response Backend', msgHtml, msgPlain)

  return { 
    'isBase64Encoded' : False,
    'statusCode' : 200,
    'headers' : {'Access-Control-Allow-Origin' : '*'},
    'body' : json.dumps({
      'status' : 'OK', 
    })
  }


def sendMessage(sender, to, subject, msgHtml, msgPlain, attachmentFile=None):
  ses_client = boto3.client('ses')
  response   = ses_client.send_email(
    Source=sender,
    Destination={
        'ToAddresses': [
            to
        ]
    },
    Message={
        'Subject': {
            'Data': subject,
            'Charset': 'ASCII'
        },
        'Body': {
            'Text': {
                'Data': msgPlain,
                'Charset': 'utf8'
            },
            'Html': {
                'Data': msgHtml,
                'Charset': 'utf8'
            }
        }
    },
    ReplyToAddresses=[
        'devin@nacredata.com',
    ]
  )
  
  return response

import json, boto3, copy

class SubmissionStatus(object):
  def __init__(self, id=None):
    self.options = ['New', ]
    self.client  = boto3.client('dynamodb')
    
  def query(self):
    response = self.client.scan(
      TableName = 'TMA-intake-submissions',
    )  
    
    for s in response['Items']: 
      if 'status' in s and s['status']['S'] not in self.options:
        self.options.append(s['status']['S'])
        
  def get_list(self):
    self.query()
    
    l = copy.deepcopy(self.options)
    
    l = sorted(l, key=str.casefold)
    
    l.append('Other')
    
    return l 
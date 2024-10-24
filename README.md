# development
## env vars
- copy env file `cp .env.sample .env`
- fill in with required values
## new layers
- create new classes in `layer/shared`, e.g.
```
# layer/shared/helper.py

class HelperClass:
    def __init(self, stuff):
        self.stuff = stuff
    
    def do_things(self):
        return self.stuff * 2
```
- then use them in your functions:
```
# functions/some-function/handler.py

from shared.helper import HelperClass

h = HelperClass(stuff)
h.do_things()
```
## create functions
- create new functions as `functions/<function-name>/handler.py`
```
def handler(event, _)
    return json.dumps({ 'tee': 'hee' })
```

# deployment
## do everything
- run `. deploy.sh`

## just build
- Run `make build_all` to generate `out/functions.zip` and `out/layer.zip`

## build & upload
- Run `make deploy_zips` to build & upload zip files

### authentication
- create IAM user
- create access key / secret
- run `aws configure` to set it up

## deploy cdk
- make sure it works: `cdk synthesize`
- if this is the first deployment to an account, run `cdk bootstrap`
- run `cdk deploy --parameters rbDeploymentId=$deployment_id`

# resources
- helpful tutorial: https://dev.to/fwojciec/how-to-structure-a-python-aws-serverless-project-4ace

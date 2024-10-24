#!/bin/bash

# cleanup
rm out/*.zip

# generate unique deployment ID
deployment_id=$(uuidgen)

# active venv
source .venv/bin/activate

# build files
make build_all

# upload to s3 with unique names
aws s3 cp out/functions.zip "s3://my-cdk-assets/functions/${deployment_id}.zip"
aws s3 cp out/layer.zip "s3://my-cdk-assets/layer/${deployment_id}.zip"

# set variable for CDK to read
# export RB_CDK_DEPLOYMENT_ID="${deployment_id}"

# cdk deployment
cd cdk; npm i; cdk deploy --parameters rbDeploymentId=$deployment_id

# all done
cd ..; deactivate

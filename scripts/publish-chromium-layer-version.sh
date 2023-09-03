# check if the bucket exists
bucketName="pokedex-api-chromium"

# update the version number
versionNumber="112"

# make sure the aws cli is installed and configured
aws s3 cp chromium-v112.0.2-layer.zip "s3://${bucketName}/chromiumLayers/chromium${versionNumber}.zip"
aws lambda publish-layer-version --layer-name chromium --description "Chromium v${versionNumber}" --content "S3Bucket=${bucketName},S3Key=chromiumLayers/chromium${versionNumber}.zip" --compatible-runtimes nodejs --compatible-architectures x86_64
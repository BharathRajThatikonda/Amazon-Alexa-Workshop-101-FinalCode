\rm -fr lambda_upload.zip 
zip -r lambda_upload.zip index.js node_modules  package.json package-lock.json details.js
aws lambda update-function-code --function-name MovieLibrary --zip-file fileb://lambda_upload.zip
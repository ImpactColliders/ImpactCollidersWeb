$env:AWS_PAGER = ""
$env:AWS_DEFAULT_OUTPUT = "json"

Write-Host "[*] Syncing content/"
aws s3 sync `
    content s3://impact-colliders/content

Write-Host "[*] Syncing website/"
aws s3 sync `
    --exclude ".git/*" `
    --exclude "content/*" `
    --exclude "*.pem" `
    --exclude "*.ps1" `
    --delete  `
    . s3://impact-colliders/website

Write-Host "[*] Invalidating cloudfront cache"
aws cloudfront create-invalidation `
    --distribution-id E96C4MHLZ4061 `
    --paths "/*"

Write-Host "[*] Deploying website"
aws amplify start-deployment `
    --app-id d3dt3h2w2phi5b `
    --branch production `
    --source-url s3://impact-colliders/website/ `
    --source-url-type BUCKET_PREFIX
#!/bin/sh

export AWS_PAGER=""
export AWS_DEFAULT_OUTPUT="json"

echo "[*] Syncing content/"
aws s3 sync \
    content s3://impact-colliders/content

echo "[*] Syncing website/"
aws s3 sync \
    --exclude ".git/*" \
    --exclude "content/*" \
    --exclude "*.pem" \
    --exclude "*.ps1" \
    --delete  \
    . s3://impact-colliders/website

echo "[*] Invalidating cloudfront cache"
aws cloudfront create-invalidation \
    --distribution-id E96C4MHLZ4061 \
    --paths "/*"

echo "[*] Deploying website"
aws amplify start-deployment \
    --app-id d3dt3h2w2phi5b \
    --branch production \
    --source-url s3://impact-colliders/website/ \
    --source-url-type BUCKET_PREFIX
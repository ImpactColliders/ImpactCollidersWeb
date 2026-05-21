# Deploy to impactcolliders.com

The website is hosted on AWS S3 + CloudFront. Pushing to GitHub does **not** auto-deploy — you must run the deploy script from your local machine.

## One-time setup (do once per machine)

```
brew install awscli
```
```
aws login --profile root
```
When prompted for region, enter:
```
ap-southeast-2
```

## Every deploy

```
export AWS_PROFILE=root
```
```
cd /Users/avinteo/Documents/GitHub/ImpactCollidersWeb
```
```
git pull
```

*(make your file changes now)*

```
git add .
```
```
git commit -m "describe changes"
```
```
git push
```
```
./sync_and_deploy.sh
```

Wait 1–2 min, then check the live site.

## If it breaks

Permission denied:
```
chmod +x sync_and_deploy.sh
```

Auth error:
```
aws login --profile root
```

Old version still showing → CloudFront cache; wait 2–3 more minutes or hard-refresh (Cmd+Shift+R).

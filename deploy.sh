#!/bin/bash
set -e
npm run build
cd dist
echo "lila.nicpon.com" > CNAME
rm -rf .git
git init -b gh-pages -q
git add .
git commit -q -m "deploy"
git push -f git@github.com:lilaland/me.git gh-pages:gh-pages

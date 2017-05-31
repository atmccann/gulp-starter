#!/bin/bash

npm run build
rm -rf .tmp
mv _site .tmp
git checkout master
cp -r .tmp/* .
git add .
git commit -m "rebuild"
git push origin master
git checkout src
echo "New site pushed successfully."
rm -rf .tmp
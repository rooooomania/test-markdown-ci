#!/bin/bash
echo 'create index.md'

URL="http://markdown-converter.s3-website-ap-northeast-1.amazonaws.com/artifacts"
URL_ESCAPED=$(echo $URL |sed 's/\//\\\//g')
find ./docs -type f |grep -e "^\./docs/" |grep -e '.*\.md$' | sed 's/^\./'${URL_ESCAPED}\n'/g' |sed 's/\.md/\.html/g' > ./docs/index.md

echo 'index.md has been created'

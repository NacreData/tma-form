#!/bin/sh

sed -i -e 's/\/assets/.\/assets/g' dist/index.html
sed -i -e 's/\/assets/.\/assets/g' dist/assets/*.js
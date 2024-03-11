#!/bin/sh
npm run build
rm -rf /var/www/sedstartf
cp -r build /var/www/sedstartf
chmod -R 777 /var/www
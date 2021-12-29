#!/usr/bin/env sh
C_FILE="/usr/share/nginx/html/app-config.js"

cp $C_FILE.sample $C_FILE
sed -i "s/\${DOMAIN}/${DOMAIN}/g" $C_FILE
sed -i "s/\${SUBDOMAIN}/${SUBDOMAIN}/g" $C_FILE
sed -i "s/\${DICOM_USERNAME}/${DICOM_USERNAME}/g" $C_FILE
sed -i "s/\${DICOM_PASSWORD}/${DICOM_PASSWORD}/g" $C_FILE

javascript-obfuscator $C_FILE --output $C_FILE --compact true --string-array-encoding 'rc4' --string-array-threshold 1 --self-defending true
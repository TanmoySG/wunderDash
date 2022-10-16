WDB_URL=$1
OUT_FILE=$2/wdb.secrets.json

TEMPLATE_CONFIG='{"WDB_URL" : ""}'

echo $TEMPLATE_CONFIG | jq --arg URL "${WDB_URL}"  '.WDB_URL=$URL' > $OUT_FILE
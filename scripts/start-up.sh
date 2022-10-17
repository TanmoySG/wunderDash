# ENV VAR $WDB_URL
BASEDIR=$(dirname "$0")

OUT_FILE=$1/src/assets/wdb.secrets.json

TEMPLATE_CONFIG='{"WDB_URL" : ""}'

echo $TEMPLATE_CONFIG | jq --arg URL "${WDB_URL}"  '.WDB_URL=$URL' > $OUT_FILE

# CONFIG_PATH=$1/src/assets
# sh $(dirname "$0")/gen-wdb-secret.sh $WDB_URL $CONFIG_PATH

# cat $OUT_FILE
npm run build

serve build
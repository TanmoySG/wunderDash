# ENV VAR $WDB_URL
BASEDIR=$(dirname "$0")

CONFIG_PATH=$1/src/assets
sh $(dirname "$0")/gen-wdb-secret.sh $WDB_URL $CONFIG_PATH

cat $CONFIG_PATH/wdb.secrets.json
npm run build
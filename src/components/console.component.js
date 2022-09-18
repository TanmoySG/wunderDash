import React, { useState, useEffect, Fragment } from 'react';
import logo from '../assets/wdash.png';
import { Avatar, Position, Menu as MenuE, Button as ButtonE, Table as TableE, SideSheet } from 'evergreen-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TreeView, TreeItem } from '@material-ui/lab';
import { List, ListItem, ListItemText, Divider, Typography, Grid, Drawer, Fade, Paper, MenuItem, AccordionDetails, Menu as MenuM, Button as ButtonM } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { faCube, faChevronCircleDown, faChevronCircleRight, faCopy, faCubes, faDatabase, faExclamationCircle, faInfoCircle, faKey, faLayerGroup, faLock, faSpinner, faUserAstronaut, faChevronRight, faProjectDiagram, faTimesCircle, faTable, faLightbulb, faStream } from '@fortawesome/free-solid-svg-icons';
import { MenuBookSharp } from '@material-ui/icons';


function Console(props) {

    var endpoint = "https://wdb.tanmoysg.com/connect?cluster=" + sessionStorage.getItem("cluster_id") + "&token=" + sessionStorage.getItem("access_token");

    const [process, setProcess] = useState('Ready');

    const [database, setDatabase] = useState();
    const [collection, setCollection] = useState();

    const [data, setData] = useState();
    const [displayableScheme, setDisplayableScheme] = useState();
    const [error, setError] = useState();

    const [openSchemaDialog, setOpenSchemaDialog] = useState(false);

    const colors = props.colors;

    const fetchData = () => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "get-data",
                "payload": {
                    "database": database,
                    "collection": collection
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response)
            } else {
                var processedData = json.data;
                var dataSchema = json.schema;
                setData({ data: processedData, schema: dataSchema });
                setError();
                setProcess('Fetched');
            };
        })
    }

    if (collection !== props.collection) {
        console.log("Updated");
        setDatabase(props.database);
        setCollection(props.collection);
        setProcess('Ready');
        setDisplayableScheme();
        fetchData();
    }

    useEffect(() => {
        setDatabase(props.database);
        setCollection(props.collection);
        setProcess('Ready');
        fetchData();
        /*return () => {
            cleanup
        }*/
    }, [props.database, props.collection])



    return (
        <div style={{ padding: "10px", height: "100%" }}>
            <Grid container direction="row" style={{ height: "100%" }} spacing={1} >
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                    <Paper variant="outlined" style={{ borderRadius: "7.5px" }}>
                        <Grid container direction="row" alignItems="center">
                            <Grid item xs={12} sm={12} md={12} lg={3} xl={3} style={{ borderRight: "solid 2px #e7e7e7" }}>
                                <div style={{ width: "100%", padding: "15px" }}>
                                    <Typography style={{ fontSize: "0.825rem", fontFamily: "Work Sans" }}>
                                        Mounted Database
                                    </Typography>
                                    <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans", color: colors.red.accentColor, fontWeight: "500" }}>
                                        <FontAwesomeIcon icon={faDatabase} style={{ marginRight: "5px", color: colors.red.accentColor }} />
                                        {database ? database : "None"}
                                    </Typography>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={5} xl={5} style={{ borderRight: "solid 2px #e7e7e7" }}>
                                <div style={{ padding: "15px" }}>
                                    <Grid container direction="row" justify="space-between" alignItems="flex-start">
                                        <Grid item>
                                            <Typography style={{ fontSize: "0.825rem", fontFamily: "Work Sans" }}>
                                                Mounted Collection
                                            </Typography>
                                            <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans" }}>
                                                <FontAwesomeIcon icon={faCube} style={{ fontSize: "1rem", marginRight: "5px", color: colors.red.accentColor }} />
                                                {database ? database : "None"}
                                                <FontAwesomeIcon icon={faChevronRight} style={{ margin: "0px 5px", color: colors.red.accentColor }} />
                                                <span style={{ color: colors.red.accentColor, fontWeight: "500" }}>{collection ? collection : "None"}</span>
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography style={{ fontSize: "0.875rem", fontFamily: "Work Sans" }}>
                                                Data Size: {data ? Object.keys(data.data).length : 0}
                                            </Typography>
                                            <Typography style={{ fontSize: "0.875rem", fontFamily: "Work Sans" }}>
                                                Field Count: {data ? Object.keys(data.schema).length : 0}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
                                <div style={{ width: "100%", padding: "15px" }}>
                                    <ButtonM onClick={() => { setOpenSchemaDialog(!openSchemaDialog) }} size="small" variant="contained" style={{ marginTop: "5px", color: colors.red.accentColor, backgroundColor: colors.red.backgroundColor, fontFamily: "Work Sans" }}>
                                        View Schema
                                    </ButtonM>
                                    <SideSheet isShown={openSchemaDialog}
                                        position={Position.Right}
                                        onCloseComplete={() => { setOpenSchemaDialog(!openSchemaDialog) }}
                                    >
                                        <div style={{ padding: "25px" }}>
                                            <Grid container direction="column" justify="center" alignItems="stretch" spacing={2}>
                                                <Grid item>
                                                    <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans", color: colors.red.accentColor, fontWeight: "500" }}>
                                                        <FontAwesomeIcon icon={faProjectDiagram} style={{ fontSize: ".875rem", marginRight: "5px" }} />
                                                        Collection Schema
                                                    </Typography>
                                                </Grid>
                                                <Grid item >
                                                    <Typography style={{ fontSize: "0.9rem", fontFamily: "Work Sans" }}>
                                                        <FontAwesomeIcon icon={faCube} style={{ fontSize: "0.875rem", marginRight: "5px", color: colors.red.accentColor }} />
                                                        Collection: <span style={{ color: colors.red.accentColor, fontWeight: "500" }}>{collection}</span>
                                                    </Typography>
                                                    <Typography style={{ fontSize: "0.9rem", fontFamily: "Work Sans" }}>
                                                        <FontAwesomeIcon icon={faTable} style={{ fontSize: "0.875rem", marginRight: "5px", color: colors.red.accentColor }} />
                                                        Field Count: <span style={{ color: colors.red.accentColor, fontWeight: "500" }}>{data ? Object.keys(data.schema).length : 0}</span>
                                                    </Typography>
                                                </Grid>
                                                <Grid item style={{ width: "100%" }}>
                                                    <TableE style={{ width: "100%" }}>
                                                        <TableE.Head>
                                                            <TableE.TextHeaderCell>Name</TableE.TextHeaderCell>
                                                            <TableE.TextHeaderCell>Description</TableE.TextHeaderCell>
                                                        </TableE.Head>
                                                        <TableE.Body>
                                                            {
                                                                data ? Object.keys(data.schema).map((scheme) => (
                                                                    <TableE.Row isSelectable onSelect={() => setDisplayableScheme({ key: scheme, value: data.schema[scheme] })}>
                                                                        <TableE.TextCell>
                                                                            {scheme ? scheme : undefined}
                                                                            {
                                                                                scheme === "_id" ? <FontAwesomeIcon icon={faKey} style={{ fontSize: "0.875rem", marginLeft: "5px", color: "#ffb100" }} /> : undefined
                                                                            }
                                                                        </TableE.TextCell>
                                                                        <TableE.TextCell>{data.schema[scheme]}</TableE.TextCell>
                                                                    </TableE.Row>
                                                                )) : undefined
                                                            }
                                                        </TableE.Body>
                                                    </TableE>
                                                </Grid>
                                                {
                                                    displayableScheme ?
                                                        <Grid item>
                                                            <div style={{ borderRadius: "5px", border: "solid 1px #e7e7e7", padding: "10px" }}>
                                                                <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans", color: colors.red.accentColor, fontWeight: "500" }}>
                                                                    Schema Spotlight
                                                                </Typography>
                                                                <Typography style={{ margin: "10px 0", fontSize: "0.875rem", fontWeight: "500", fontFamily: "Work Sans" }}>
                                                                    <span style={{ marginRight: "5px", fontWeight: "600", fontStyle: "italic", backgroundColor: colors.red.backgroundColor, padding: "7px 7px", borderRadius: "4px", color: colors.red.accentColor }}>
                                                                        {displayableScheme.key}
                                                                    </span>
                                                                    - {displayableScheme.value}
                                                                </Typography>
                                                                {
                                                                    displayableScheme.key === "_id" ?
                                                                        <Typography style={{ color: "black", fontFamily: 'Work Sans', fontSize: "0.675rem" }} >
                                                                            <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#ffb100" }} /> ID is an unique identifier field for each data. ID helps isolate each data from the others in the collection.
                                                                        </Typography> : undefined
                                                                }
                                                            </div>
                                                        </Grid>
                                                        : undefined
                                                }
                                            </Grid>
                                        </div >
                                    </SideSheet >
                                </div >
                            </Grid >
                        </Grid >
                    </Paper >
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ height: "90%" }}>
                    <Grid container direction="row" style={{ height: "100%", padding: "10px 0 5px 0" }}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ height: "100%" }}>
                            <Grid container direction="row" style={{ height: "100%" }} spacing={1}>
                                <Grid item xs={12} sm={12} md={12} lg={3} xl={3} style={{ height: "100%" }}>
                                    <Paper variant="outlined" style={{ height: "100%", padding: "15px", borderRadius: "7.5px", overflow: "auto" }}>
                                        <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans", fontWeight: "500" }}>
                                            <span style={{ marginRight: "5px", fontWeight: "500", fontStyle: "italic", backgroundColor: colors.red.backgroundColor, height: "calc(0.875rem+5px)", width: "calc(0.875rem+5px)", padding: "5px 5px", borderRadius: "4px", color: colors.red.accentColor }}>
                                                <FontAwesomeIcon icon={faKey} style={{ fontSize: "1rem", color: colors.red.accentColor }} />
                                            </span>
                                            Identifier
                                        </Typography>
                                            {
                                                data ?
                                                    Object.keys(data.data).map((uid) => {
                                                        <Typography  >
                                                            {uid}
                                                        </Typography>
                                                    })
                                                    : undefined
                                            }
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={5} xl={5} style={{ height: "100%" }}>
                                    <Paper variant="outlined" style={{ height: "100%", padding: "15px", borderRadius: "7.5px", overflow: "auto" }}>
                                        <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans", fontWeight: "500" }}>
                                            <span style={{ marginRight: "5px", fontWeight: "500", fontStyle: "italic", backgroundColor: colors.red.backgroundColor, height: "calc(0.875rem+5px)", width: "calc(0.875rem+5px)", padding: "5px 5px", borderRadius: "4px", color: colors.red.accentColor }}>
                                                <FontAwesomeIcon icon={faStream} style={{ fontSize: "1rem", color: colors.red.accentColor }} />
                                            </span>
                                            Stream
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ height: "100%" }}>
                                    <Paper variant="outlined" style={{ height: "100%", padding: "15px", borderRadius: "7.5px", overflow: "auto" }}>
                                        <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans", fontWeight: "500" }}>
                                            <span style={{ marginRight: "5px", fontWeight: "500", fontStyle: "italic", backgroundColor: colors.red.backgroundColor, height: "calc(0.875rem+5px)", width: "calc(0.875rem+5px)", padding: "5px 5px", borderRadius: "4px", color: colors.red.accentColor }}>
                                                <FontAwesomeIcon icon={faLightbulb} style={{ fontSize: "1rem", color: colors.red.accentColor }} />
                                            </span>
                                            Spotlight
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid >
        </div>
    );
}

export default Console;
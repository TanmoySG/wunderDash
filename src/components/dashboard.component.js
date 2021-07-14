import React, { useState, useEffect } from 'react';
import logo from '../assets/wdash.png';
import colils from '../assets/Logistics-bro.svg';
import { Avatar, Position, Menu as MenuE, Popover, Button as ButtonE, SelectMenu } from 'evergreen-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TreeView, TreeItem } from '@material-ui/lab';
import { AppBar, Toolbar, FormControl, Input, Typography, Grid, Accordion, AccordionSummary, Chip, MenuItem, AccordionDetails, Menu as MenuM, Button as ButtonM } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { faCube, faChevronCircleDown, faChevronCircleRight, faCopy, faCubes, faDatabase, faExclamationCircle, faInfoCircle, faKey, faLayerGroup, faLock, faSpinner, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';
import { MenuBookSharp } from '@material-ui/icons';
import Console from './console.component';


function Dashboard(props) {

    var endpoint = "https://wdb.tanmoysg.com/connect?cluster=" + sessionStorage.getItem("cluster_id") + "&token=" + sessionStorage.getItem("access_token");

    var userData = {
        cluster_id: sessionStorage.getItem("cluster_id"),
        access_token: sessionStorage.getItem("access_token"),
        name: sessionStorage.getItem("name"),
        mail: sessionStorage.getItem("email")
    }

    const colors = props.colors;

    const [process, setProcess] = useState('Ready');

    const [databases, setDatabases] = useState();
    const [selectedDB, setSelectedDB] = React.useState(null)
    const [collections, setCollection] = useState();
    const [selectedCollection, setSelectedCollection] = React.useState(null);
    //const [data, setData] = useState();
    const [consoleItem, setConsoleItem] = useState();
    const [error, setError] = useState();

    const logout = () => {
        sessionStorage.removeItem("login_status");
        sessionStorage.removeItem("cluster_id");
        sessionStorage.removeItem("access_token");
        window.location.reload();
    }

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    const fetchDatabases = () => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "get-database",
                "payload": {
                    "database": "all"
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response)
            } else {
                var database = json.response.reduce(function (dbs, data) {
                    dbs[data.database_name] = data;
                    return dbs;
                }, {});
                setDatabases(database);
                setError();
                setProcess('Fetched');
            };
        })
    }

    const fetchCollections = (e) => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "get-collection",
                "payload": {
                    "database": e,
                    "collection": "all"
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            console.log(json);
            if (json.status_code === '0') {
                setError(json.response)
            } else {
                var collection = json.response.reduce(function (cols, data) {
                    cols[data.collection_name] = data;
                    return cols;
                }, {});
                setCollection(collection);
                setError();
                setProcess('Fetched');
            };
        })
    }

    /*
    const fetchData = (e) => {
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
                    "database": selectedDB,
                    "collection": e
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response)
            } else {
                console.log(json);
                var processedData = json.data;
                var dataSchema = json.schema;
                setData({ data: processedData, schema: dataSchema });
                setError();
                setProcess('Fetched');
            };
        })
    }
*/

    useEffect(() => {
        setProcess('Ready');
        fetchDatabases();
        /*
        return () => {
            cleanup
        }
        */
    }, []);

    const handleSelectDB = (e) => {
        setSelectedDB(e);
        fetchCollections(e);
    }

    const switchConsole = (e) => {
        setConsoleItem(<Console database={selectedDB} collection={e} colors={colors} />);
    }

    const handleSelectCollection = (e) => {
        setSelectedCollection(e);
        switchConsole(e);
        //fetchData(e);
    }


    return (
        <div style={{ height: "100vh" }}>
            <AppBar position="static" style={{ backgroundColor: "white", boxShadow: "none", borderBottom: "solid 2px #e7e7e7", padding: "10px" }}>
                <Toolbar style={{ width: "100%" }}>
                    <Grid container direction="row" justify="space-between" alignItems="center" >
                        <Grid item>
                            <Grid container direction="row" justify="center" alignItems="center">
                                <img src={logo} style={{ height: "30px", width: "30px", marginRight: "5px" }} />
                                <Typography style={{ color: "black", fontFamily: "Work Sans", fontSize: "1rem", lineHeight: "1", fontWeight: "400" }}>wunder<span style={{ fontWeight: "600" }}>Dash</span></Typography>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Popover
                                shouldCloseOnExternalClick={true}
                                position={Position.BOTTOM_LEFT}
                                content={
                                    <MenuE>
                                        <MenuE.Group>
                                            <MenuE.Item >
                                                <Typography style={{ color: colors.red.accentColor, fontFamily: "Work Sans", lineHeight: "1", fontSize: "1.25rem", fontWeight: "500" }}>
                                                    {userData.name}
                                                </Typography>
                                            </MenuE.Item>
                                            <MenuE.Item >
                                                <Typography style={{ fontFamily: "Work Sans", lineHeight: "1", fontSize: "0.825rem", fontWeight: "400" }}>
                                                    {userData.mail}
                                                </Typography>
                                            </MenuE.Item>
                                            <MenuE.Divider />
                                            <MenuE.Item style={{ marginTop: "3px" }} >
                                                <Typography style={{ fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "400" }}>
                                                    Cluster  <span style={{ borderRadius: "5px", padding: "3px 5px", backgroundColor: colors.red.backgroundColor, color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "500" }}>
                                                        {userData.cluster_id}
                                                    </span>
                                                </Typography>
                                            </MenuE.Item>
                                            <MenuE.Item >
                                                <Typography style={{ fontFamily: "Work Sans", lineHeight: "1", fontSize: "0.825rem", fontWeight: "400" }}>
                                                    Cluster Settings
                                                </Typography>
                                            </MenuE.Item>
                                        </MenuE.Group>
                                        <MenuE.Divider />
                                        <MenuE.Group>
                                            <MenuE.Item>
                                                <Typography style={{ fontFamily: "Work Sans", lineHeight: "1", fontSize: "0.825rem", fontWeight: "400" }}>
                                                    About <span style={{ fontWeight: "600" }}>wunder<sup>&copy;</sup></span>
                                                </Typography>
                                            </MenuE.Item>
                                        </MenuE.Group>
                                        <MenuE.Divider />
                                        <MenuE.Group>
                                            <MenuE.Item intent="danger" onClick={logout}>
                                                <Typography style={{ fontFamily: "Work Sans", lineHeight: "1", fontSize: "0.825rem", fontWeight: "400" }}>
                                                    Log-out
                                                </Typography>
                                            </MenuE.Item>
                                        </MenuE.Group>
                                    </MenuE>
                                }
                            >
                                <Avatar name={userData.name} size={40} />
                            </Popover>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar >
            <Grid container direction="row" justify="flex-start" alignItems="stretch" style={{ width: "100%", height: "100%" }}>
                <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                    <div style={{ borderRight: "solid 2px #e7e7e7", height: "100%", width: "100%", backgroundColor: "white" }}>
                        <div style={{ padding: "15px", borderBottom: "solid 2px #e7e7e7" }}>
                            <Accordion
                                style={{ backgroundColor: colors.red.backgroundColor, color: colors.red.accentColor, fontFamily: "Work Sans", width: "100%" }}
                            >
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon style={{ color: colors.red.accentColor }} />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    style={{ width: "100%" }}
                                >
                                    <Typography style={{ margin: "1px 0", color: colors.red.accentColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                        Cluster Details
                                    </Typography>
                                </AccordionSummary>
                                <AccordionDetails style={{ width: "100%" }}>
                                    <Grid container direction="column" justify="center" alignItems="center" style={{ width: "100%" }} spacing={2}>
                                        <Grid item style={{ width: "100%" }}>
                                            <Typography style={{ color: "black", fontFamily: 'Work Sans', fontSize: "0.825rem" }} >
                                                <FontAwesomeIcon icon={faCopy} style={{ color: colors.red.accentColor }} /> Tap to copy
                                            </Typography>
                                        </Grid>
                                        <Grid item style={{ width: "100%" }}>
                                            <FormControl style={{ width: "100%" }}>
                                                <Typography style={{ margin: "1px 0", color: "black", fontFamily: 'Work Sans', fontSize: "0.825rem" }} >
                                                    Cluster ID
                                                </Typography>
                                                <Input disabled style={{ color: colors.red.accentColor, fontFamily: 'Work Sans', fontSize: "0.825rem" }} value={sessionStorage.getItem("cluster_id")} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item style={{ width: "100%" }}>
                                            <FormControl style={{ width: "100%" }}>
                                                <Typography style={{ margin: "1px 0", color: "black", fontFamily: 'Work Sans', fontSize: "0.825rem" }} >
                                                    Access Token
                                                </Typography>
                                                <Input disabled style={{ color: colors.red.accentColor, fontFamily: 'Work Sans', fontSize: "0.825rem" }} value={sessionStorage.getItem("access_token")} />
                                            </FormControl>
                                        </Grid>
                                        <Grid item style={{ width: "100%" }}>
                                            <FormControl style={{ width: "100%" }}>
                                                <Typography style={{ margin: "1px 0", color: "black", fontFamily: 'Work Sans', fontSize: "0.825rem" }} >
                                                    <span style={{ fontWeight: "600" }}>wunderDB</span><sup>&copy;</sup> UAP
                                                </Typography>
                                                <Input disabled style={{ color: colors.red.accentColor, fontFamily: 'Work Sans', fontSize: "0.825rem" }}
                                                    value={
                                                        "https://wdb.tanmoysg.com/connect?cluster=" + userData.cluster_id + "&token=" + userData.access_token
                                                    }
                                                />
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        </div>
                        <div style={{ padding: "15px", borderBottom: "solid 2px #e7e7e7" }}>
                            <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: "100%" }} spacing={2}>
                                <Grid item>
                                    <Typography style={{ margin: "1px 0", color: colors.red.accentColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                        Databases
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <SelectMenu
                                        title="Select Database"
                                        options={databases ? Object.keys(databases).map((database, i) => ({
                                            label: <span style={{ backgroundColor: colors.red.backgroundColor, padding: "5px 7px", borderRadius: "5px", color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "0.825rem" }}><FontAwesomeIcon icon={faDatabase} style={{ fontSize: "0.825rem", marginRight: "5px" }} />{databases[database].database_name}</span>,
                                            value: databases[database].database_name
                                        })) : undefined
                                        }
                                        hasFilter={false}
                                        selected={selectedDB}
                                        onSelect={e => handleSelectDB(e.value)}
                                        style={{ color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "0.825rem" }}
                                    >
                                        <ButtonE style={{ color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "400" }}>{selectedDB || 'Select Database'}<FontAwesomeIcon icon={faChevronCircleDown} style={{ fontSize: "0.825rem", marginLeft: "5px" }} /></ButtonE>
                                    </SelectMenu>
                                </Grid>
                                <Grid item>
                                    <Typography style={{ color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "400" }}>
                                        <FontAwesomeIcon icon={faDatabase} style={{ fontSize: "0.825rem", marginRight: "5px" }} />{selectedDB ? <span style={{ color: 'black', fontWeight: "500" }}>Mounted DB: {selectedDB} </span> : "Select a DB"}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                        <div style={{ padding: "15px", borderBottom: "solid 2px #e7e7e7" }}>
                            <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: "100%" }} spacing={2}>
                                <Grid item>
                                    <Typography style={{ margin: "1px 0", color: colors.red.accentColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                        Collection <span style={{ fontWeight: "600", backgroundColor: colors.red.backgroundColor, padding: "6px 8px", borderRadius: "7px", color: colors.red.accentColor }}><FontAwesomeIcon icon={faCubes} style={{ fontSize: "0.875rem", marginRight: "5px" }} />{selectedDB ? databases[selectedDB].collections_count : '0'} </span>
                                    </Typography>
                                </Grid>
                                <Grid Item>
                                    {
                                        selectedDB && collections ?
                                            <TreeView
                                                defaultCollapseIcon={<ExpandMoreIcon />}
                                                defaultExpandIcon={<ChevronRightIcon />}
                                                style={{ margin: "5px 0px", backgroundColor: "none" }}
                                            >
                                                <TreeItem nodeId={selectedDB} label={
                                                    <span style={{ backgroundColor: colors.red.backgroundColor, padding: "6px 8px", borderRadius: "7px", color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "1rem" }}>
                                                        {selectedDB}
                                                    </span>
                                                }
                                                >
                                                    {
                                                        Object.keys(collections).map((collection, i) => {
                                                            return (
                                                                <TreeItem nodeId={collections[collection].collection_name} label={
                                                                    <span
                                                                        style={{ color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "0.825rem" }}
                                                                        onClick={() => handleSelectCollection(collection)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faCube} style={{ fontSize: "0.875rem", marginRight: "5px" }} />
                                                                        {collections[collection].collection_name}
                                                                        <span style={{ marginLeft: "5px", fontWeight: "600", backgroundColor: colors.red.backgroundColor, padding: "4px 4px", borderRadius: "4px", color: colors.red.accentColor }}>
                                                                            {collections[collection].data_count}
                                                                        </span>
                                                                    </span>
                                                                }
                                                                    style={{ margin: "5px 0px" }}
                                                                />
                                                            );
                                                        })
                                                    }
                                                </TreeItem>
                                            </TreeView>
                                            : undefined
                                    }
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
                    {
                        consoleItem ?
                            consoleItem
                            :
                            <div style={{ padding: "10px", height: "100%", width: "100%" }}>
                                <Grid container direction="column" alignItems="center" justify="center" style={{ width: "100%", height: "100%" }}>
                                    <Grid item>
                                        <img src={colils} style={{ width: "400px" }} />
                                    </Grid>
                                    <Grid item>
                                        <Typography style={{ fontSize: "2rem", fontFamily: "Work Sans" }}>
                                            Transporting your Collections to the Dock!
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </div>
                    }
                </Grid>
            </Grid>
        </div>

    );
}

export default Dashboard;

import React, { useState, useEffect } from 'react';
import logo from '../assets/wdash.png';
import colils from '../assets/Logistics-bro.svg';
import { Avatar, Position, Menu as MenuE, Popover, Dialog, SelectField, Pane, Button as ButtonE, TextInputField, toaster } from 'evergreen-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FormControl, Input, IconButton, Typography, Grid, List, ListItem, ListItemText, Divider, Hidden, Tooltip, Link, Paper } from "@material-ui/core";
import IndeterminateCheckIcon from '@material-ui/icons/IndeterminateCheckBox';
import { faCopy, faCubes, faDatabase, faPlus, faSync, faTrash, faBook } from '@fortawesome/free-solid-svg-icons';
import 'status-indicator/styles.css';
import DockLargeScreen from './dock.component';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';


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
    const [databaseList, setDatabaseList] = useState();
    const [selectedDB, setSelectedDB] = useState(null)
    const [newDatabaseName, setNewDatabaseName] = useState();
    const [openClusterSheet, setOpenClusterSheet] = useState(false);
    const [openNewDatabaseDialog, setOpenNewDatabaseDialog] = useState(false);
    const [openHelpSheet, setOpenHelpSheet] = useState(false);
    const [error, setError] = useState();
    const [confirmationToken, setConfirmationToken] = useState();
    const [deleteDBObject, setDeleteDBObject] = useState({
        migrateCollection: "",
        destinationDatabase: "",
        ifCollectionExists: ""
    });

    const logout = () => {
        sessionStorage.removeItem("login_status");
        sessionStorage.removeItem("cluster_id");
        sessionStorage.removeItem("access_token");
        window.location.reload();
    }


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
                var tempArr = [];
                Object.keys(database).map((db) => {
                    tempArr.push(db)
                });
                setDatabaseList(tempArr);
                setError();
                setProcess('Fetched');
            };
        })
    }


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
    }

    const unmountDB = () => {
        setSelectedDB();
    }

    const handleCreateNewDatabase = (e) => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "create-database",
                "payload": {
                    "name": e
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response)
            } else {
                toaster.success(json.response)
                fetchDatabases();
                setError();
                setProcess('Fetched');
                setOpenNewDatabaseDialog(false);
            };
        })
    }

    const handleDeleteDatabase = (srcDb, migratePref, destDb, aifc) => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "delete-database",
                "payload": {
                    "targetDatabase": srcDb,
                    "migrateCollections": migratePref,
                    "destinationDatabase": destDb,
                    "ifCollectionExists": aifc
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response)
            } else {
                toaster.danger(json.response)
                fetchDatabases();
                setError();
                setProcess('Fetched');
                setConfirmationToken();
                setDeleteDBObject({
                    migrateCollection: "",
                    destinationDatabase: "",
                    ifCollectionExists: ""
                });
                unmountDB();
            };
        })
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const reload = () => {
        setProcess('Fetching');
        unmountDB();
        sleep(250).then(() => {
            fetchDatabases();
        })
    }

    return (
        <div style={{ height: "100vh" }}>
            <Grid container direction="row" justify="flex-start" alignItems="stretch" style={{ width: "100%", height: "100%" }}>
                <Grid item xs={12} sm={12} md={12} lg={2} xl={2}>
                    <div style={{ borderRight: "solid 2px #e7e7e7", height: "100%", width: "100%", backgroundColor: "white" }}>
                        <div style={{ padding: "15px", borderBottom: "solid 2px #e7e7e7" }}>
                            <Grid container direction="row" justify="space-between" alignItems="center">
                                <Grid item>
                                    <Grid container direction="row" justify="flex-start" alignItems="center">
                                        <img src={logo} style={{ height: "30px", width: "30px", marginRight: "5px" }} />
                                        <Typography style={{ color: "black", fontFamily: "Work Sans", fontSize: "1rem", lineHeight: "1", fontWeight: "400" }}>wunder<span style={{ fontWeight: "600" }}>Dash</span></Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                        <div style={{ padding: "15px", borderBottom: "solid 2px #e7e7e7" }}>
                            <Grid container direction="row" alignItems="center" spacing={1}>
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
                                                    <MenuE.Item onClick={() => { setOpenClusterSheet(true) }}>
                                                        <Typography style={{ fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "400" }}>
                                                            Cluster  <span style={{ borderRadius: "5px", padding: "3px 5px", backgroundColor: colors.red.foregroundColor, color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "500" }}>
                                                                {userData.cluster_id}
                                                            </span>
                                                        </Typography>
                                                    </MenuE.Item>
                                                    <MenuE.Item style={{ marginTop: "3px" }} >
                                                        <Typography style={{ fontFamily: "Work Sans", lineHeight: "1", fontSize: "0.825rem", fontWeight: "400" }}>
                                                            Cluster Settings
                                                        </Typography>
                                                    </MenuE.Item>
                                                    <Dialog
                                                        isShown={openClusterSheet}
                                                        onCloseComplete={() => { setOpenClusterSheet(!openClusterSheet) }}
                                                        title="Cluster Information"
                                                        confirmLabel="Close"
                                                    >
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
                                                    </Dialog >
                                                </MenuE.Group>
                                                <MenuE.Divider />
                                                <MenuE.Group>
                                                    <MenuE.Item style={{ marginTop: "3px" }} onClick={() => { setOpenHelpSheet(true) }} >
                                                        <Typography style={{ fontFamily: "Work Sans", lineHeight: "1", fontSize: "0.825rem", fontWeight: "400" }}>
                                                            wunderDB Guide
                                                        </Typography>
                                                    </MenuE.Item>
                                                    <Dialog
                                                        isShown={openHelpSheet}
                                                        onCloseComplete={() => { setOpenHelpSheet(false) }}
                                                        title="wunderDB Guide"
                                                        confirmLabel="Close"
                                                    >
                                                        <Grid container direction="row" justify="center" alignItems="stretch" spacing={1}>
                                                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} >
                                                                <Link href="https://www.youtube.com/channel/UCNqWIcv_bOMWEHXTQNNwP7Q/videos" target="_blank" underline="none">
                                                                    <Paper variant="outlined" style={{ padding: "20px" }} elevation={3}>
                                                                        <center>
                                                                            <Typography style={{ color: colors.purple.accentColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                                                <FontAwesomeIcon icon={faYoutube} /> <br /> Video Tutorials
                                                                            </Typography>
                                                                        </center>
                                                                    </Paper>
                                                                </Link>
                                                            </Grid>
                                                            <Grid item xs={12} sm={12} md={12} lg={6} xl={6} >
                                                                <Link href="https://github.com/TanmoySG/wunderDB/blob/master/documentation/documentation.md" target="_blank" underline="none">
                                                                    <Paper variant="outlined" style={{ padding: "20px" }} elevation={3}>
                                                                        <center>
                                                                            <Typography style={{ color: colors.purple.accentColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                                                <FontAwesomeIcon icon={faBook} /> <br /> Read Documentation
                                                                            </Typography>
                                                                        </center>
                                                                    </Paper>
                                                                </Link>
                                                            </Grid>
                                                        </Grid>
                                                    </Dialog>
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
                                <Grid item>
                                    <Typography style={{ color: "black", fontFamily: 'Work Sans', fontSize: "0.95rem", lineHeight: "1" }} >
                                        Hi, {userData.name} !
                                    </Typography>
                                    <Grid container direction="row" alignItems="center">
                                        <span>
                                            {
                                                process ?
                                                    process === 'Ready' ? <status-indicator pulse></status-indicator>
                                                        : process === 'Fetching' ? /*<Spinner size={10} />*/ <status-indicator intermediary ></status-indicator>
                                                            : process === 'Fetched' ? <status-indicator positive ></status-indicator>
                                                                : process === 'Error' ? <status-indicator negative pulse></status-indicator>
                                                                    : <status-indicator pulse></status-indicator>
                                                    : undefined
                                            }
                                        </span>
                                        <span style={{ marginLeft: "3px", fontFamily: 'Work Sans', fontSize: "0.8rem", lineHeight: "1" }}>
                                            {
                                                process === 'Fetched' ? 'Synced' : "Syncing"
                                            }
                                        </span>
                                        <FontAwesomeIcon icon={faSync} style={{ marginLeft: "5px", fontSize: "0.65rem", userSelect: "none", color: colors.purple.accentColor }} onClick={reload} />
                                    </Grid>
                                </Grid>

                            </Grid>
                            {/*}
                            <ButtonE onClick={() => { setOpenClusterSheet(!openClusterSheet) }} appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.blue.backgroundColor, borderColor: colors.blue.backgroundColor, fontFamily: "Work Sans" }}>
                                Cluster Information
                            </ButtonE>
                            {*/}
                        </div>
                        <div style={{ padding: "15px", borderBottom: "solid 2px #e7e7e7" }}>
                            <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: "100%" }} spacing={1}>
                                <Grid item>
                                    <Typography style={{ color: colors.red.accentColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                        <FontAwesomeIcon icon={faDatabase} style={{ marginRight: "5px" }} /> Databases
                                    </Typography>
                                </Grid>
                                <Grid item style={{ width: "100%" }}>
                                    <Tooltip content="New Database">
                                        <ButtonE
                                            onClick={() => { setOpenNewDatabaseDialog(!openNewDatabaseDialog) }} appearance="primary"
                                            style={{ width: "100%", fontSize: "0.825rem", padding: "10px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.green.backgroundColor, borderColor: colors.green.backgroundColor, fontFamily: "Work Sans" }}
                                        >
                                            <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} /> New Database
                                        </ButtonE>
                                    </Tooltip>
                                    <Dialog
                                        isShown={openNewDatabaseDialog}
                                        onCloseComplete={() => { setOpenNewDatabaseDialog(false) }}
                                        title="Create New Database"
                                        hasFooter={true}
                                        intent="success"
                                        footer={
                                            <ButtonE onClick={() => { handleCreateNewDatabase(newDatabaseName) }} appearance="primary" intent="success">
                                                Confirm
                                            </ButtonE>
                                        }
                                    >
                                        <TextInputField
                                            label={
                                                <Typography style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>
                                                    Database Name
                                                </Typography>
                                            }
                                            hint="Use Camel Casing or Hyphenation, eg. New Database One as newDatabaseOne or new-database-one, to name funky database. Any whitespace would be removed from the name."
                                            placeholder="Pick name for your Database!"
                                            style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}
                                            onChange={(e) => { setNewDatabaseName(e.target.value.split(" ").join("")) }}
                                        />

                                    </Dialog>
                                </Grid>
                                <Grid item style={{ width: "100%" }}>
                                    <div style={{ border: "2px solid #e7e7e7", borderRadius: "5px", height: "35vh", width: "100%", overflow: "auto" }}>
                                        <List>
                                            {
                                                databases ? Object.keys(databases).map((database, i) => {
                                                    return (
                                                        <>
                                                            <ListItem button onClick={() => handleSelectDB(database)} style={{ backgroundColor: databases[database].database_name === selectedDB ? colors.red.foregroundColor : "transparent" }} >
                                                                <ListItemText
                                                                    primary={
                                                                        <span style={{ color: colors.red.backgroundColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "500" }}>
                                                                            {databases[database].database_name}
                                                                            <span style={{ fontWeight: "600", marginLeft: "5px", backgroundColor: colors.red.backgroundColor, padding: "6px 8px", borderRadius: "7px", color: colors.bwg.accentColor }}>{databases[database].collections_count} </span>
                                                                        </span>
                                                                    }
                                                                />

                                                            </ListItem>
                                                            <Divider />
                                                        </>
                                                    )
                                                }) : undefined
                                            }
                                        </List>

                                    </div>
                                </Grid>
                                <Grid item style={{ width: "100%" }}>
                                    <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: "100%" }} spacing={2}>
                                        <Grid item>
                                            <Typography style={{ color: colors.bwg.backgroundColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "400" }}>
                                                <span style={{ fontWeight: "500" }}>{selectedDB ? "Mounted Database:" : "Select a DB"}</span>
                                            </Typography>
                                            <Typography style={{ color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "1rem", fontWeight: "400" }}>
                                                {selectedDB ? <span style={{ fontWeight: "500" }}><FontAwesomeIcon icon={faDatabase} style={{ fontSize: "0.825rem", marginRight: "5px" }} />{selectedDB}</span> : undefined}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography style={{ margin: "1px 0", color: colors.bwg.backgroundColor, fontFamily: 'Work Sans', fontSize: "0.875rem" }} >
                                                Collections <span style={{ fontWeight: "600", backgroundColor: colors.red.foregroundColor, padding: "6px 8px", borderRadius: "7px", color: colors.red.accentColor }}><FontAwesomeIcon icon={faCubes} style={{ marginRight: "5px" }} />{selectedDB ? databases[selectedDB].collections_count : '0'} </span>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {
                                    selectedDB ?
                                        <Grid item style={{ width: "100%" }}>
                                            <Grid container direction="row" justify="flex-start" alignItems="center" style={{ width: "100%" }}>
                                                <Grid item >
                                                    <Popover
                                                        content={({ close }) => (
                                                            <Pane
                                                                padding={20}
                                                                display="flex"
                                                                alignItems="center"
                                                                justifyContent="center"
                                                                flexDirection="column"
                                                                className="boxes-dialog"
                                                            >
                                                                <Typography style={{ margin: "1px 0", fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                                    Delete Database
                                                                </Typography>
                                                                <TextInputField
                                                                    disabled
                                                                    width="100%"
                                                                    label={<span style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>Source Database</span>}
                                                                    value={selectedDB}
                                                                />
                                                                <SelectField
                                                                    label="Migration Preference"
                                                                    openOnFocus
                                                                    width="100%"
                                                                    onChange={e => { setDeleteDBObject({ ...deleteDBObject, migrateCollection: e.target.value }) }}
                                                                >
                                                                    <option>Select an action</option>
                                                                    <option value="true">Migrate Collections on Delete</option>
                                                                    <option value="false">Don't migrate collections</option>
                                                                </SelectField>
                                                                {
                                                                    deleteDBObject.migrateCollection === 'true' ?
                                                                        <>
                                                                            <SelectField
                                                                                openOnFocus
                                                                                width="100%"
                                                                                label="Destination Database"
                                                                                onChange={e => { setDeleteDBObject({ ...deleteDBObject, destinationDatabase: e.target.value }) }}
                                                                                placeholder="Choose Destination Database"
                                                                            >
                                                                                <option>Select Destination Database</option>
                                                                                {
                                                                                    databaseList ?
                                                                                        databaseList.map((e) => {
                                                                                            if (e !== selectedDB) {
                                                                                                return <option value={e}>{e}</option>
                                                                                            }
                                                                                        }) : undefined
                                                                                }
                                                                            </SelectField>
                                                                            <SelectField
                                                                                label="Action If exists"
                                                                                openOnFocus
                                                                                width="100%"
                                                                                onChange={e => { setDeleteDBObject({ ...deleteDBObject, ifCollectionExists: e.target.value }) }}
                                                                                placeholder="Preferred action if collection exists in destination database."
                                                                            >
                                                                                <option>Select an action</option>
                                                                                <option value="replace">replace</option>
                                                                                <option value="rename">rename</option>
                                                                                <option value="skip">skip</option>
                                                                            </SelectField>
                                                                        </> : undefined
                                                                }
                                                                <TextInputField
                                                                    label="Type the name of the database to confirm cloning"
                                                                    onChange={(e) => { setConfirmationToken(e.target.value) }}
                                                                />
                                                                <ButtonE disabled={confirmationToken === selectedDB ? false : true}
                                                                    onClick={() => { handleDeleteDatabase(selectedDB, deleteDBObject["migrateCollection"], deleteDBObject["destinationDatabase"], deleteDBObject["ifCollectionExists"]) }}
                                                                    appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", fontFamily: "Work Sans" }}
                                                                    intent="danger"
                                                                >
                                                                    Confirm Action
                                                                </ButtonE>
                                                            </Pane>
                                                        )}
                                                    >
                                                        <Tooltip content="Deleted Database">
                                                            <ButtonE appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.red.backgroundColor, borderColor: colors.red.backgroundColor, fontFamily: "Work Sans" }}>
                                                                <FontAwesomeIcon icon={faTrash} style={{ marginRight: "5px" }} /> Delete DB
                                                            </ButtonE>
                                                        </Tooltip>
                                                    </Popover>
                                                </Grid>
                                                <Grid item >
                                                    <Tooltip content="Unmount DB">
                                                        <IconButton onClick={unmountDB}>
                                                            <IndeterminateCheckIcon style={{ color: colors.yellow.accentColor }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        : undefined
                                }
                            </Grid>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
                    {
                        selectedDB ?
                            <div style={{ padding: "20px" }}>
                                <DockLargeScreen database={selectedDB} databases={databases} colors={colors} process={process} />
                                {/*}
                                <Hidden mdUp>
                                    <DockSmallScreen database={selectedDB} databases={databases} colors={colors} userData={userData} />
                                </Hidden>
                                {*/}
                            </div>
                            :
                            <div style={{ padding: "10px", height: "100%", width: "100%" }}>
                                <Grid container direction="column" alignItems="center" justify="center" style={{ width: "100%", height: "100%" }}>
                                    <Hidden mdDown>
                                        <Grid item>
                                            <img src={colils} style={{ width: "400px" }} />
                                        </Grid>
                                        <Grid item>
                                            <Typography style={{ fontSize: "2rem", fontFamily: "Work Sans" }}>
                                                Transporting your Collections to the Dock!
                                            </Typography>
                                        </Grid>
                                    </Hidden>
                                    <Hidden mdUp>
                                        <Grid item style={{ width: "100%" }}>
                                            <img src={colils} style={{ width: "100%" }} />
                                        </Grid>
                                        <Grid>
                                            <Typography style={{ justify: "center", fontSize: "1rem", fontFamily: "Work Sans" }}>
                                                Transporting your Collections to the Dock!
                                            </Typography>
                                        </Grid>
                                    </Hidden>
                                </Grid>
                            </div>
                    }
                </Grid>
            </Grid>
        </div >

    );
}

export default Dashboard;

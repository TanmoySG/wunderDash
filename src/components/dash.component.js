import React, { useState, useEffect } from 'react';
import logo from '../assets/wdash.png';
import colils from '../assets/Logistics-bro.svg';
import { Avatar, Position, Menu as MenuE, Popover, Dialog, SideSheet, Button as ButtonE, TextInputField, toaster } from 'evergreen-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TreeView, TreeItem } from '@material-ui/lab';
import { FormControl, Input, IconButton, Typography, Grid, List, ListItem, ListItemText, Divider, Hidden, Menu as MenuM, Button as ButtonM } from "@material-ui/core";
import PageviewIcon from '@material-ui/icons/Pageview';
import AddToPhotosRoundedIcon from '@material-ui/icons/AddToPhotos';
import DeleteIcon from '@material-ui/icons/Delete';
import IndeterminateCheckIcon from '@material-ui/icons/IndeterminateCheckBox';
import { faCube, faChevronCircleDown, faCopy, faCubes, faDatabase, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import DockLargeScreen from './dock-large-screen.component';
import DockSmallScreen from './dock-small-screen.component';


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
    const [selectedDB, setSelectedDB] = useState(null)
    const [newDatabaseName, setNewDatabaseName] = useState();
    const [openClusterSheet, setOpenClusterSheet] = useState(false);
    const [openNewDatabaseDialog, setOpenNewDatabaseDialog] = useState(false);
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
                "action" : "create-database",
                "payload": {
                    "name" : e
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
                                <Hidden mdUp>
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
                                                                Cluster  <span style={{ borderRadius: "5px", padding: "3px 5px", backgroundColor: colors.red.foregroundColor, color: colors.red.accentColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "500" }}>
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
                                </Hidden>
                            </Grid>
                        </div>
                        <div style={{ padding: "15px", borderBottom: "solid 2px #e7e7e7" }}>
                            <Typography style={{ color: "black", fontFamily: 'Work Sans', fontSize: "0.95rem" }} >
                                Hi, {userData.name} !
                            </Typography>
                            <ButtonE onClick={() => { setOpenClusterSheet(!openClusterSheet) }} appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.blue.backgroundColor, borderColor: colors.blue.backgroundColor, fontFamily: "Work Sans" }}>
                                Cluster Information
                            </ButtonE>
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
                        </div>
                        <div style={{ padding: "15px", borderBottom: "solid 2px #e7e7e7" }}>
                            <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: "100%" }} spacing={2}>
                                <Grid item>
                                    <Typography style={{ margin: "1px 0", color: colors.red.accentColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                        <FontAwesomeIcon icon={faDatabase} style={{ marginRight: "5px" }} /> Databases
                                    </Typography>
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
                                                Collections: <span style={{ fontWeight: "600", backgroundColor: colors.red.foregroundColor, padding: "6px 8px", borderRadius: "7px", color: colors.red.accentColor }}><FontAwesomeIcon icon={faCubes} style={{ marginRight: "5px" }} />{selectedDB ? databases[selectedDB].collections_count : '0'} </span>
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item style={{ width: "100%" }}>
                                    <Typography style={{ margin: "1px 0", color: colors.bwg.backgroundColor, fontFamily: 'Work Sans', fontSize: "0.875rem" }} >
                                        Database Actions
                                    </Typography>
                                    <Grid container direction="row" justify="flex-start" alignItems="center" style={{ width: "100%" }}>
                                        <Grid item >
                                            <IconButton >
                                                <PageviewIcon style={{ color: colors.blue.accentColor }} />
                                            </IconButton>
                                        </Grid>
                                        <Grid item >
                                            <IconButton onClick={() => { setOpenNewDatabaseDialog(!openNewDatabaseDialog) }} >
                                                <AddToPhotosRoundedIcon style={{ color: colors.green.accentColor }} />
                                            </IconButton>
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
                                                    hint="Use Camel Casing or Hyphenation, eg. New Database One as newDatabaseOne or new-database-one, to name your funky database."
                                                    placeholder="Pick a Funky name for your funky Database!"
                                                    style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}
                                                    onChange={(e) => { setNewDatabaseName(e.target.value) }}
                                                />

                                            </Dialog>
                                        </Grid>
                                        <Grid item >
                                            <IconButton >
                                                <DeleteIcon style={{ color: colors.red.accentColor }} />
                                            </IconButton>
                                        </Grid>
                                        <Grid item >
                                            <IconButton onClick={unmountDB}>
                                                <IndeterminateCheckIcon style={{ color: colors.yellow.accentColor }} />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={10} xl={10}>
                    {
                        selectedDB ?
                            <div style={{ padding: "20px" }}>
                                <Hidden mdDown>
                                    <DockLargeScreen database={selectedDB} colors={colors} userData={userData} />
                                </Hidden>
                                <Hidden mdUp>
                                    <DockSmallScreen database={selectedDB} colors={colors} userData={userData} />
                                </Hidden>
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

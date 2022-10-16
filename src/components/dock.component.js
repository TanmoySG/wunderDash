import { faBinoculars, faChevronRight, faClone, faCube, faCubes, faExclamationTriangle, faFileExport, faInfoCircle, faKey, faLayerGroup, faLightbulb, faPlus, faTable, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button as ButtonM, ButtonGroup, Divider, Grid, IconButton, List, ListItem, ListItemText, Paper, Step, StepLabel, Stepper, TextField, Typography } from "@material-ui/core";
import AddToPhotosRoundedIcon from '@material-ui/icons/AddToPhotos';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IndeterminateCheckIcon from '@material-ui/icons/IndeterminateCheckBox';
import { Button as ButtonE, Dialog, Pane, Popover, SelectField, Spinner, Table as TableE, TextInputField, toaster, Tooltip } from 'evergreen-ui';
import React, { useEffect, useState } from 'react';
import 'status-indicator/styles.css';
import spotmiss from '../assets/Focus-rafiki.svg';
import datamiss from '../assets/Spreadsheets-pana.svg';

function DockLargeScreen(props) {

    const config = require("../assets/wdb.secrets.json")

    const WDB_URL = config.WDB_URL

    var endpoint = WDB_URL +"/connect?cluster=" + sessionStorage.getItem("cluster_id") + "&token=" + sessionStorage.getItem("access_token");

    const [wdbProcess, setProcess] = useState('Ready');

    const [databases, setDatabases] = useState();
    const [database, setDatabase] = useState();
    const [collections, setCollection] = useState();
    const [collection, setSelectedCollection] = useState(null);
    const [collectionName, setCollectionName] = useState();
    const [collectionFieldCount, setCollectionFieldCount] = useState(0);
    const [collectionSchema, setCollectionSchema] = useState();

    const [tempCollectionFieldsName, setTempCollectionFieldsName] = useState([]);
    const [tempNewData, setTempNewData] = useState({});
    const [tempCollectionName, setTempCollectionName] = useState();

    const [stepCollectionCreate, setStepCollectionCreate] = useState(0);
    const [confirmationToken, setConfirmationToken] = useState();

    const [data, setData] = useState();
    const [displayableScheme, setDisplayableScheme] = useState();
    const [copyCollectionObject, setCopyCollectionObject] = useState({
        destinationDatabase: "",
        actionIfExists: "",
        newName: ""
    });

    const [error, setError] = useState();
    const [spotlight, setSpotlight] = useState();
    const [editMode, setEditMode] = useState(false);

    const [openSchemaDialog, setOpenSchemaDialog] = useState(false);
    const [openNewCollectionDialog, setOpenNewCollectionDialog] = useState(false);
    const [openAddDataDialog, setOpenAddDataDialog] = useState(false);

    const colors = props.colors;
    const collectionSteps = ['Collection Specification', 'Set Field Names', 'Set Field Description', 'Confirm and Create'];

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
            if (json.status_code === '0') {
                setError(json.response); setProcess("Error"); toaster.danger(json.response);
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
                    "database": database,
                    "collection": e
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response); setProcess("Error"); toaster.danger(json.response);
            } else {
                var wdbProcessedData = json.data;
                var dataSchema = json.schema;
                setData({ data: wdbProcessedData, schema: dataSchema });
                setError();
                setProcess('Fetched');
            };
        })
    }


    if (database !== props.database) {
        setDatabase(props.database);
        fetchCollections(props.database);
        setProcess('Ready');
        setDisplayableScheme();
        setSelectedCollection();
        setData();
        setSpotlight();
    }

    /*
    if (wdbProcess !== props.wdbProcess) {
        setProcess(props.wdbProcess);
    }
*/

    const handleSelectCollection = (e) => {
        setSelectedCollection(e);
        fetchData(e);
        setSpotlight();
    }
    const reload = () => {
        setProcess('Fetching');
        setSelectedCollection();
        setData();
        setSpotlight();
        setTempCollectionName();
        setCopyCollectionObject({
            copyConfirmationToken: "",
            destinationDatabase: "",
            actionIfExists: "",
            newName: ""
        });
        setConfirmationToken();
        fetchCollections(database);
    }



    useEffect(() => {
        var tempArr = [];
        Object.keys(props.databases).map((database) => {
            tempArr.push(database)
        })
        setDatabases(tempArr);
        setDatabase(props.database);
        setProcess('Ready');
        fetchCollections(props.database);
        /*return () => {
            cleanup
        }*/
    }, [props.database, props.databases])

    const unmountCollection = () => {
        setSelectedCollection();
        setData();
        setSpotlight();
        setTempCollectionName();
        setCopyCollectionObject({
            copyConfirmationToken: "",
            destinationDatabase: "",
            actionIfExists: "",
            newName: ""
        });
        setConfirmationToken();
    }

    const unmountSpotlight = () => {
        setSpotlight();
    }

    const resetCreateCollection = () => {
        setCollectionFieldCount(0);
        setCollectionName();
        setCollectionSchema();
        setTempCollectionFieldsName();
        setStepCollectionCreate(0);
    }

    const resetAddData = () => {
        setTempNewData({});
    }

    const handleCreateNewCollection = (db, colName, colSchema) => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "create-collection",
                "payload": {
                    "database": db,
                    "name": colName,
                    "schema": colSchema
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response);
                setProcess("Error");
                toaster.danger(json.response);
            } else {
                toaster.success(json.response)
                fetchCollections(database);
                setError();
                setProcess('Fetched');
                setOpenNewCollectionDialog(false);
                resetCreateCollection();
            };
        })
    }

    const handleUpdateData = (db, col, spot) => {
        setProcess('Fetching');
        var tempData = spot;
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "update-data",
                "payload": {
                    "database": db,
                    "collection": col,
                    "marker": "_id : " + spot["_id"],
                    "data": tempData
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response);
                setProcess("Error");
                toaster.danger(json.response);
            } else {
                toaster.success(json.response);
                fetchCollections(database);
                fetchData(collection);
                setError();
                setProcess('Fetched');
                setSpotlight();
                setEditMode(false);
            };
        })
    }


    const handleAddData = (db, col, newData) => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "add-data",
                "payload": {
                    "database": db,
                    "collection": col,
                    "data": newData
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response);
                setProcess("Error");
                toaster.danger(json.response);
            } else {
                toaster.success(json.response)
                fetchCollections(database);
                fetchData(collection);
                setError();
                setProcess('Fetched');
                resetAddData();
            };
        })
    }

    const handleDeleteData = (db, col, id) => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "delete-data",
                "payload": {
                    "database": db,
                    "collection": col,
                    "marker": "_id : " + id
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response);
                setProcess("Error");
                toaster.danger(json.response);
            } else {
                toaster.danger(json.response)
                fetchCollections(database);
                fetchData(collection);
                setError();
                setProcess('Fetched');
                setSpotlight();
                setEditMode(false);
            };
        })
    }

    const handleDeleteCollection = (db, delColName) => {
        if (delColName === collection) {
            setProcess('Fetching');
            fetch(endpoint, {
                method: "POST",
                cache: "no-cache",
                headers: {
                    "content_type": "application/json",
                },
                body: JSON.stringify({
                    "action": "delete-collection",
                    "payload": {
                        "database": db,
                        "collection": delColName,
                    }
                })
            }).then(response => {
                return response.json()
            }).then(json => {
                if (json.status_code === '0') {
                    setError(json.response);
                    setProcess("Error");
                    toaster.danger(json.response);
                } else {
                    toaster.danger(json.response)
                    fetchCollections(database);
                    unmountCollection();
                    unmountSpotlight();
                    setError();
                    setProcess('Fetched');
                };
            })
        }
    }

    const handleCopyCollection = (db, cpyColName, destDb, aif, newNam) => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "clone-collection",
                "payload": {
                    "sourceDatabase": db,
                    "collection": cpyColName,
                    "destinationDatabase": destDb,
                    "actionIfExists": aif,
                    "newName": newNam
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response);
                setProcess("Error");
                toaster.danger(json.response);
            } else {
                toaster.notify(json.response)
                fetchCollections(database);
                unmountCollection();
                unmountSpotlight();
                setError();
                setProcess('Fetched');
            };
        })
    }


    const handleMigrateCollection = (db, cpyColName, destDb, aif, newNam) => {
        setProcess('Fetching');
        fetch(endpoint, {
            method: "POST",
            cache: "no-cache",
            headers: {
                "content_type": "application/json",
            },
            body: JSON.stringify({
                "action": "migrate-collection",
                "payload": {
                    "sourceDatabase": db,
                    "collection": cpyColName,
                    "destinationDatabase": destDb,
                    "actionIfExists": aif,
                    "newName": newNam
                }
            })
        }).then(response => {
            return response.json()
        }).then(json => {
            if (json.status_code === '0') {
                setError(json.response);
                setProcess("Error");
                toaster.danger(json.response);
            } else {
                toaster.notify(json.response)
                fetchCollections(database);
                unmountCollection();
                unmountSpotlight();
                setError();
                setProcess('Fetched');
            };
        })
    }

    const moveToNextStep = (step) => {
        if (step === 1) {
            var tempColObj = {};
            tempCollectionFieldsName.forEach((name) => {
                tempColObj[name] = "";
            })
            setCollectionSchema(tempColObj);
        } else if (step === 3) {
            handleCreateNewCollection(database, collectionName, collectionSchema);
        }
        setStepCollectionCreate(stepCollectionCreate + 1);
    }

    const modifyTempColFieldName = (e, i) => {
        var tempColFieldName = tempCollectionFieldsName;
        tempColFieldName[i] = e;
        setTempCollectionFieldsName(tempColFieldName);
    }

    const modifyTempColFieldDescription = (name, desc) => {
        var tempScheme = collectionSchema;
        tempScheme[name] = desc;
        setCollectionSchema(tempScheme);
    }

    const modifyTempNewData = (name, desc) => {
        var tempData = tempNewData;
        tempData[name] = desc;
        setTempNewData(tempData);
    }

    const modifySpotlightData = (field, changedVal) => {
        var tempSpotlight = spotlight;
        tempSpotlight[field] = changedVal;
        setSpotlight(tempSpotlight);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const bringToSpotlight = (id) => {
        setSpotlight();
        sleep(1).then(() => { setSpotlight(data.data[id]); })
    }

    return (
        <Grid container direction="column" justify="center" alignItems="stretch" spacing={1} >
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ height: "50px" }}>
                <Grid container direction="row" justify="space-between" alignItems="center" spacing={1} >
                    <Grid item>
                        <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans" }}>
                            <FontAwesomeIcon icon={faCube} style={{ fontSize: "1rem", marginRight: "5px", color: colors.red.accentColor }} />
                            {database ? database : "None"}
                            {
                                collection ?
                                    <>
                                        <FontAwesomeIcon icon={faChevronRight} style={{ margin: "0px 5px", color: colors.red.accentColor }} />
                                        <span style={{ color: colors.red.accentColor, fontWeight: "500" }}>{collection ? collection : "None"}</span>
                                    </>
                                    : undefined
                            }
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Tooltip content="Reload">
                            <ButtonE
                                onClick={reload} appearance="primary"
                                style={{ color: "black", padding: "10px", backgroundColor: colors.bwg.accentColor, borderColor: colors.bwg.foregroundColor }}
                            >
                                <Grid container direction="row" alignItems="center">
                                    <span>
                                        {
                                            wdbProcess ?
                                                wdbProcess === 'Ready' ? <status-indicator pulse></status-indicator>
                                                    : wdbProcess === 'Fetching' ? <Spinner size={16} />
                                                        : wdbProcess === 'Fetched' ? <status-indicator positive pulse></status-indicator>
                                                            : wdbProcess === 'Error' ? <status-indicator negative pulse></status-indicator>
                                                                : <status-indicator pulse></status-indicator>
                                                : undefined
                                        }
                                    </span>
                                    <span style={{ marginLeft: "5px", fontFamily: 'Work Sans' }}>{wdbProcess ? wdbProcess : "Whats up, bruh?"}</span>
                                </Grid>
                            </ButtonE>
                        </Tooltip>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
                <Paper variant="outlined" className="papyrus" style={{ borderRadius: "7.5px" }}>
                    <Grid container justify="center" alignItems="stretch" style={{ height: "100%" }}>
                        <Grid item xs={12} sm={12} md={12} lg={3} xl={3} style={{ height: "100%" }}>
                            <div className="compartments" style={{ padding: "15px", height: "100%" }}>
                                <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: "100%" }} spacing={2}>
                                    <Grid container direction="row" justify="space-between" alignItems="flex-start" style={{ padding: "10px 15px" }} >
                                        <Grid item>
                                            <Typography style={{ margin: "1px 0", color: colors.blue.backgroundColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                <FontAwesomeIcon icon={faCubes} style={{ marginRight: "5px" }} /> Collections
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Grid container direction="row" justify="flex-start" alignItems="flex-end">
                                                <Grid item >
                                                    <Dialog
                                                        isShown={openNewCollectionDialog}
                                                        onCloseComplete={() => { setOpenNewCollectionDialog(false); }}
                                                        title={"Create New Collection in " + database}
                                                        hasFooter={stepCollectionCreate === 4 ? false : true}
                                                        intent="success"
                                                        footer={
                                                            stepCollectionCreate === 4 ? <div style={{ height: "15px" }} ></div> :
                                                                <ButtonE onClick={() => { moveToNextStep(stepCollectionCreate) }} appearance="primary" intent="success">
                                                                    {stepCollectionCreate !== 3 ? "Next" : "Confirm"}
                                                                </ButtonE>
                                                        }
                                                    >
                                                        <Stepper activeStep={stepCollectionCreate} alternativeLabel>
                                                            {collectionSteps.map((label) => (
                                                                <Step key={label}>
                                                                    <StepLabel>{label}</StepLabel>
                                                                </Step>
                                                            ))}
                                                        </Stepper>
                                                        <Grid container direction="column" spacing={1}>
                                                            {
                                                                stepCollectionCreate === 0 ?
                                                                    <>
                                                                        <Grid item>
                                                                            <TextInputField
                                                                                label={
                                                                                    <Typography style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>
                                                                                        Collection Name
                                                                                    </Typography>
                                                                                }
                                                                                hint="Use Camel Casing or Hyphenation, eg. New Collection One as newCollectionOne or new-collection-one, to name your collection."
                                                                                placeholder="Pick a name for your Collection!"
                                                                                style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}
                                                                                onChange={(e) => { setCollectionName(e.target.value.split(" ").join("")) }}
                                                                            />
                                                                        </Grid>
                                                                        <Grid item>
                                                                            <Grid container direction="row" justify="flex-start" alignItems="center" spacing={1} >
                                                                                <Grid item xs={11} sm={11} md={11} lg={11} xl={11} >
                                                                                    <TextInputField
                                                                                        label={
                                                                                            <Typography style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>
                                                                                                Number of Fields
                                                                                            </Typography>
                                                                                        }
                                                                                        description="Put in the number of fields you want in the Collection. Note: The number of Fields and schema cant be changed after creation."
                                                                                        style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}
                                                                                        value={collectionFieldCount}
                                                                                    />
                                                                                </Grid>
                                                                                <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
                                                                                    <ButtonGroup style={{ boxShadow: 'none' }} orientation="vertical">
                                                                                        <ButtonM
                                                                                            style={{ backgroundColor: colors.bwg.accentColor }}
                                                                                            onClick={() => { setCollectionFieldCount(collectionFieldCount + 1) }}
                                                                                        >
                                                                                            +
                                                                                        </ButtonM>
                                                                                        <ButtonM
                                                                                            style={{ backgroundColor: colors.bwg.accentColor }}
                                                                                            onClick={() => { setCollectionFieldCount(collectionFieldCount - 1) }}
                                                                                        >
                                                                                            -
                                                                                        </ButtonM>
                                                                                    </ButtonGroup>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    </>
                                                                    : stepCollectionCreate === 1 ?
                                                                        <div>
                                                                            {
                                                                                Array.from({ length: collectionFieldCount }, (_, i) => {
                                                                                    return (
                                                                                        <TextInputField
                                                                                            label={"Field #" + i + " Name"}
                                                                                            placeholder="Field Name"
                                                                                            style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}
                                                                                            onChange={(e) => { modifyTempColFieldName(e.target.value.split(" ").join(""), i) }}
                                                                                        />
                                                                                    )
                                                                                })
                                                                            }
                                                                            <Typography style={{ fontSize: "0.675rem", fontFamily: "Work Sans", color: colors.bwg.backgroundColor }}>
                                                                                <FontAwesomeIcon icon={faInfoCircle} style={{ color: "#ffb100", marginRight: "5px" }} />
                                                                                Note: An unique-identifier field <i>_id</i> will added automatically to the schema.
                                                                            </Typography>
                                                                        </div>
                                                                        : stepCollectionCreate === 2 ?
                                                                            Object.keys(collectionSchema).map((fieldName) => {
                                                                                return (
                                                                                    <TextInputField
                                                                                        key={"desc-textbox-" + fieldName}
                                                                                        label={fieldName + " Description"}
                                                                                        placeholder="Field Description"
                                                                                        style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}
                                                                                        onChange={(e) => { modifyTempColFieldDescription(fieldName, e.target.value) }}
                                                                                    />
                                                                                )
                                                                            })
                                                                            : stepCollectionCreate === 3 ?
                                                                                <>
                                                                                    <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans", color: colors.blue.backgroundColor, fontWeight: "500" }}>
                                                                                        Review Action
                                                                                    </Typography>
                                                                                    <Typography style={{ fontSize: "0.875rem", fontFamily: "Work Sans" }}>
                                                                                        Database : <span style={{ color: colors.blue.backgroundColor, fontWeight: "500" }}>{database}</span>
                                                                                    </Typography>
                                                                                    <Typography style={{ fontSize: "0.875rem", fontFamily: "Work Sans" }}>
                                                                                        Collection : <span style={{ color: colors.blue.backgroundColor, fontWeight: "500" }}>{collectionName}</span>
                                                                                    </Typography>

                                                                                    <TableE style={{ width: "100%", marginTop: "5px" }}>
                                                                                        <TableE.Head>
                                                                                            <TableE.TextHeaderCell>Name</TableE.TextHeaderCell>
                                                                                            <TableE.TextHeaderCell>Description</TableE.TextHeaderCell>
                                                                                        </TableE.Head>
                                                                                        <TableE.Body>
                                                                                            {
                                                                                                collectionSchema ? Object.keys(collectionSchema).map((scheme) => (
                                                                                                    <TableE.Row isSelectable>
                                                                                                        <TableE.TextCell>
                                                                                                            {scheme}
                                                                                                        </TableE.TextCell>
                                                                                                        <TableE.TextCell>{collectionSchema[scheme]}</TableE.TextCell>
                                                                                                    </TableE.Row>
                                                                                                )) : undefined
                                                                                            }
                                                                                        </TableE.Body>
                                                                                    </TableE>
                                                                                </>
                                                                                : stepCollectionCreate === 4 ?
                                                                                    <div style={{ width: "100%" }}>
                                                                                        <center>
                                                                                            <Spinner />
                                                                                            <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans", color: colors.bwg.backgroundColor, fontWeight: "500" }}>
                                                                                                We're building your Collection!
                                                                                            </Typography>
                                                                                        </center>
                                                                                    </div>
                                                                                    : undefined
                                                            }
                                                        </Grid>
                                                    </Dialog>
                                                </Grid>
                                                <Grid item >
                                                    <Tooltip content="Unmount Collection">
                                                        <IconButton onClick={unmountCollection} style={{ padding: "0 5px" }}>
                                                            <IndeterminateCheckIcon style={{ color: colors.yellow.accentColor }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item style={{ width: "100%" }}>
                                        <Tooltip content="Create new collection">
                                            <ButtonE
                                                onClick={() => { setOpenNewCollectionDialog(true) }} appearance="primary"
                                                style={{ width: "100%", fontSize: "0.825rem", padding: "10px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.green.backgroundColor, borderColor: colors.green.backgroundColor, fontFamily: "Work Sans" }}
                                            >
                                                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} /> Create Collection
                                            </ButtonE>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item style={{ width: "100%" }}>
                                        <div style={{ border: "2px solid #e7e7e7", borderRadius: "5px", height: "45vh", width: "100%", overflow: "auto" }}>
                                            <List>
                                                {
                                                    collections ?
                                                        Object.keys(collections).map((collect) => {
                                                            return (
                                                                <>
                                                                    <ListItem button onClick={() => handleSelectCollection(collect)} style={{ backgroundColor: collections[collect].collection_name === collection ? colors.blue.foregroundColor : "transparent" }} >
                                                                        <ListItemText
                                                                            primary={
                                                                                <>
                                                                                    <span style={{ color: colors.blue.backgroundColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "500" }}>
                                                                                        {collections[collect].collection_name}
                                                                                        <span style={{ marginLeft: "5px", fontWeight: "600", backgroundColor: colors.blue.accentColor, padding: "4px 4px", borderRadius: "4px", color: colors.bwg.accentColor }}>
                                                                                            {collections[collect].data_count}
                                                                                        </span>
                                                                                    </span>
                                                                                </>
                                                                            }
                                                                        />

                                                                    </ListItem>
                                                                    <Divider />
                                                                </>
                                                            );
                                                        })
                                                        : undefined
                                                }
                                            </List>
                                        </div>
                                    </Grid>
                                    <Grid item style={{ width: "100%" }}>
                                        <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: "100%" }} spacing={2}>
                                            <Grid item>
                                                <Typography style={{ color: colors.bwg.backgroundColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "400" }}>
                                                    <span style={{ fontWeight: "500" }}>{database ? "Mounted Collection:" : "Select a Collection"}</span>
                                                </Typography>
                                                <Typography style={{ color: colors.blue.backgroundColor, fontFamily: "Work Sans", fontSize: "1rem", fontWeight: "400" }}>
                                                    {collection ? <span style={{ fontWeight: "500" }}><FontAwesomeIcon icon={faCubes} style={{ fontSize: "1rem", marginRight: "5px" }} />{collection}</span> : undefined}
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{ margin: "1px 0", color: colors.bwg.backgroundColor, fontFamily: 'Work Sans', fontSize: "0.875rem" }} >
                                                    Data Count <span style={{ fontWeight: "600", backgroundColor: colors.blue.foregroundColor, padding: "6px 8px", borderRadius: "7px", color: colors.blue.backgroundColor }}><FontAwesomeIcon icon={faLayerGroup} style={{ marginRight: "5px" }} />{collection ? collections[collection].data_count : '0'} </span>
                                                </Typography>
                                            </Grid>
                                            {
                                                collection ?
                                                    <Grid item style={{ width: "100%" }}>
                                                        <Tooltip content="View Schema">
                                                            <ButtonE onClick={() => { setOpenSchemaDialog(!openSchemaDialog) }} appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.blue.backgroundColor, borderColor: colors.blue.backgroundColor, fontFamily: "Work Sans" }}>
                                                                <FontAwesomeIcon icon={faBinoculars} style={{ marginRight: "5px" }} /> Schema
                                                            </ButtonE>
                                                        </Tooltip>
                                                        <Dialog
                                                            isShown={openSchemaDialog}
                                                            onCloseComplete={() => { setOpenSchemaDialog(false) }}
                                                            title={
                                                                <Typography style={{ fontFamily: "Work Sans" }}>
                                                                    Collection Schema
                                                                </Typography>
                                                            }
                                                            footer={
                                                                <ButtonE onClick={() => { setOpenSchemaDialog(false) }} appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", fontFamily: "Work Sans" }} intent="info">
                                                                    Close
                                                                </ButtonE>
                                                            }
                                                        >
                                                            <div style={{}}>
                                                                <Grid container direction="column" justify="center" alignItems="stretch" spacing={2}>
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
                                                                                        <span style={{ marginRight: "5px", fontWeight: "600", fontStyle: "italic", backgroundColor: colors.red.foregroundColor, padding: "7px 7px", borderRadius: "4px", color: colors.red.accentColor }}>
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
                                                        </Dialog >
                                                        {/*}
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

                                                                </Pane>
                                                            )}
                                                        >
                                                            <ButtonE appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.purple.backgroundColor, borderColor: colors.purple.backgroundColor, fontFamily: "Work Sans" }}>
                                                                <FontAwesomeIcon icon={faCog} style={{ marginRight: "5px" }} /> Actions
                                                            </ButtonE>
                                                        </Popover>
                                                        {*/}
                                                        <Popover
                                                            content={() => (
                                                                <Pane
                                                                    padding={20}
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    flexDirection="column"
                                                                    className="boxes-dialog"
                                                                >
                                                                    <Typography style={{ margin: "5px 0", fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                                        <FontAwesomeIcon icon={faTrash} style={{ color: colors.red.backgroundColor }} /> Delete Collection
                                                                    </Typography>
                                                                    <TextInputField
                                                                        label="Type the name of the collection to confirm the delete operation."
                                                                        onChange={(e) => { setConfirmationToken(e.target.value) }}
                                                                    />
                                                                    <ButtonE disabled={confirmationToken === collection ? false : true} onClick={() => { handleDeleteCollection(database, collection) }} appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", fontFamily: "Work Sans" }} intent="danger">
                                                                        Delete
                                                                    </ButtonE>
                                                                </Pane>
                                                            )}
                                                        >
                                                            <Tooltip content="Delete Collection">
                                                                <ButtonE appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.red.backgroundColor, borderColor: colors.red.backgroundColor, fontFamily: "Work Sans" }}>
                                                                    <FontAwesomeIcon icon={faTrash} />
                                                                </ButtonE>
                                                            </Tooltip>
                                                        </Popover>
                                                        <Popover
                                                            content={() => (
                                                                <Pane
                                                                    padding={20}
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    flexDirection="column"
                                                                    className="boxes-dialog"
                                                                >
                                                                    <Typography style={{ margin: "1px 0", fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                                        <FontAwesomeIcon icon={faClone} style={{ color: colors.green.backgroundColor }} /> Clone Collection
                                                                    </Typography>
                                                                    <TextInputField
                                                                        disabled
                                                                        width="100%"
                                                                        label={<span style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>Source Database</span>}
                                                                        value={database}
                                                                    />
                                                                    <TextInputField
                                                                        disabled
                                                                        width="100%"
                                                                        label={<span style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>Target Collection</span>}
                                                                        value={collection}
                                                                    />
                                                                    <SelectField
                                                                        label="Destination Database"
                                                                        openOnFocus
                                                                        width="100%"
                                                                        onChange={e => { setCopyCollectionObject({ ...copyCollectionObject, destinationDatabase: e.target.value }) }}
                                                                        placeholder="Choose Destination Database"
                                                                    >
                                                                        <option >Select a database</option>
                                                                        {
                                                                            databases.map((e) => {
                                                                                if (e !== database) {
                                                                                    return <option value={e}>{e}</option>
                                                                                }
                                                                            })
                                                                        }
                                                                    </SelectField>
                                                                    <SelectField
                                                                        label="If exists Action"
                                                                        openOnFocus
                                                                        width="100%"
                                                                        onChange={e => { setCopyCollectionObject({ ...copyCollectionObject, actionIfExists: e.target.value }) }}
                                                                        placeholder="Preferred action if collection exists in destination database."
                                                                    >
                                                                        <option>Select an action</option>
                                                                        <option value="replace">replace</option>
                                                                        <option value="rename">rename</option>
                                                                        <option value="abort">abort</option>
                                                                    </SelectField>
                                                                    {
                                                                        copyCollectionObject.actionIfExists === 'rename' ?
                                                                            <TextInputField
                                                                                width="100%"
                                                                                label="New name for collection to rename."
                                                                                onChange={(e) => { setCopyCollectionObject({ ...copyCollectionObject, newName: e.target.value }) }}
                                                                            />
                                                                            : undefined
                                                                    }
                                                                    <TextInputField
                                                                        label="Type the name of the collection to confirm the clone operation."
                                                                        onChange={(e) => { setCopyCollectionObject({ ...copyCollectionObject, copyConfirmationToken: e.target.value }) }}
                                                                    />
                                                                    <ButtonE disabled={copyCollectionObject.copyConfirmationToken === collection ? false : true}
                                                                        onClick={() => { handleCopyCollection(database, collection, copyCollectionObject["destinationDatabase"], copyCollectionObject["actionIfExists"], copyCollectionObject["newName"]) }}
                                                                        appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", fontFamily: "Work Sans" }}
                                                                        intent="danger"
                                                                    >
                                                                        Confirm Cloning
                                                                    </ButtonE>
                                                                </Pane>
                                                            )}
                                                        >
                                                            <Tooltip content="Clone Collection">
                                                                <ButtonE appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.green.backgroundColor, borderColor: colors.green.backgroundColor, fontFamily: "Work Sans" }}>
                                                                    <FontAwesomeIcon icon={faClone} />
                                                                </ButtonE>
                                                            </Tooltip>
                                                        </Popover>
                                                        <Popover
                                                            content={() => (
                                                                <Pane
                                                                    padding={20}
                                                                    display="flex"
                                                                    alignItems="center"
                                                                    justifyContent="center"
                                                                    flexDirection="column"
                                                                    className="boxes-dialog"
                                                                >
                                                                    <Typography style={{ margin: "1px 0", fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                                        <FontAwesomeIcon icon={faFileExport} style={{ color: colors.yellow.backgroundColor }} /> Migrate Collection
                                                                    </Typography>
                                                                    <TextInputField
                                                                        disabled
                                                                        width="100%"
                                                                        label={<span style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>Source Database</span>}
                                                                        value={database}
                                                                    />
                                                                    <TextInputField
                                                                        disabled
                                                                        width="100%"
                                                                        label={<span style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>Target Collection</span>}
                                                                        value={collection}
                                                                    />
                                                                    <SelectField
                                                                        label="Destination Database"
                                                                        openOnFocus
                                                                        width="100%"
                                                                        onChange={e => { setCopyCollectionObject({ ...copyCollectionObject, destinationDatabase: e.target.value }) }}
                                                                        placeholder="Choose Destination Database"
                                                                    >
                                                                        <option >Select a database</option>
                                                                        {
                                                                            databases.map((e) => {
                                                                                if (e !== database) {
                                                                                    return <option value={e}>{e}</option>
                                                                                }
                                                                            })
                                                                        }
                                                                    </SelectField>
                                                                    <SelectField
                                                                        label="If exists Action"
                                                                        openOnFocus
                                                                        width="100%"
                                                                        onChange={e => { setCopyCollectionObject({ ...copyCollectionObject, actionIfExists: e.target.value }) }}
                                                                        placeholder="Preferred action if collection exists in destination database."
                                                                    >
                                                                        <option>Select an action</option>
                                                                        <option value="replace">replace</option>
                                                                        <option value="rename">rename</option>
                                                                        <option value="abort">abort</option>
                                                                    </SelectField>
                                                                    {
                                                                        copyCollectionObject.actionIfExists === 'rename' ?
                                                                            <TextInputField
                                                                                width="100%"
                                                                                label="New name for collection to rename."
                                                                                onChange={(e) => { setCopyCollectionObject({ ...copyCollectionObject, newName: e.target.value }) }}
                                                                            />
                                                                            : undefined
                                                                    }
                                                                    <TextInputField
                                                                        label="Type the name of the collection to confirm the migration operation."
                                                                        onChange={(e) => { setCopyCollectionObject({ ...copyCollectionObject, copyConfirmationToken: e.target.value }) }}
                                                                    />
                                                                    <ButtonE disabled={copyCollectionObject.copyConfirmationToken === collection ? false : true}
                                                                        onClick={() => { handleMigrateCollection(database, collection, copyCollectionObject["destinationDatabase"], copyCollectionObject["actionIfExists"], copyCollectionObject["newName"]) }}
                                                                        appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", fontFamily: "Work Sans" }}
                                                                        intent="danger"
                                                                    >
                                                                        Confirm Migration
                                                                    </ButtonE>
                                                                </Pane>
                                                            )}
                                                        >
                                                            <Tooltip content="Migrate Collection">
                                                                <ButtonE appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.yellow.backgroundColor, borderColor: colors.yellow.backgroundColor, fontFamily: "Work Sans" }}>
                                                                    <FontAwesomeIcon icon={faFileExport} />
                                                                </ButtonE>
                                                            </Tooltip>
                                                        </Popover>
                                                    </Grid>
                                                    : undefined
                                            }
                                        </Grid>
                                        <Grid item style={{ marginTop: "10px" }}>
                                            <Popover
                                                content={() => (
                                                    <Pane
                                                        padding={20}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        flexDirection="column"
                                                        className="boxes-dialog"
                                                    >
                                                        <Typography style={{ margin: "1px 0", fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                            Migrate All Collections
                                                        </Typography>
                                                        <TextInputField
                                                            disabled
                                                            width="100%"
                                                            label={<span style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>Source Database</span>}
                                                            value={database}
                                                        />
                                                        <TextInputField
                                                            disabled
                                                            width="100%"
                                                            label={<span style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>Target Collection</span>}
                                                            value="migrate-all"
                                                        />
                                                        <SelectField
                                                            label="Destination Database"
                                                            openOnFocus
                                                            width="100%"
                                                            onChange={e => { setCopyCollectionObject({ ...copyCollectionObject, destinationDatabase: e.target.value }) }}
                                                            placeholder="Choose Destination Database"
                                                        >
                                                            <option >Select a database</option>
                                                            {
                                                                databases ?
                                                                    databases.map((e) => {
                                                                        if (e !== database) {
                                                                            return <option value={e}>{e}</option>
                                                                        }
                                                                    }) : undefined
                                                            }
                                                        </SelectField>
                                                        <TextInputField
                                                            label="Type the name of the database to confirm migration"
                                                            onChange={(e) => { setConfirmationToken(e.target.value) }}
                                                        />
                                                        <ButtonE disabled={confirmationToken === database ? false : true}
                                                            onClick={() => { handleMigrateCollection(database, "migrate-all", copyCollectionObject["destinationDatabase"], "", "") }}
                                                            appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", fontFamily: "Work Sans" }}
                                                            intent="danger"
                                                        >
                                                            Confirm Migration
                                                        </ButtonE>
                                                    </Pane>
                                                )}
                                            >
                                                <Tooltip content="Migrate all Collections">
                                                    <ButtonE appearance="primary" style={{ marginRight: "5px", fontSize: "0.825rem", padding: "10px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.yellow.backgroundColor, borderColor: colors.yellow.backgroundColor, fontFamily: "Work Sans" }}>
                                                        <FontAwesomeIcon icon={faFileExport} style={{ marginRight: "5px" }} /> Migrate All
                                                    </ButtonE>
                                                </Tooltip>
                                            </Popover>
                                            <Popover
                                                content={() => (
                                                    <Pane
                                                        padding={20}
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                        flexDirection="column"
                                                        className="boxes-dialog"
                                                    >
                                                        <Typography style={{ margin: "1px 0", fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                            Clone All Collections
                                                        </Typography>
                                                        <TextInputField
                                                            disabled
                                                            width="100%"
                                                            label={<span style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>Source Database</span>}
                                                            value={database}
                                                        />
                                                        <TextInputField
                                                            disabled
                                                            width="100%"
                                                            label={<span style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}>Target Collection</span>}
                                                            value="clone-all"
                                                        />
                                                        <SelectField
                                                            openOnFocus
                                                            width="100%"
                                                            label="Destination Database"
                                                            onChange={e => { setCopyCollectionObject({ ...copyCollectionObject, destinationDatabase: e.target.value }) }}
                                                            placeholder="Choose Destination Database"
                                                        >
                                                            <option >Select a database</option>
                                                            {
                                                                databases ?
                                                                    databases.map((e) => {
                                                                        if (e !== database) {
                                                                            return <option value={e}>{e}</option>
                                                                        }
                                                                    }) : undefined
                                                            }
                                                        </SelectField>
                                                        <TextInputField
                                                            label="Type the name of the database to confirm cloning"
                                                            onChange={(e) => { setConfirmationToken(e.target.value) }}
                                                        />
                                                        <ButtonE disabled={confirmationToken === database ? false : true}
                                                            onClick={() => { handleCopyCollection(database, "clone-all", copyCollectionObject["destinationDatabase"], "", "") }}
                                                            appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", fontFamily: "Work Sans" }}
                                                            intent="danger"
                                                        >
                                                            Confirm Cloning
                                                        </ButtonE>
                                                    </Pane>
                                                )}
                                            >
                                                <Tooltip content="Clone all Collection">
                                                    <ButtonE appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginTop: "5px", color: colors.bwg.accentColor, backgroundColor: colors.green.backgroundColor, borderColor: colors.green.backgroundColor, fontFamily: "Work Sans" }}>
                                                        <FontAwesomeIcon icon={faClone} style={{ marginRight: "5px" }} /> Clone All
                                                    </ButtonE>
                                                </Tooltip>
                                            </Popover>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </div>

                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
                            <div className="compartments" style={{ padding: "15px", height: "100%" }}>
                                <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: "100%" }} spacing={2}>
                                    <Grid item style={{ width: "100%" }}>
                                        <Grid container direction="row" justify="space-between" alignItems="flex-start" style={{ width: "100%" }}>
                                            <Grid item>
                                                <Typography style={{ margin: "1px 0", color: colors.purple.backgroundColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                    <FontAwesomeIcon icon={faLayerGroup} style={{ marginRight: "5px" }} /> Data
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container direction="row" justify="flex-start" alignItems="flex-end">
                                                    {/*}
                                                    <Grid item >
                                                        <IconButton style={{ padding: "0 5px" }}>
                                                            <PageviewIcon style={{ color: colors.blue.accentColor }} />
                                                        </IconButton>
                                                    </Grid>
                                                    {*/}
                                                    <Grid item >
                                                        <Tooltip content="Add data">
                                                            <IconButton style={{ padding: "0 5px" }} onClick={() => { setOpenAddDataDialog(true); }} >
                                                                <AddToPhotosRoundedIcon style={{ color: colors.green.accentColor }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Dialog
                                                            isShown={openAddDataDialog}
                                                            onCloseComplete={() => { setOpenAddDataDialog(false); }}
                                                            title={"Add data in " + collection}
                                                            hasFooter={true}
                                                            intent="success"
                                                            footer={
                                                                stepCollectionCreate === 4 ? <div style={{ height: "15px" }} ></div> :
                                                                    <ButtonE onClick={() => { handleAddData(database, collection, tempNewData) }} appearance="primary" intent="success">
                                                                        Add
                                                                    </ButtonE>
                                                            }
                                                        >
                                                            {
                                                                data ?
                                                                    Object.keys(data.schema).map((fieldName) => {
                                                                        if (fieldName !== "_id") {
                                                                            return (
                                                                                <TextInputField
                                                                                    key={"add-data-to-" + fieldName}
                                                                                    label={fieldName}
                                                                                    placeholder="Enter Data"
                                                                                    description={data.schema[fieldName]}
                                                                                    style={{ fontFamily: "Work Sans", fontSize: "0.875rem" }}
                                                                                    onChange={(e) => { modifyTempNewData(fieldName, e.target.value) }}
                                                                                />
                                                                            )
                                                                        }
                                                                    })
                                                                    : undefined
                                                            }
                                                        </Dialog>
                                                    </Grid>
                                                    {/*}
                                                    <Grid item >
                                                        <IconButton style={{ padding: "0 5px" }} >
                                                            <DeleteIcon style={{ color: colors.red.accentColor }} />
                                                        </IconButton>
                                                    </Grid>
                                                        {*/}
                                                    <Grid item >
                                                        <Tooltip content="Unmount Spotlight">
                                                            <IconButton style={{ padding: "0 5px" }} onClick={unmountSpotlight} >
                                                                <IndeterminateCheckIcon style={{ color: colors.yellow.accentColor }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item style={{ width: "100%" }}>
                                        {data ?
                                            <div style={{ border: "2px solid #e7e7e7", borderRadius: "5px", height: "90vh", width: "100%", overflow: "auto" }}>
                                                <List>
                                                    {

                                                        Object.keys(data.data).map((uid) => {
                                                            return (
                                                                <>
                                                                    <ListItem button onClick={() => { bringToSpotlight(uid) }} style={{ margin: "2.5px 0" }} >
                                                                        <ListItemText
                                                                            primary={
                                                                                Object.keys(data.data[uid]).map((datapacks) => {
                                                                                    return (
                                                                                        <>
                                                                                            <Typography style={{ lineHeight: "1.75", color: colors.bwg.backgroundColor, fontFamily: "Work Sans", fontSize: "0.825rem", fontWeight: "400" }}>
                                                                                                {datapacks === "_id" ? <FontAwesomeIcon icon={faKey} style={{ marginRight: "5px", color: colors.yellow.backgroundColor }} /> : undefined}<span style={{ color: colors.purple.accentColor }}>{datapacks}</span> : {data.data[uid][datapacks]}
                                                                                            </Typography>
                                                                                        </>
                                                                                    );
                                                                                })
                                                                            }
                                                                        />

                                                                    </ListItem>
                                                                    <Divider />
                                                                </>
                                                            );
                                                        })
                                                    }
                                                </List>
                                            </div>
                                            :
                                            <div style={{ padding: "10px", height: "80vh", width: "100%" }}>
                                                <Grid container direction="column" alignItems="center" justify="center" style={{ width: "100%", height: "100%" }}>
                                                    <Grid item style={{ width: "100%" }}>
                                                        <center>
                                                            <img src={datamiss} style={{ width: "60%" }} />
                                                        </center>
                                                    </Grid>
                                                    <Grid item >
                                                        <Typography style={{ fontSize: "1.25rem", fontFamily: "Work Sans" }}>
                                                            Data is the new Oxygen!
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        }
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={3} xl={3} style={{ width: "100%" }}>
                            <div style={{ padding: "15px", height: "100vh", overflow: "auto", width: "100%" }}>
                                <Grid container direction="column" justify="center" alignItems="flex-start" style={{ width: "100%" }} spacing={2}>
                                    <Grid item style={{ width: "100%" }}>
                                        <Grid container direction="row" justify="space-between" alignItems="flex-start" style={{ width: "100%" }} >
                                            <Grid item>
                                                <Typography style={{ margin: "1px 0", color: colors.yellow.backgroundColor, fontFamily: 'Work Sans', fontSize: "1rem" }} >
                                                    <FontAwesomeIcon icon={faLightbulb} style={{ marginRight: "5px" }} /> Spotlight
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Grid container direction="row" justify="flex-start" alignItems="flex-end">
                                                    <Grid item>
                                                        {
                                                            spotlight ?
                                                                <Grid item>
                                                                    <Grid container direction="row" justify="flex-start" alignItems="center" style={{ width: "100%" }}>
                                                                        <Grid item >
                                                                            <Tooltip content="Edit Data">
                                                                                <IconButton style={{ padding: "0 5px" }} onClick={() => { setEditMode(true) }} >
                                                                                    <EditIcon style={{ color: colors.green.accentColor }} />
                                                                                </IconButton>
                                                                            </Tooltip>
                                                                        </Grid>
                                                                        <Grid item >
                                                                            <Popover
                                                                                content={() => (
                                                                                    <Pane
                                                                                        padding={20}
                                                                                        display="flex"
                                                                                        alignItems="center"
                                                                                        justifyContent="center"
                                                                                        flexDirection="column"
                                                                                    >
                                                                                        <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans", marginBottom: "5px" }}>
                                                                                            <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: colors.red.backgroundColor, marginRight: "5px" }} />
                                                                                            Are you sure?
                                                                                        </Typography>
                                                                                        <ButtonE onClick={() => { handleDeleteData(database, collection, spotlight['_id']) }} appearance="primary" style={{ fontSize: "0.825rem", padding: "10px", marginLeft: "5px", marginTop: "5px", fontFamily: "Work Sans" }} intent="danger">
                                                                                            Delete
                                                                                        </ButtonE>
                                                                                    </Pane>
                                                                                )}
                                                                            >
                                                                                <Tooltip content="Delete data">
                                                                                    <IconButton style={{ padding: "0 5px " }} onClick={() => { }}>
                                                                                        <DeleteIcon style={{ color: colors.red.accentColor }} />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                            </Popover>
                                                                        </Grid>
                                                                    </Grid>
                                                                </Grid>
                                                                : undefined
                                                        }
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item style={{ width: "100%", }}>
                                        {
                                            spotlight ?
                                                <div style={{ width: "100%", borderRadius: "5px", overflow: "auto" }}>
                                                    {
                                                        Object.keys(spotlight).map((key) => {
                                                            return (
                                                                <div style={{ marginBottom: "7.5px" }}>
                                                                    <Typography style={{ marginBottom: "2.5px", fontFamily: 'Work Sans', fontSize: "0.875rem", width: "100%" }}>
                                                                        {key === "_id" ? <FontAwesomeIcon icon={faKey} style={{ marginRight: "5px", color: colors.yellow.backgroundColor }} /> : undefined}
                                                                        {key}
                                                                    </Typography>
                                                                    <TextField
                                                                        disabled={editMode && key !== '_id' ? false : true}
                                                                        multiline
                                                                        maxRows={3}
                                                                        defaultValue={spotlight[key]}
                                                                        variant="outlined"
                                                                        style={{ fontFamily: 'Work Sans', fontSize: "0.875rem", width: "100%", color: colors.bwg.backgroundColor, borderColor: key === "_id" ? colors.yellow.backgroundColor : colors.bwg.foregroundColor }}
                                                                        onChange={(e) => { modifySpotlightData(key, e.target.value) }}
                                                                    />
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                    {
                                                        editMode ?
                                                            <ButtonE onClick={() => handleUpdateData(database, collection, spotlight)} appearance="primary" size="large" intent="success">
                                                                Update
                                                            </ButtonE> : undefined
                                                    }
                                                </div>
                                                :
                                                <div style={{ padding: "10px", height: "80vh", width: "100%" }}>
                                                    <Grid container direction="column" alignItems="center" justify="center" style={{ width: "100%", height: "100%" }}>
                                                        <Grid item style={{ width: "100%" }}>
                                                            <img src={spotmiss} style={{ width: "100%" }} />
                                                        </Grid>
                                                        <Grid item >
                                                            <Typography style={{ fontSize: "1rem", fontFamily: "Work Sans" }}>
                                                                Looking for something?
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                        }
                                    </Grid>
                                </Grid>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
        </Grid >
    );
}

export default DockLargeScreen;
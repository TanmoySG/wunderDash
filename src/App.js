import React, { useState, useEffect } from 'react';
import "./App.css";
import logo from './assets/wdash.png';
import useReactFontLoader from 'react-font-loader'
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner, toaster } from 'evergreen-ui';
import { FormControl, Hidden, Button, Grid, Typography, OutlinedInput, InputAdornment } from "@material-ui/core";
import { faArrowRight, faAsterisk, faAt } from '@fortawesome/free-solid-svg-icons';
import Dashboard from './components/dash.component';

function App() {

	const config = require("./assets/wdb.secrets.json")

	const WDB_URL = config.WDB_URL

	var endpoint = `${WDB_URL}/login`;

	let theme = createMuiTheme({
		palette: {
			type: 'light',
		},
	});

	useReactFontLoader({
		url:
			"https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Work+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap",
	});

	const colors = {
		blue: {
			backgroundColor: "#2B8BFF",
			foregroundColor: "#DBF0FF",
			accentColor: "#2196f3",
		},
		red: {
			backgroundColor: "#b10041",
			foregroundColor: "#ffe8ed",
			accentColor: "#AA0023",
		},
		green: {
			backgroundColor: "#009a76",
			foregroundColor: "#deffd0",
			accentColor: "#3faf62",
		},
		yellow: {
			backgroundColor: "#f1a700",
			foregroundColor: "#fff7d0",
			accentColor: "#ff9800",
		},
		purple: {
			backgroundColor: "#7d00dc",
			foregroundColor: "#ebd0ff",
			accentColor: "#6a5ce9"
		},
		bwg: {
			backgroundColor: "#000000",
			foregroundColor: "#dcdcdc",
			accentColor: "#ffffff"
		}
	}

	const [loginInfo, setLoginInfo] = useState({
		username: "",
		password: "",
	});

	const [error, setError] = useState();
	const [process, setProcess] = useState('Ready');
	const [loginStatus, setloginStatus] = useState();

	const toggleLogin = () => {
		setloginStatus(sessionStorage.getItem("login_status"));
	}

	useEffect(() => {
		setProcess('Ready');
		toggleLogin();
		/*
		return () => {
			cleanup
		}
		*/
	}, []);

	const setLogin = () => {
		setProcess('Processing');
		fetch(endpoint, {
			method: "POST",
			cache: "no-cache",
			headers: {
				"content_type": "application/json",
			},
			body: JSON.stringify(loginInfo)
		}).then(response => {
			return response.json()
		}).then(json => {
			if (json.status_code !== '1') {
				toaster.danger(json.response);
				setError(json.response);
				setProcess('Processed');
			} else {
				setError();
				setProcess('Processed');
				sessionStorage.setItem("login_status", "logged-in");
				sessionStorage.setItem("cluster_id", json.cluster_id);
				sessionStorage.setItem("access_token", json.access_token);
				sessionStorage.setItem("name", json.name);
				sessionStorage.setItem("email", loginInfo.username);
			};
			toggleLogin();
		})
	}


	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{
				loginStatus !== "logged-in" ?
					<Grid container direction="row" justify="center" alignItems="center" style={{ height: "100vh" }}>
						<Grid item xs={12} sm={12} md={12} lg={4} xl={4} style={{ zIndex: "100", width: "100%", height: "100%", boxShadow: "-5px 0px 198px -2px rgba(0,0,0,0.8)" }}>
							<Grid container direction="column" justify="center" alignItems="center" style={{ height: "100%" }} spacing={2}>
								<Grid item>
									<Grid container direction="row" justify="center" alignItems="center">
										<img src={logo} style={{ height: "50px", width: "50px", marginRight: "5px" }} />
										<Typography style={{ fontFamily: "Work Sans", fontSize: "1.15rem", lineHeight: "1", fontWeight: "400" }}>wunder<br /><span style={{ fontWeight: "600" }}>Dash</span></Typography>
									</Grid>
								</Grid>
								<Grid item style={{ marginTop: "5px" }}>
									<FormControl fullWidth variant="outlined">
										<Typography style={{ fontFamily: "Work Sans", fontSize: "1rem", lineHeight: "1", fontWeight: "500", marginBottom: "5px" }}>
											Email
										</Typography>
										<OutlinedInput
											id="outlined-adornment-amount"
											startAdornment={
												<InputAdornment position="start">
													<FontAwesomeIcon icon={faAt} style={{ color: colors.red.accentColor }} />
												</InputAdornment>
											}
											onChange={e => setLoginInfo({ ...loginInfo, username: e.target.value })}
											size="small"
											style={{ fontFamily: "Work Sans", fontSize: "1rem", lineHeight: "1", fontWeight: "500" }}
											inputType="email"
											name="email"
										/>
									</FormControl>
								</Grid>
								<Grid item style={{ marginTop: "5px" }}>
									<FormControl fullWidth variant="outlined">
										<Typography style={{ fontFamily: "Work Sans", fontSize: "1rem", lineHeight: "1", fontWeight: "500", marginBottom: "5px" }}>
											Password
										</Typography>
										<OutlinedInput
											id="outlined-adornment-amount"
											startAdornment={
												<InputAdornment position="start">
													<FontAwesomeIcon icon={faAsterisk} style={{ color: colors.red.accentColor }} />
												</InputAdornment>
											}
											onChange={e => setLoginInfo({ ...loginInfo, password: e.target.value })}
											size="small"
											style={{ fontFamily: "Work Sans", fontSize: "1rem", lineHeight: "1", fontWeight: "500" }}
											type="password"
										/>
									</FormControl>
								</Grid>
								<Grid item style={{ marginTop: "5px" }}>
									<Button variant="contained"
										style={{ backgroundColor: colors.red.accentColor, color: "white", fontFamily: "Work Sans", fontSize: "1rem", }}
										onClick={setLogin}
									>
										Login
										<FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: "5px" }} />
									</Button>
								</Grid>
								{
									process === 'Ready' || process === 'Processed' ? undefined : <Grid item style={{ marginTop: "5px" }}><Spinner /></Grid>
								}
							</Grid>
						</Grid>
						<Hidden mdDown>
							<Grid item xs={12} sm={12} md={12} lg={8} xl={8} style={{ width: "100%", height: "100%" }}>
								<div style={{ backgroundColor: "#99e9ff", backgroundImage: "radial-gradient(at 96% 92%, hsla(211,87%,66%,1) 0, transparent 54%), radial-gradient(at 99% 7%, hsla(152,62%,77%,1) 0, transparent 56%),  radial-gradient(at 82% 4%, hsla(331,70%,65%,1) 0, transparent 56%),  radial-gradient(at 15% 15%, hsla(271,80%,62%,1) 0, transparent 54%), radial-gradient(at 30% 14%, hsla(288,83%,76%,1) 0, transparent 56%), radial-gradient(at 32% 39%, hsla(46,80%,69%,1) 0, transparent 46%), radial-gradient(at 75% 19%, hsla(222,67%,78%,1) 0, transparent 52%)", height: "100%" }}></div>
							</Grid>
						</Hidden>
					</Grid> : <Dashboard colors={colors} />
			}
		</ThemeProvider>
	);
}

export default App;

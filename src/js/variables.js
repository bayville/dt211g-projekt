const goaileTableEl = document.getElementById('goalieTable'); //Get div to render data
const defensemenTableEl = document.getElementById('defensemenTable'); //Get div to render data
const forewardTableEl = document.getElementById('forwardTable'); //Get div to render data

let teamGridEl = document.getElementById('teamGrid');
const statsLeaderGoalsEl = document.getElementById('statsLeaderGoals');
const statsLeaderPointsEl = document.getElementById('statsLeaderPoints');
const statsLeaderAssistsEl = document.getElementById('statsLeaderAssists');
const statsLeaderPlusMinusEl = document.getElementById('statsLeaderPlusMinus');
const teamStatsbarEl = document.getElementById('teamStatsbar');
const teamLogoEl = document.getElementById('teamLogo');
const teamNameEl = document.getElementById('teamName');
const teamsPageMainEl = document.getElementById('teamsPageMain');
const playersPageMainEl = document.getElementById('playersPageMain');
const wikiDataEl = document.getElementById('wikiData')

// Extract the query string parameters from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pathName = window.location.pathname;


const teamID = urlParams.get('teamid'); // Get the team ID from the query string parameters
const playerID = urlParams.get('playerid'); // Get the player ID from the query string parameters
const baseURL = "https://fetch-playground.netlify.app"; // Base URL for API requests used for local production

export {goaileTableEl, defensemenTableEl, forewardTableEl, teamGridEl, statsLeaderGoalsEl, statsLeaderPointsEl, statsLeaderAssistsEl,statsLeaderPlusMinusEl, teamStatsbarEl, teamLogoEl, teamNameEl, teamsPageMainEl, playersPageMainEl, queryString, pathName, teamID, playerID, baseURL, wikiDataEl}
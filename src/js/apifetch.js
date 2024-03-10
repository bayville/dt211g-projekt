// nhlStatsAPI.js
import {goaileTableEl, defensemenTableEl, forwardTableEl, teamGridEl, statsLeaderGoalsEl, statsLeaderPointsEl, statsLeaderAssistsEl,statsLeaderPlusMinusEl, teamStatsbarEl, teamLogoEl, teamNameEl, teamsPageMainEl, playersPageMainEl, queryString, pathName, teamID, playerID, baseURL, wikiDataEl} from './variables';
import { randomPlayer } from './playerids';



//Fetch NHL teams

async function fetchNHLTeams(baseURL) {
  try {
    let teamsData = sessionStorage.getItem('NHLTeams');
    if (teamsData) {
      teamsData = JSON.parse(teamsData);
      return teamsData;
    } else{
      const response = await fetch(`${baseURL}/.netlify/functions/apidata?url=https://api-web.nhle.com/v1/standings/now`);
      teamsData = await response.json();
      console.log("Fetched teams from API:");
      console.log(teamsData);
      sessionStorage.setItem('NHLTeams', JSON.stringify(teamsData));
      return teamsData;
    }
  } catch (error) {
    console.error("Error fetching NHL teams data: ", error);
    return error;
  }
}



//Fetch Statsleaders

async function fetchNHLStatsLeaders() {
  try {
    let statsLeaderData = sessionStorage.getItem('statsLeaders');
    if (statsLeaderData) {
      statsLeaderData = JSON.parse(statsLeaderData);
      console.log("Fetched statsleaders from session storage:");
      console.log(statsLeaderData);
      return statsLeaderData;
    } else {
      const response = await fetch(`${baseURL}/.netlify/functions/apidata?url=https://api-web.nhle.com/v1/skater-stats-leaders/current`);
      statsLeaderData = await response.json();
      console.log("Fetched tatsleaders from API:");
      sessionStorage.setItem('statsLeaders', JSON.stringify(statsLeaderData));
      return statsLeaderData;
    }
  } catch (error) {
    console.error("Error: ", error);
    return error;
  }
}


//Fetch NHLRosters

async function fetchNHLRoster(baseURL, teamAbb) {
  try {
    let rosterData = sessionStorage.getItem(`tr-${teamAbb}`); // Get rosterData from sessionStorage if it exists.
    if (rosterData) {
      rosterData = JSON.parse(rosterData);
      console.log("Fetched roster from session storage:");
      console.log(rosterData);
      return rosterData; // Return rosterData if fetched from sessionStorage.
    } else {
      const response = await fetch(`${baseURL}/.netlify/functions/apidata?url=https://api-web.nhle.com/v1/roster/${teamAbb}/current`);
      rosterData = await response.json();
      console.log("Fetched roster from API:");
      console.log(rosterData);
      sessionStorage.setItem(`tr-${teamAbb}`, JSON.stringify(rosterData));
      return rosterData; // Return rosterData fetched from API.
    }
  } catch (error) {
    console.error('Error:', error);
    return null; // Return null if there's an error fetching the rosterData.
  }
}



//Fetch players

async function fetchNHLPlayer(baseURL, playerID){
  try{
    let playerData = sessionStorage.getItem(`p-${playerID}`);
    if (playerData) {
      playerData = JSON.parse(playerData); 
      console.log("Fetched player from session storage:");
      console.log(playerData);
    } else{
      const response = await fetch( `${baseURL}/.netlify/functions/apidata?url=https://api-web.nhle.com/v1/player/${playerID}/landing`);
      playerData = await response.json();
      console.log("Fetched player from api:");
      console.log(playerData);
      sessionStorage.setItem(`p-${playerID}`, JSON.stringify(playerData));
    }
    
    let playerName;
    //If Swedish or Skandinavian name exist use that, else use deafult
    if (playerData.lastName.sv) {
        if (playerData.firstName.sv) {
          playerName = `${playerData.firstName.sv} ${playerData.lastName.sv}`;
        }else {
        playerName = `${playerData.firstName.default} ${playerData.lastName.sv}`;
        }
      console.log("SV-name");
    } else if (playerData.lastName.sk) {
        if (playerData.firstName.sk) {
         playerName = `${playerData.firstName.sk} ${playerData.lastName.sk}`;
        }else {
        playerName = `${playerData.firstName.default} ${playerData.lastName.sk}`;
        }
        console.log("SK-name");
    } else {
      playerName = `${playerData.firstName.default} ${playerData.lastName.default}`;
      console.log("Default-name");
    }

    fetchAndRenderWikiContent(baseURL, playerName);
    return playerData; 
    
  } catch (error){
    console.error("Error: ", error);
  }
}


//Fetch and Render Wiki Content

async function fetchAndRenderWikiContent(baseURL, searchQuery) {
  const apiUrl = "https://sv.wikipedia.org/w/api.php";
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    prop: "extracts",
    exintro: true,
    explaintext: true,
    titles: searchQuery
  });

  const apiUrlEncoded = encodeURIComponent(`${apiUrl}?${params}`);
  const fetchUrl = `${baseURL}/.netlify/functions/apidata?url=${apiUrlEncoded}`;
  
  try {
    let pageContent = sessionStorage.getItem(`wiki-${searchQuery}`);

    if (pageContent) {
      pageContent = JSON.parse(pageContent); 
      console.log("Fetched wikidata from session storage:");
      console.log(pageContent);

    } else {
      console.log("Page content is not available in sessions storage");
      const response = await fetch(fetchUrl);   
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0]; // Get the page ID

      pageContent = pages[pageId].extract; // Get the page content
      console.log("Fetched wikidata from API:");
      console.log(pageContent); // Handle the response data here
      sessionStorage.setItem(`wiki-${searchQuery}`, JSON.stringify(pageContent));
    }

    //If Wiki data element exists, render the pageContent to element
    if (wikiDataEl) {
      wikiDataEl.innerHTML += `${pageContent}`;
    }
    
    return pageContent;
  } catch (error) {
    console.error('Error:', error);
  }
}


//Pre fetch team - gets called on hover of team in teamsgrid

async function preFetchTeam(teamID, teamsData){
  await fetchNHLRoster(baseURL, teamID);
  //Find current team
  const currentTeam = teamsData.standings.find(data => data.teamAbbrev.default == teamID);

  console.log(currentTeam);
  console.log("Filtered team:", currentTeam.teamName.default);
  
  //Render teamname and logo
  const teamName = currentTeam.teamName.default;
  
  //Clean team name from é and fetch Wikipedia content
  const cleanTeamName = teamName.replace(/é/g, 'e');
  fetchAndRenderWikiContent(baseURL, cleanTeamName);
}



//Fetch a random player

async function fetchRandomPlayer(){
  try{
    const randomPlayerID = randomPlayer(); //Get a random playerid from playerids. js
    console.log("randomplayerID:", randomPlayerID);
    const playerData = await fetchNHLPlayer(baseURL, randomPlayerID);
    
    console.log("Random player data:", playerData);
    return (playerData);
  }
  catch (error){
    console.error('Ingen spelare hittad:', error);
  }
}
  


export {fetchNHLStatsLeaders, fetchNHLTeams, fetchNHLRoster, fetchNHLPlayer, fetchAndRenderWikiContent, preFetchTeam, fetchRandomPlayer};

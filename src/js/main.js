import './navigation';
import { fetchNHLStatsLeaders, fetchNHLTeams } from './nhlStatsAPI';

const table = document.getElementById('table'); //Get div to render data
const tableP = document.getElementById('tableP'); //Get div to render data
const teamInfoEl = document.getElementById('teamInfo'); //Get div to render data
const teamRosterEl = document.getElementById('teamRoster');//Get div to render data
const teamRosterGoaliesEl = document.getElementById('teamRosterGoalies'); //Get div to render data
const teamRosterDefensemenEl = document.getElementById('teamRosterDefensemen'); //Get div to render data
const teamRosterForwardsEl = document.getElementById('teamRosterForwards'); //Get div to render data
const teamGridEl = document.getElementById('teamGrid');
const statsLeaderGoalsEl = document.getElementById('statsLeaderGoals');
const statsLeaderPointsEl = document.getElementById('statsLeaderPoints');
const statsLeaderAssistsEl = document.getElementById('statsLeaderAssists');
const statsLeaderPlusMinusEl = document.getElementById('statsLeaderPlusMinus');

let playerName;

// Extract the query string parameters from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

const teamID = urlParams.get('teamid'); // Get the team ID from the query string parameters
const playerID = urlParams.get('playerid'); // Get the player ID from the query string parameters
const baseURL = "https://fetch-playground.netlify.app"; // Base URL for API requests used for local production


async function renderTeamsGrid(){
  try{
    const teamsData = await fetchNHLTeams(baseURL);
    console.log(teamsData);
  const sortedTeamsData = teamsData.standings.toSorted((a, b) => a.teamName.default.localeCompare(b.teamName.default)); //Sort teams alphabetical
  sortedTeamsData.forEach(team => {
    teamGridEl.innerHTML += `
    <!-- Team ${team.teamAbbrev.default} -->
    <a href="/teams.html?teamid=${team.teamAbbrev.default}" class="team__box">
      <img class="team__logo--medium" src="${team.teamLogo}" alt="">
      <p class="small">${team.teamName.default}</p>
    </a>
    <!-- Next team -->
    `
  });
} catch (error) {
  console.error('Error:', error);
}
}

async function renderNHLTeam(teamID){
  try{
    console.log(teamID);
    const teamsData = await fetchNHLTeams(baseURL);
    console.log(teamsData.standings);
    const currentTeam = teamsData.standings.find(data => data.teamAbbrev.default == teamID);
      console.log(currentTeam);
      console.log("Filtered team:", currentTeam.teamName.default);
      const teamName = currentTeam.teamName.default;
      document.title += teamName;
      const cleanTeamName = teamName.replace(/é/g, 'e');
      fetchWikiContent(baseURL, cleanTeamName);
      fetchNHLRoster(baseURL, teamID);
    } catch (error) {
    console.error('Error:', error);
  }
}



async function renderStatsCards(statType, statElement) {
  try {
      const data = await fetchNHLStatsLeaders();
      if (data) {
          statElement.innerHTML = "";
          let i = 1;
          data[statType].forEach((player) => {
              const playerName = `${player.firstName.default} ${player.lastName.default}`;
              const statValue = statType === "plusMinus" ? `+${player.value}` : player.value;
              if (i === 1) {
                  statElement.innerHTML = `
                      <!-- Start of top -->
                      <a href="/players.html?playerid=${player.id}" class="statsleader__card--top statsleader__card--top">
                          <div class="statsleader__card--top--text">
                              <div>
                                  <p class="small">${player.firstName.default}</p>
                                  <p class="statsleader__card--top--name">${player.lastName.default}</p>
                              </div>
                              <p class="statsleader__card--top--stat">${statValue}</p>
                          </div>
                          <div>
                              <img src="${player.headshot}" alt="Porträtt av ${playerName}">
                          </div>
                      </a>
                      <!-- End of top -->
                      <div class="statsleader__card--list">
                  `;
                  i++;
              } else {
                  statElement.innerHTML += `
                      <!-- Item ${i} -->
                      <a href="/players.html?playerid=${player.id}">
                          <div class="statsleader__card--list--item">
                              <p class="statsleader__card--list--rank smallest">${i}</p>
                              <img class="statsleader__card--list--img" src="${player.headshot}" alt="">
                              <p class="statsleader__card--list--name small" >${playerName}</p>
                              <p class="statsleader__card--list--stat">${statValue}</p>
                          </div>
                      </a>
                  `;
                  i++;
              }
          });
          statElement.innerHTML += `</div>`;
      }
  } catch (error) {
      console.error("Error: ", error);
  }
}


// Fetch players
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
    
    if (playerData.lastName.sv) {
      playerName = `${playerData.firstName.default} ${playerData.lastName.sv}`;
    } else {
      playerName = `${playerData.firstName.default} ${playerData.lastName.default}`;
    }
    
    if (tableP) {  //If player table exist. 
      document.title += `${playerName}`;
      tableP.innerHTML += `
            <div class="flex">
            <a href="./teams.html?teamid=${playerData.currentTeamAbbrev}"><img id="teamLogo" src="${playerData.teamLogo}" alt="${playerData.fullTeamName.default} logo" width="48px" height="48px">${playerData.fullTeamName.default}</a>   
              <h2>#${playerData.sweaterNumber} | ${playerName}</h2>
            </div>   
            <div class="playerHeroContainer">
            <img id="playerHero" src="${playerData.heroImage}" style="width:100%; height:auto;">
            </div>
            <div class="playerInfo">
                    <img src="${playerData.headshot}" id="playerInfoHeadshot" style="width:100%; height:auto;">
                    <div>
                    <h4>${playerName}</h4>
                    <ul>
                    <li>Längd: ${playerData.heightInCentimeters}</li>
                    <li>Vikt: ${playerData.weightInKilograms}</li>
                    <li>Födelsedatum: ${playerData.birthDate}</li>
                    <li>Fattning: ${playerData.shootsCatches}</li>
                    <li>Draftad: ${playerData.draftDetails ? `#${playerData.draftDetails.overallPick}, ${playerData.draftDetails.year} till ${playerData.draftDetails.teamAbbrev}` : "Inte draftad"}</li>
                  </ul>
                  </div>
            </div>
            `;
    }

    fetchWikiContent(baseURL, `${playerName}`);
  } catch (error){
    console.error("Error: ", error);
  }
}


async function fetchNHLRoster(baseURL, teamAbb){
  try{
    let rosterData = sessionStorage.getItem(`tr-${teamAbb}`); //Get rosterData from sessionstorage if it exists.
    if (rosterData) {
      rosterData = JSON.parse(rosterData)
      console.log("Fetched roster from session storage:");
      console.log(rosterData);
    } else{
      const response = await fetch(`${baseURL}/.netlify/functions/apidata?url=https://api-web.nhle.com/v1/roster/${teamAbb}/current`);
      rosterData = await response.json();
      console.log("Fetched roster from api:");
      console.log(rosterData);
      sessionStorage.setItem(`tr-${teamAbb}`, JSON.stringify(rosterData));
    }

  // rosterData.goalies.forEach(goalie => {
  //   teamRosterGoaliesEl.innerHTML += `
  //   <article><img src="${goalie.headshot}" alt="Portrait of ${goalie.firstName.default} ${goalie.lastName.default}"><h4><a href="players.html?playerid=${goalie.id}"> ${goalie.firstName.default} ${goalie.lastName.default}</h4></a></article>
  //   `
  // })

  // rosterData.defensemen.forEach(defender => {
  //   teamRosterDefensemenEl.innerHTML += `
  //   <article><img src="${defender.headshot}" alt="Portrait of ${defender.firstName.default} ${defender.lastName.default}"><h4><a href="players.html?playerid=${defender.id}"> ${defender.firstName.default} ${defender.lastName.default}</h4></a></article>
  //   `
  // })

  // rosterData.forwards.forEach(forwards => {
  //   teamRosterForwardsEl.innerHTML += `
  //   <article><img src="${forwards.headshot}" alt="Portrait of ${forwards.firstName.default} ${forwards.lastName.default}"><h4><a href="players.html?playerid=${forwards.id}"> ${forwards.firstName.default} ${forwards.lastName.default}</h4></a></article>
  //   `
  // })  
  } catch (error){
    console.error('Error:', error);
  }
}

  

async function fetchWikiContent(baseURL, searchQuery) {
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
      console.log("Page content is not available");
      const response = await fetch(fetchUrl);   
      const data = await response.json();
      const pages = data.query.pages;
      const pageId = Object.keys(pages)[0]; // Get the page ID
      pageContent = pages[pageId].extract; // Get the page content
      console.log("Fetched wikidata from API:");
      console.log(pageContent); // Handle the response data here
      sessionStorage.setItem(`wiki-${searchQuery}`, JSON.stringify(pageContent));
    }

    
    if (teamInfoEl) {
      teamInfoEl.innerHTML += `<p>${pageContent}</p>`;
    }
    
    return pageContent;
  } catch (error) {
    console.error('Error:', error);
  }
}



renderStatsCards("goals", statsLeaderGoalsEl);
renderStatsCards("points", statsLeaderPointsEl);
renderStatsCards("assists", statsLeaderAssistsEl);
renderStatsCards("plusMinus", statsLeaderPlusMinusEl);


  if (teamID){
    renderNHLTeam(teamID.toUpperCase());
  } else {
    renderTeamsGrid();
  }
  
  if (playerID){
    fetchNHLPlayer(baseURL, playerID);
  } 




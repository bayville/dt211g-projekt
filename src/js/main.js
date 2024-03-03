import './navigation';
import {fetchNHLStatsLeaders, fetchNHLTeams, fetchNHLRoster, fetchAndRenderWikiContent} from './apifetch';

const tableP = document.getElementById('tableP'); //Get div to render data
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

// Extract the query string parameters from the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const pathName = window.location.pathname;

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
      <!-- Start of ${team.teamAbbrev.default} -->
      <a href="/teams.html?teamid=${team.teamAbbrev.default}" class="team__box" id="${team.teamAbbrev.default}">
          <img class="team__logo--medium" src="${team.teamLogo}" alt="">
          <p class="small">${team.teamName.default}</p>
      </a>
      <!-- End of ${team.teamAbbrev.default} -->
      `;
  });
  const teamElements = document.querySelectorAll('.team__box');
        
  // Add event listener to each team element
  teamElements.forEach(teamElement => {
    teamElement.addEventListener('mouseenter', () => {
      const teamAbbrev = teamElement.id;
      console.log(`Team ${teamAbbrev} hovered`);
      preFetchTeam(teamAbbrev, teamsData); // Call the first function
     }, { once: true });
  });
} catch (error) {
  console.error('Error:', error);
}
}


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


async function renderNHLTeam(teamID){
  try{
    console.log("TeamID:", teamID);
    const teamsData = await fetchNHLTeams(baseURL);

    //Find current team
    const currentTeam = teamsData.standings.find(data => data.teamAbbrev.default == teamID);
    const teamRank = (teamsData.standings.findIndex(data => data.teamAbbrev.default === teamID) + 1);

    console.log(currentTeam);
    console.log("Filtered team:", currentTeam.teamName.default);
    
    //Render teamname and logo
    const teamName = currentTeam.teamName.default;
    teamNameEl.innerText = `${teamName}`;
    teamLogoEl.innerHTML += `<img src="${currentTeam.teamLogo}" alt="${teamName} logo">`;
    
    //Change document title    
    document.title +=` | ${teamName}` ;
    
    //Clean team name from é and fetch Wikipedia content
    const cleanTeamName = teamName.replace(/é/g, 'e');
    fetchAndRenderWikiContent(baseURL, cleanTeamName);

    //Convert seasonId to string and format it
    const seasonId = currentTeam.seasonId.toString();
    const formattedSeasonId = `${seasonId.slice(0, 4)}-${seasonId.slice(4)}`;
    console.log(formattedSeasonId);

    //Render Statsbar content
    teamStatsbarEl.innerHTML += `
      <h2>${formattedSeasonId}</h2>
      
      <div class="statsbar__stats">

        <!-- Rank -->
        <div class="statsbar__stats--box">
          <p class="smallest">Rank</p>
          <p class="statsbar__stats--box--stat">${teamRank}</p>
        </div>

        <!-- Games played -->
        <div class="statsbar__stats--box">
          <p class="smallest">GP</p>
          <p class="statsbar__stats--box--stat">${currentTeam.gamesPlayed}</p>
        </div>
        
        <!-- Wins -->
        <div class="statsbar__stats--box">
          <p class="smallest">W</p>
          <p class="statsbar__stats--box--stat">${currentTeam.wins}</p>
        </div>

        <!-- Losses -->
        <div class="statsbar__stats--box">
          <p class="smallest">L</p>
          <p class="statsbar__stats--box--stat">${currentTeam.losses}</p>
        </div>

        <!-- OT Losses -->
        <div class="statsbar__stats--box">
          <p class="smallest">OTL</p>
          <p class="statsbar__stats--box--stat">${currentTeam.otLosses}</p>
        </div>

        <!-- OT Losses -->
        <div class="statsbar__stats--box">
          <p class="smallest">P</p>
          <p class="statsbar__stats--box--stat">${currentTeam.points}</p>
        </div>
        

      </div>
    `;

    renderRoster(baseURL, teamID);
    } catch (error) {
    console.error('Error:', error);
  }
}


async function renderStatsCards() {
  try {
      const data = await fetchNHLStatsLeaders();
      const statElements = [
          ["points", statsLeaderPointsEl],
          ["goals", statsLeaderGoalsEl],
          ["assists", statsLeaderAssistsEl],
          ["plusMinus", statsLeaderPlusMinusEl]
      ];
      if (!data) {
        console.log("no data");
        return;
      }

      for (const [statType, statElement] of statElements) {
          if (statElement) {
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
                                  <img class="statsleader__card--list--img" src="${player.headshot}" alt="Porträtt av ${playerName}">
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

    fetchAndRenderWikiContent(baseURL, `${playerName}`);
  } catch (error){
    console.error("Error: ", error);
  }
}


async function renderRoster(baseURL, teamID) {
  try {
    const rosterData = await fetchNHLRoster(baseURL, teamID);
    console.log("Rosterdata:", rosterData.goalies);
    if (rosterData){

      // Render each category of players
      rosterData.goalies.forEach(goalie => {
        goaileTableEl.innerHTML += `
        <tr>
        <td><a href="/players?playerid=${goalie.id}"><img class="statsleader__card--list--img" src="${goalie.headshot}" alt=""> ${goalie.firstName.default} ${goalie.lastName.default}</a></td>
        <td><a href="/players?playerid=${goalie.id}"> ${goalie.sweaterNumber}</a></td>
        <td><a href="/players?playerid=${goalie.id}"> ${goalie.positionCode}</a></td>
        <td><a href="/players?playerid=${goalie.id}"> ${goalie.shootsCatches}</a></td>
        <td><a href="/players?playerid=${goalie.id}"> ${goalie.heightInCentimeters}</a></td>
        <td><a href="/players?playerid=${goalie.id}"> ${goalie.weightInKilograms}</a></td>
        </tr>
        `;
      });
      
      rosterData.defensemen.forEach(defender => {
        defensemenTableEl.innerHTML += `
        <tr>
        <td><a href="/players?playerid=${defender.id}"><img class="statsleader__card--list--img" src="${defender.headshot}" alt=""> ${defender.firstName.default} ${defender.lastName.default}</a></td>
        <td><a href="/players?playerid=${defender.id}"> ${defender.sweaterNumber}</a></td>
        <td><a href="/players?playerid=${defender.id}"> ${defender.positionCode}</a></td>
        <td><a href="/players?playerid=${defender.id}"> ${defender.shootsCatches}</a></td>
        <td><a href="/players?playerid=${defender.id}"> ${defender.heightInCentimeters}</a></td>
        <td><a href="/players?playerid=${defender.id}"> ${defender.weightInKilograms}</a></td>
        </tr>
        `;
      });
      
      rosterData.forwards.forEach(forward => {
        forewardTableEl.innerHTML += `
        <tr>
        <td><a href="/players?playerid=${forward.id}"><img class="statsleader__card--list--img" src="${forward.headshot}" alt=""> ${forward.firstName.default} ${forward.lastName.default}</a></td>
        <td><a href="/players?playerid=${forward.id}"> ${forward.sweaterNumber}</a></td>
        <td><a href="/players?playerid=${forward.id}"> ${forward.positionCode}</a></td>
        <td><a href="/players?playerid=${forward.id}"> ${forward.shootsCatches}</a></td>
        <td><a href="/players?playerid=${forward.id}"> ${forward.heightInCentimeters}</a></td>
        <td><a href="/players?playerid=${forward.id}"> ${forward.weightInKilograms}</a></td>
        </tr>
        `;
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }

}


  



if (statsLeaderGoalsEl) {
renderStatsCards();
}

  if (teamID){
    renderNHLTeam(teamID.toUpperCase());
  } else if (!teamID && teamsPageMainEl) {
    console.log('RenderTeamsGrid Function');
    teamsPageMainEl.innerHTML = `
      <div class="section__padding--light-bg">
        <section class="container--l" aria-label="NHL-lag">
          <h2 class="line-heading--small">Lag</h2>
          <div class="grid__teams section__padding" id="teamGrid"></div>
        </section>
      </div>
    `;
    teamGridEl = document.getElementById('teamGrid');
    renderTeamsGrid();
  }

  if (teamGridEl && (pathName == "/")){
      renderTeamsGrid();
  }
  

  if (playerID){
    fetchNHLPlayer(baseURL, playerID);
  } 




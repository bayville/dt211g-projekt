import {fetchNHLStatsLeaders, fetchNHLTeams, fetchNHLRoster, fetchNHLPlayer, fetchAndRenderWikiContent, preFetchTeam, fetchRandomPlayer} from './apifetch';
import { goaileTableEl, defensemenTableEl, forewardTableEl, teamGridEl, statsLeaderGoalsEl, statsLeaderPointsEl, statsLeaderAssistsEl,statsLeaderPlusMinusEl, teamStatsbarEl, teamLogoEl, teamNameEl, teamsPageMainEl, playersPageMainEl, queryString, pathName, teamID, playerID, baseURL, playerHeaderInfoEl, playerplayerActionImgEl, playerTeamRosterEl, playerProfileInfoEl, playerStatsbarEl } from './variables';

//Eventlisteners
if (playerTeamRosterEl){
    playerTeamRosterEl.addEventListener('change', () => {
        console.log(playerTeamRosterEl.value);
        window.location.href = `/players.html?playerid=${playerTeamRosterEl.value}`;
    })
}


// Render Teams Grid
async function renderTeamsGrid(el){
try{
    const teamsData = await fetchNHLTeams(baseURL);
    console.log(teamsData);
    const sortedTeamsData = teamsData.standings.toSorted((a, b) => a.teamName.default.localeCompare(b.teamName.default)); //Sort teams alphabeticals
    
    
 
    sortedTeamsData.forEach(team => {
    el.innerHTML += `
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
        preFetchTeam(teamAbbrev, teamsData); 
        }, { once: true });
    });
} catch (error) {
console.error('Error:', error);
}
}

// Render NHLTeam

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


//Render team roster

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
        sessionStorage.setItem(`pre-p-${goalie.id}`, JSON.stringify(goalie));
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
        sessionStorage.setItem(`pre-p-${defender.id}`, JSON.stringify(defender));
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
        sessionStorage.setItem(`pre-p-${forward.id}`, JSON.stringify(forward));
    });
    }
} catch (error) {
    console.error('Error:', error);
}

}


// Render Statscards

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


//Render Player

async function renderPlayer(playerID) {
try {
    let playerData;
    let prePlayerData;
    
    if (!playerID){
        playerData = await fetchRandomPlayer();
        console.log("Fetch randomplayer succesful now render: ", playerData);

    } else{
        //Check if some player data already exists in sessionstorage.
        prePlayerData = sessionStorage.getItem(`pre-p-${playerID}`);
        
        if (prePlayerData){
            prePlayerData = JSON.parse(prePlayerData);
            preRenderPlayer(prePlayerData);
        }

        playerData = await fetchNHLPlayer(baseURL, playerID);
        console.log("Fetch player succesful now render: ", playerData);
    }
     
    renderPlayerHeader(playerData);
    renderPlayerInfo(playerData);
    renderPlayerStats(playerData);

    if (!playerData) {
    console.log("no data");
    return;
    }

    
} catch (error) {
    console.error("Error: ", error);
}
}


function preRenderPlayer(playerData){
    console.log("prerenderPlayer:", playerData);
    let playerName = `${playerData.firstName.default} ${playerData.lastName.default}`;
    playerHeaderInfoEl.innerHTML = `
    <h1 class="player__heading"><span>#${playerData.sweaterNumber}</span> <span>${playerName}</span></h1>
    `;

    playerProfileInfoEl.innerHTML = `
        <img src="${playerData.headshot}" class="player__banner--img"  alt="Profilbild av ${playerName}">
        <div>
            <p class="smallest">Längd: ${playerData.heightInCentimeters} cm</p>
            <p class="smallest">Vikt: ${playerData.weightInKilograms} kg</p>
            <p class="smallest">Född: ${playerData.birthDate}</p>
            <p class="smallest">Land: ${playerData.birthCountry}</p>
            <p class="smallest">Födelseort: ${playerData.birthCity.default}</p>
            <p class="smallest">Fattning: ${playerData.shootsCatches}</p>
        </div>
    `;
}


async function renderPlayerHeader(playerData){

    let playerName = `${playerData.firstName.default} ${playerData.lastName.default}`;
    playerHeaderInfoEl.innerHTML = `
        <img src="${playerData.teamLogo}" class="team__logo--medium" alt="">
        <h1 class="player__heading"><span>${playerData.position}  |  #${playerData.sweaterNumber}</span> <span>${playerName}</span></h1>
    `;
    playerplayerActionImgEl.innerHTML = `
        <img src="${playerData.heroImage}"  alt="Actionbild av ${playerData.fullTeamName.default} spelaren ${playerName}" class="player__action--image">
    `;

    const currentPlayerID = playerData.playerId; //Get current players ID
    const rosterData = await fetchNHLRoster(baseURL, playerData.currentTeamAbbrev); //Fetch players teamroster
    
    //Loop through the object
    Object.entries(rosterData).forEach(([category, players]) => {
    
        //Loop through players
    players.forEach(player => {
            //If player id is not = current player
            if (player.id != currentPlayerID){
                playerTeamRosterEl.innerHTML += `
                    <option value="${player.id}">${player.firstName.default} ${player.lastName.default}</option>
                `;
                sessionStorage.setItem(`pre-p-${player.id}`, JSON.stringify(player));
            } else {
                playerTeamRosterEl.innerHTML += `
                    <option value="${player.id}" selected>${player.firstName.default} ${player.lastName.default}</option>
                `;
            } 
    });

});
}

function renderPlayerInfo(playerData){
    let playerName = `${playerData.firstName.default} ${playerData.lastName.default}`;
    playerProfileInfoEl.innerHTML = `
    <img src="${playerData.headshot}" class="player__banner--img"  alt="Profilbild av ${playerName}">
    <div>
        <p class="smallest">Längd: ${playerData.heightInCentimeters} cm</p>
        <p class="smallest">Vikt: ${playerData.weightInKilograms} kg</p>
        <p class="smallest">Född: ${playerData.birthDate}</p>
        <p class="smallest">Land: ${playerData.birthCountry}</p>
        <p class="smallest">Födelseort: ${playerData.birthCity.default}</p>
        <p class="smallest">Fattning: ${playerData.shootsCatches}</p>
        <p class="smallest">Draft: ${playerData.draftDetails ? `#${playerData.draftDetails.overallPick}, ${playerData.draftDetails.year} till ${playerData.draftDetails.teamAbbrev}` : "Inte draftad"}</p>
    </div>
`;
}


function renderPlayerStats(playerData){
    const seasonId = playerData.featuredStats.season.toString();
    const formattedSeasonId = `${seasonId.slice(0, 4)}-${seasonId.slice(4)}`;
    const seasonData = playerData.featuredStats.regularSeason.subSeason;
    const carrerData = playerData.featuredStats.regularSeason.career;
    console.log(seasonData);
    console.log(carrerData);
    playerStatsbarEl.innerHTML = `
        <div class="statsbar">
        <h2>${formattedSeasonId}</h2>
        <div class="statsbar__stats">
            <!-- Games Played -->
            <div class="statsbar__stats--box">
            <p class="smallest">GP</p>
            <p class="statsbar__stats--box--stat">${seasonData.gamesPlayed}</p>
            </div>

            <!-- Goals -->
            <div class="statsbar__stats--box">
            <p class="smallest">G</p>
            <p class="statsbar__stats--box--stat">${seasonData.goals}</p>
            </div>
            
            <!-- Assists -->
            <div class="statsbar__stats--box">
            <p class="smallest">A</p>
            <p class="statsbar__stats--box--stat">${seasonData.assists}</p>
            </div>

            <!-- Points -->
            <div class="statsbar__stats--box">
            <p class="smallest">P</p>
            <p class="statsbar__stats--box--stat">${seasonData.points}</p>
            </div>

            <!-- plus / minus -->
            <div class="statsbar__stats--box">
            <p class="smallest">+/-</p>
            <p class="statsbar__stats--box--stat">${seasonData.plusMinus}</p>
            </div>

        </div>
        </div>
        <!-- End of first statsbar -->
        <!-- Start of second statsbar -->
        <div class="statsbar">
        <h2>Karriär</h2>
        <div class="statsbar__stats">
            <!-- Games Played -->
            <div class="statsbar__stats--box">
            <p class="smallest">GP</p>
            <p class="statsbar__stats--box--stat">${carrerData.gamesPlayed}</p>
            </div>

            <!-- Goals -->
            <div class="statsbar__stats--box">
            <p class="smallest">G</p>
            <p class="statsbar__stats--box--stat">${carrerData.goals}</p>
            </div>
            
            <!-- Assists -->
            <div class="statsbar__stats--box">
            <p class="smallest">A</p>
            <p class="statsbar__stats--box--stat">${carrerData.assists}</p>
            </div>

            <!-- Points -->
            <div class="statsbar__stats--box">
            <p class="smallest">P</p>
            <p class="statsbar__stats--box--stat">${carrerData.points}</p>
            </div>

            <!-- plus / minus -->
            <div class="statsbar__stats--box">
            <p class="smallest">+/-</p>
            <p class="statsbar__stats--box--stat">${carrerData.plusMinus}</p>
            </div>

        </div>
        </div>
        <!-- End of first statsbar -->
    `;
}



export {renderTeamsGrid, renderNHLTeam, renderRoster, renderStatsCards, renderPlayer};
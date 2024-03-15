import {fetchNHLStatsLeaders, fetchNHLTeams, fetchNHLRoster, fetchNHLPlayer, fetchAndRenderWikiContent, preFetchTeam, fetchRandomPlayer} from './apifetch';
import { goaileTableEl, defensemenTableEl, forewardTableEl, statsLeaderGoalsEl, statsLeaderPointsEl, statsLeaderAssistsEl,statsLeaderPlusMinusEl, teamStatsbarEl, teamLogoEl, teamNameEl, baseURL, playerHeaderInfoEl, playerplayerActionImgEl, playerTeamRosterEl, playerProfileInfoEl, playerStatsbarEl, gamesTableEl, gamesTableHeadEl} from './variables';

//Eventlisteners
if (playerTeamRosterEl){
    playerTeamRosterEl.addEventListener('change', () => {
        // console.log(playerTeamRosterEl.value);
        window.location.href = `/players.html?playerid=${playerTeamRosterEl.value}`;
    })
}

// Render Teams Grid
async function renderTeamsGrid(el){
    try{
        const teamsData = await fetchNHLTeams(baseURL);
        // console.log(teamsData);
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
            // console.log(`Team ${teamAbbrev} hovered`);
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
        // console.log("TeamID:", teamID);
        const teamsData = await fetchNHLTeams(baseURL);

        //Find current team
        const currentTeam = teamsData.standings.find(data => data.teamAbbrev.default == teamID);
        const teamRank = (teamsData.standings.findIndex(data => data.teamAbbrev.default === teamID) + 1);

        // console.log(currentTeam);
        // console.log("Filtered team:", currentTeam.teamName.default);
        
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
        // console.log(formattedSeasonId);

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

        //Call function to render team roster
        renderRoster(baseURL, teamID);

    } catch (error) {
    console.error('Error:', error);
    }
}


//Render team roster

async function renderRoster(baseURL, teamID) {
    try {
        const rosterData = await fetchNHLRoster(baseURL, teamID);
        // console.log("Rosterdata:", rosterData.goalies);

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
        // console.log("no data");
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
        // console.log("Fetch randomplayer succesful now render: ", playerData);

    } else{
        //Check if some player data already exists in sessionstorage.
        prePlayerData = sessionStorage.getItem(`pre-p-${playerID}`);
        
        if (prePlayerData){
            prePlayerData = JSON.parse(prePlayerData);
            preRenderPlayer(prePlayerData);
        }

        playerData = await fetchNHLPlayer(baseURL, playerID);
        // console.log("Fetch player succesful now render: ", playerData);
    }
     
    renderPlayerHeader(playerData);
    renderPlayerInfo(playerData);
    renderPlayerStats(playerData);
    renderPlayerGameLog(playerData);

    if (!playerData) {
    console.log("no data");
    return;
    }

    
} catch (error) {
    console.error("Error: ", error);
}
}


async function renderPlayerHeader(playerData){

    let playerName = `${playerData.firstName.default} ${playerData.lastName.default}`;
    playerHeaderInfoEl.innerHTML = `
        <a href="teams?teamid=${playerData.currentTeamAbbrev}" ><img src="${playerData.teamLogo}" class="team__logo--medium" alt="Logo för ${playerData.currentTeamAbbrev}"></a>
        <h1 class="player__heading"><span>${playerData.position}  |  #${playerData.sweaterNumber}</span> <span>${playerName}</span></h1>
    `;
    playerplayerActionImgEl.innerHTML = `
        <img src="${playerData.heroImage}"  alt="Actionbild av ${playerData.fullTeamName.default} spelaren ${playerName}" class="player__action--image">
    `;

    const currentPlayerID = playerData.playerId; //Get current players ID
    const rosterData = await fetchNHLRoster(baseURL, playerData.currentTeamAbbrev); //Fetch players teamroster
    
    //Loop through the object
    Object.entries(rosterData).forEach(([position, players]) => {
    
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

//Render player info on player profile
function renderPlayerInfo(playerData){
    let playerName = `${playerData.firstName.default} ${playerData.lastName.default}`;
    playerProfileInfoEl.innerHTML = `
    <img src="${playerData.headshot}" class="player__banner--img"  alt="Profilbild av ${playerName}">
    <div>
        <p class="smallest">Längd: ${playerData.heightInCentimeters} cm</p>
        <p class="smallest">Vikt: ${playerData.weightInKilograms} kg</p>
        <p class="smallest">Född: ${playerData.birthDate}</p>
        <p class="smallest">Land: ${playerData.birthCountry}</p>
        <p class="smallest">Födelseort: ${playerData.birthCity.sv ? playerData.birthCity.sv : playerData.birthCity.default}</p>
        <p class="smallest">Fattning: ${playerData.shootsCatches}</p>
        <p class="smallest">Draft: ${playerData.draftDetails ? `#${playerData.draftDetails.overallPick}, ${playerData.draftDetails.year} till ${playerData.draftDetails.teamAbbrev}` : "Inte draftad"}</p>
    </div>
`;
}

//Render player statsbars
function renderPlayerStats(playerData){
    const seasonId = playerData.featuredStats.season.toString(); //Make seasonid a string
    const formattedSeasonId = `${seasonId.slice(0, 4)}-${seasonId.slice(4)}`; //Format the string
    const seasonData = playerData.featuredStats.regularSeason.subSeason; //Set current seasons data to variable
    const careerData = playerData.featuredStats.regularSeason.career; //Set career data to varialbe
    
    let seasonStatsData; //Declare variable to store seasondata
    let careerStatsData; //Declare variable to store careerdata


    //Create statsobject based on player postion
    if (playerData.position != 'G'){
        //Season stats
        seasonStatsData = {
            GP: seasonData.gamesPlayed,
            G: seasonData.goals,
            A: seasonData.assists,
            P: seasonData.points,
            '+/-': seasonData.plusMinus 
        };

        //Career stats
        careerStatsData = {
            GP: careerData.gamesPlayed,
            G: careerData.goals,
            A: careerData.assists,
            P: careerData.points,
            '+/-': careerData.plusMinus 
        }
        
    } else{
        //Season stats
        seasonStatsData = {
            GP: seasonData.gamesPlayed,
            W: seasonData.wins,
            SO: seasonData.shutouts,
            GAA: (seasonData.goalsAgainstAvg.toFixed(2)),
            'SV%': (seasonData.savePctg * 100).toFixed(2)
        };
        
        //Career stats
        careerStatsData = {
            GP: careerData.gamesPlayed,
            W: careerData.wins,
            SO: careerData.shutouts,
            GAA: (careerData.goalsAgainstAvg.toFixed(2)),
            'SV%': (careerData.savePctg * 100).toFixed(2)
        }
    }

    //Render the statsbar
    playerStatsbarEl.innerHTML = `
        <div class="statsbar">
            <h2>${formattedSeasonId}</h2>
            <div class="statsbar__stats">
            ${  
                //Loop through object
                Object.entries(seasonStatsData).reduce((html, [statIdentifier, statValue]) => {
                return html + `
                    <div class="statsbar__stats--box">
                        <p class="smallest">${statIdentifier}</p>
                        <p class="statsbar__stats--box--stat">${statValue}</p>
                    </div>
                `;
            }, '')}
            </div>
        </div>

        <div class="statsbar">
            <h2>Karriär</h2>
            <div class="statsbar__stats">
            ${Object.entries(careerStatsData).reduce((html, [statIdentifier, statValue]) => {
                return html + `
                    <div class="statsbar__stats--box">
                        <p class="smallest">${statIdentifier}</p>
                        <p class="statsbar__stats--box--stat">${statValue}</p>
                    </div>
                `;
            }, '')}
            </div>
        </div>
    `;
}

//Render player gamelog
function renderPlayerGameLog(playerData){
    let tableHeaders; //Declare variable to store table headers data
    
    //Create table headers based on position
    if (playerData.position != 'G'){
        //Skaters
        tableHeaders = ['Datum', 'VS', 'G', 'A', 'P', '+/-', 'PIM', 'TOI' ];
    } else{
        //Goailes
        tableHeaders = ['Datum', 'VS', 'W/L', 'SA', 'GA', 'SV%'];
    }

    //Create table headers
    // Create a new table row 
    let tableRow = document.createElement('tr');

    // Loop through table headers and create table headers
    tableHeaders.forEach(stat => {
        let tableHeaderCell = document.createElement('th');
        tableHeaderCell.textContent = stat;
        tableRow.appendChild(tableHeaderCell); // Append the table header cell to the table row
    });

    // Append the completed the finished row to table header
    gamesTableHeadEl.appendChild(tableRow);

    //Render table games / statlog
    if (playerData.position != 'G'){
        playerData.last5Games.forEach(game => {
            gamesTableEl.innerHTML += `
            <tr>
            <td>${game.gameDate}</td>
            <td>${game.opponentAbbrev}</td>
            <td>${game.goals}</td>
            <td>${game.assists}</td>
            <td>${game.points}</td>
            <td>${game.plusMinus}</td>
            <td>${game.pim}</td>
            <td>${game.toi}</td>
            </tr>
            `;
        })

    } else {
        playerData.last5Games.forEach(game => {
            // console.log(game);
            
            gamesTableEl.innerHTML += `
            <tr>
            <td>${game.gameDate}</td>
            <td>${game.opponentAbbrev}</td>
            <td>${game.decision}</td>
            <td>${game.shotsAgainst}</td>
            <td>${game.goalsAgainst}</td>
            <td>${(game.savePctg * 100).toFixed(2)} %</td>
            </tr>
            `;
        })
    }
}

//Pre render some of the playerdata before making the fetch.
function preRenderPlayer(playerData){
    // console.log("prerenderPlayer:", playerData);
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


export {renderTeamsGrid, renderNHLTeam, renderRoster, renderStatsCards, renderPlayer};
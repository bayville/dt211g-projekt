import {fetchNHLStatsLeaders, fetchNHLTeams, fetchNHLRoster, fetchNHLPlayer, fetchAndRenderWikiContent, preFetchTeam} from './apifetch';
import { randomPlayer } from './playerids';
import { goaileTableEl, defensemenTableEl, forewardTableEl, teamGridEl, statsLeaderGoalsEl, statsLeaderPointsEl, statsLeaderAssistsEl,statsLeaderPlusMinusEl, teamStatsbarEl, teamLogoEl, teamNameEl, teamsPageMainEl, playersPageMainEl, queryString, pathName, teamID, playerID, baseURL } from './variables';



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
    preFetchTeam(teamAbbrev, teamsData); // Call the first function
    }, { once: true });
});
} catch (error) {
console.error('Error:', error);
}
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


export {renderTeamsGrid, renderNHLTeam, renderRoster, renderStatsCards};
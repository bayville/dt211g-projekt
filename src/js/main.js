import './navigation';
import {fetchNHLStatsLeaders, fetchNHLTeams, fetchNHLRoster, fetchNHLPlayer, fetchAndRenderWikiContent, preFetchTeam, fetchRandomPlayer} from './apifetch';
import {renderTeamsGrid, renderNHLTeam, renderRoster, renderStatsCards} from './renderfunctions';
import {goaileTableEl, defensemenTableEl, forewardTableEl, teamGridEl, statsLeaderGoalsEl, statsLeaderPointsEl, statsLeaderAssistsEl,statsLeaderPlusMinusEl, teamStatsbarEl, teamLogoEl, teamNameEl, teamsPageMainEl, playersPageMainEl, queryString, pathName, teamID, playerID, baseURL} from './variables';





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
  

  if (!playerID && playersPageMainEl){
    console.log("Fetch Random player no id:");
    fetchRandomPlayer();
  }  else if (playerID == "rand" ) {
    console.log("Fetch Random player id: rand");
    fetchRandomPlayer();
  } else if (playerID){
    console.log("Fetch player");
    fetchNHLPlayer(baseURL, playerID);
  }



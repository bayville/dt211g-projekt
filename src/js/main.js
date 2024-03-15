import './navigation';
import {teamGridEl, statsLeaderGoalsEl, teamsPageMainEl, playersPageMainEl, pathName, teamID, playerID } from './variables';
import {renderTeamsGrid, renderNHLTeam, renderStatsCards, renderPlayer} from './renderfunctions';


if (statsLeaderGoalsEl) {
renderStatsCards();
}
  if (teamID){
    renderNHLTeam(teamID.toUpperCase());
  } else if (!teamID && teamsPageMainEl) {
    // console.log('RenderTeamsGrid Function');
    teamsPageMainEl.innerHTML = `
      <div class="section__padding--light-bg">
        <section class="container--l" aria-label="NHL-lag">
          <h2 class="line-heading--small">Lag</h2>
          <div class="grid__teams section__padding" id="teamGrid"></div>
        </section>
      </div>
    `;
    let teamGrid = document.getElementById('teamGrid');
    // console.log(teamGrid);
    renderTeamsGrid(teamGrid);
  }



  if (teamGridEl && (pathName == "/")){
      renderTeamsGrid(teamGridEl);
  }
  

  if (!playerID && playersPageMainEl){
    // console.log("Fetch Random player no id:");
    renderPlayer();
  }  else if (playerID == "rand" ) {
    // console.log("Fetch Random player id: rand");
    renderPlayer();
  } else if (playerID){
    // console.log("Fetch player player id:", playerID);
    renderPlayer(playerID);
  }



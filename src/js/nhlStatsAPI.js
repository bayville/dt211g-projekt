// nhlStatsAPI.js
const baseURL = "https://fetch-playground.netlify.app"; // Base URL for API requests used for local production


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


async function fetchNHLStatsLeaders() {
  try {
    let statsLeaderData = sessionStorage.getItem('statsLeaders');
    if (statsLeaderData) {
      statsLeaderData = JSON.parse(statsLeaderData);
      console.log("Fetched statsleaders from session storage:");
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

export { fetchNHLStatsLeaders, fetchNHLTeams };

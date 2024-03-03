// nhlStatsAPI.js
const baseURL = "https://fetch-playground.netlify.app"; // Base URL for API requests used for local production
const wikiDataEl = document.getElementById('wikiData')


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

    
    if (wikiDataEl) {
      wikiDataEl.innerHTML += `${pageContent}`;
    }
    
    return pageContent;
  } catch (error) {
    console.error('Error:', error);
  }
}


export {fetchNHLStatsLeaders, fetchNHLTeams, fetchNHLRoster, fetchAndRenderWikiContent};

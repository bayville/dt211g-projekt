## Projektbeskrivning
Syftet med arbetet har varit att använda en modern och automatiserad utvecklingsmiljö för frontendutveckling för att skapa en webbplats som hämtar information med hjälp av minst två olika API:er i en så kallad mashup. API:er från NHL samt Wikipedia har använts för att genomföra projektet.

Webbplatsen kan användas för att visa statistik aktuell och information om NHL-lag och spelare.
Hela projektet är skapat av mig från grunden inklusive, grafisk profil, loggor, layouter och all kod.

[Livedemo](https://frek1802-dt211g-projekt.netlify.app)

## Screenshots
![NHL Project Screenshot](https://github.com/bayville/dt211g-projekt/blob/main/nhl1.png)
![NHL Project Screenshot](https://github.com/bayville/dt211g-projekt/blob/main/nhl2.png)


## API:er som använts
* Dokumentation för NHL-api: https://github.com/Zmalski/NHL-API-Reference
* Dokumenation för Wikipedia-api: https://www.mediawiki.org/wiki/API:Main_page

## Installation

Klona och installera GitHub-repot med följande kommandon:

```bash
git clone https://github.com/bayville/dt211g-projekt.git

npm install

npm run dev
```


För att göra anrop lokalt, ta bort kommentaren på rad 32 i filen js/variables.js och kommentera ut rad 33. Det kommer att sätta baseURL till https://frek1802-dt211g-projekt.netlify.app.


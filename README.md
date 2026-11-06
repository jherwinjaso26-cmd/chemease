# ChemEase
Chemistry study app: periodic table, molar mass calculator, equation balancer, games, notes, and a global leaderboard.

## Run locally (VS Code terminal)
    npm install
    npm start
Open http://localhost:3000

## Deploy on Render
New > **Web Service** > connect this GitHub repo. Build command: `npm install`. Start command: `npm start`.
Note: on Render's free plan the service sleeps when idle and `data.json` resets on redeploy. For permanent scores, switch the storage to Render Postgres.

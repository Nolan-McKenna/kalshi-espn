# Kalshi x ESPN: Value Betting Dashboard
Identifies betting "edges" by comparing ESPN's Live Win Probability models against Kalshi's Prediction Markets.

Currently supports NBA and NCAA MBB T25 games.

The project is deployed with Vercel at [this link](https://kalshi-espn.vercel.app/)

### Project Structure
index.html: Slop-coded dashboard + JS logic.

vercel.json: Configuration for API rewrites.

### How it Works
Data Fetching: The app pulls the daily scoreboard/win probabilities from ESPN's hidden API.

Probability Modeling: Extracts the winProbability (Live) or predictor (Pregame) data.

Market Comparison: Queries Kalshi for the corresponding "Yes" contract price (e.g., if a team is 60¢ to win, the market implies a 60% chance).

### Edge Calculation: 

Edge = Model% − Market%

If Edge ≥ 7%, a "BUY" signal is triggered.

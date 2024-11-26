import axios from "axios";
import cors from "cors";
import express, { Router } from "express";
import { configDotenv } from "dotenv";
import serverless from "serverless-http";

configDotenv();
const app = express();
const router = Router();
// const PORT = process.env.PORT || 3000;

app.use(cors());

const accessParams = {
  headers: {
    "X-Auth-Token": process.env.API_KEY
  }
}

router.get('/', (req, res) => {
  res.status(200).send("Welcome to my express server")
});

router.get("/:leagueCode/matches", async (req, res) => {
  const { query: { dateFrom, dateTo } } = req;
  const { params: { leagueCode } } = req; 
  
  try {
    const response = await axios.get(`https://api.football-data.org/v4/competitions/${leagueCode}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`, accessParams);
    res.json(response.data);  // Send the data from the external API to the frontend
  } catch (error) {
    if(error.status === 429){
      res.status(429).json({ timeoutErr: 'Too many requests, now on 1 minute timeout'});
    } else {
      res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
  }
});

router.get("/:leagueCode/standings", async (req, res) => {
  console.log(req.params.leagueCode);
  try {
    const response = await axios.get(`https://api.football-data.org/v4/competitions/${req.params.leagueCode}/standings`, accessParams);
    res.json(response.data);  // Send the data from the external API to the frontend
  } catch (error) {
    if(error.status === 429){
      res.status(429).json({ timeoutErr: 'Too many requests, now on 1 minute timeout'});
    } else {
      res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
  }
});


router.get("/:leagueCode/scorers", async (req, res) => {

  try {
    const response = await axios.get(`https://api.football-data.org/v4/competitions/${req.params.leagueCode}/scorers?limit=20`, accessParams);
    res.json(response.data);  // Send the data from the external API to the frontend
  } catch (error) {
    if(error.status === 429){
      res.status(429).json({ timeoutErr: 'Too many requests, now on 1 minute timeout'});
    } else {
      res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
  }
});

router.get("/:matchId/head2head", async (req, res) => {
  console.log(req.params.matchId)
  const parsedMatchID = parseInt(req.params.matchId);

  if(isNaN(parsedMatchID)){
    return res.status(400).send({msg: "Bad Request, matchID is not a number"})
  }

  try {
    const response = await axios.get(`https://api.football-data.org/v4/matches/${parsedMatchID}/head2head`, accessParams);
    res.json(response.data);  // Send the data from the external API to the frontend
  } catch (error) {
    if(error.status === 429){
      res.status(429).json({ timeoutErr: 'Too many requests, now on 1 minute timeout'});
    } else {
      res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
  }
});

app.use("/api/", router)

// app.listen(PORT, () => {
//   console.log("App is running on http://localhost:3000")
// })

export const handler = serverless(app);


import  express from "express";
import cors from "cors"
import games from "./api/games.route.js"    // will be where we get the games from

const app = express()   // makes server

// things that express will use
app.use(cors())    // uses the cors module
app.use(express.json()) // allows server to accept json in the body of the request

app.use("/api/v1/games", games)    // will be the url people go to 
app.use("*", (req, res) => res.status(404).json('not found'))  // if somone enters anything other than the url return this error page

export default app
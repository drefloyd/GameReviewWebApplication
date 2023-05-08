import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
dotenv.config()
const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000 // if cannot access, will default to 8000

MongoClient.connect(
    process.env.GAMEREVIEWS_DB_URI,
    {
        maxPoolSize: 50,    // max amount of users at a time
        wtimeoutMS: 2500,
        useNewUrlParser: true,
      }
    )
    .catch(err => { // if an error is caught display error and exit
        console.error(err.stack)
        process.exit(1)
    })  
    .then(async client => { // if no error caught then will display on console "listening to port"
        app.listen(port, () => {
            console.log(`listening on port` +port)
        })
    })
import app from './server.js'
import mongodb from 'mongodb'
import dotenv from 'dotenv'


//=============================================================================
// Configuring dotenv and creating an instance of the mongodb client 
dotenv.config();
const MongoClient = mongodb.MongoClient


//=============================================================================
// Set the port number for the server to the port number held within the .env file 
//  which can be acces by using process.env.{Whatever environment variable name} OR sets
//  the port to 8000 in the case that we can't access the .env file or something has gone wrong
const port = process.env.port || 8000
console.log('The value of PORT is:', process.env.port);

//=============================================================================
// Connecting to MongoDB using the URI string held within the .env file
// Allows up to 50 people to connect at any given time, times out after 2500ms
// useNewUrlParse parses connection string for MongoDB
// Closes the process if an error occurs
MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,{
        maxPoolSize:50
    }
)
.catch(err => {
    console.error(err.stack)
    process.exit(1)
})
.then(async client => {
    // Use app.listen to start the web server 
    app.listen(port, ()=>{
        // Log to ensure the connection is working
        console.log(`Listening on port ${port}`)
    })
})


import express from 'express'
import cors from 'cors'
import restaurants from './api/restaurants.route.js'

/* 
    Created by Loc T. Lien 
    03/03/2022 
    server/server.js 

    Setup file used to initialise the backend support for the webapp. 

*/

//=============================================================================
// Creating the application using express
const app = express()



//=============================================================================
// Applying middleware

// Defining what packages are being used by the application
app.use(cors())
// Allows for the server to accept json in the body of particular requests
app.use(express.json())



//=============================================================================
// Specifying initial routes 

// Default routing 
app.use("/api/v1/restaurants", restaurants)
// If another unrecognised route is used, returns error message
// Using arrow notation for functions
app.use("*", (req, res) => res.status(404).json({error : "Not found"}))


//=============================================================================
// Exporting app as a module 
export default app
 





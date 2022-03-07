import express from "express"

//=============================================================================
// Access the expresss router
const router = express.Router()


//=============================================================================
// List of routes that can be accessed

// If the root URL is active, will respond with Hello World
router.route("/").get((req,res) => res.send("Hello World!"))

export default router 
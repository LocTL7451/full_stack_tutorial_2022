//=============================================================================
// DATA ACCESS OBJECT
// Acts as a bridge between the database and the program

// Creating variable to store reference to database
let restaurants

//=============================================================================
// Exporting class for DAO
export default class RestaurantsDAO{

//=============================================================================
// Calls this method when the server starts to create a connection to the restaurant database
    static async injectDB(conn){
        // Do nothing if the reference variable is already filled
        if(restaurants){
            return

        }
        // Trying to fill the variable with reference to the restaurant collection on MongoDB
        try{
            restaurants = await conn.db(processs.env.RESTREVIEWS_NS).collection("restaurants")
        // Throws an error if the database cannot be accessed for any reason
        } catch(e){
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}`,
            )
        }
    }
//=============================================================================
// Accessor method to grab a list of restaurants from the database, passing in 
//  any particular filters, page numbers and 
//  restaurants per page for viewing
    static async getRestaurants({        
        filters = null, 
        // Defining default parameters for the function
        page = 0,
        restaurantsPerPage = 20,
    } = {}) {
        let query
        // Utilising MongoDB queries for filtering
        if(filters){
            // Allows users to search for a name of a restaurant
            // Text search works differently from the other 2 fields, 
            if("name" in filters){
                query = {$text: {$search: filters["name"] } }
            }
            // Allows users to search for a particular cuisine 
            // Checks if the cuisine from the entry of the database EQUALS ($eq) the cuisine passed in 
            else if("cuisine" in filters){
                query = {"cuisine": {$eq: filters["cuisine"] } }
            }
            // Allows users to search for restaurants in a particular zip code
            // Checks if the zipcode from the entry of the database EQUALS ($eq) the zipcode passed in 
            else if("zipcode" in filters){
                query = {"address.zipcode": {$eq: filters["zipcode"] } }
            }
        }

        let cursor

//=============================================================================
// Utilising the query from the previous section to form a return from the database
// Using await as this is an async function
        try{
            cursor = await restaurants
            .find(query)
            // If there's an error
        } catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return{restaurantsList: [], totalNumRestaurants: 0 }
        }

        // Limits the number of results to the restaurantsPerPaage
        // Gets to a specific page of results
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        // Attempts to map the cursor to an array
        // Returns restaurant list and number of restaurants if successful
        try{
            const restuarantsList = await displayCursor.toArray()
            // Finds the total number of restaurants by counting the number of documents returned by the server call 
            const totalNumRestaurants = await restaurants.countDocuments(query)
            return{restaurantsList, totalNumRestaurants}
        // If error arises, return empty rest list and 0 as count
        } catch(e){
            console.error(`Unable to convert cursor to array or problem counting documents, ${e}`)
            return {restaurantsList: [], totalNumRestaurants: 0 }
        }
    }
}
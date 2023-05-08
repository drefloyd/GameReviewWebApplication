let games

export default class GamesDAO{
    static async injectDB(conn){
        if(games){
            return
        }
        try{
            games = await conn.db(process.env.GAMESREVIEWS_NS).collection("games")
        } catch(e) {
            console.error(
                `unable to establish a collection handle in gamesDAO:` +e,  // if cant access the games collection, display this
            )
        }
    }

    static async getGames({     // will be called when we want a list of all the games in the db
        filters = null,
        page = 0,
        gamesPerPage = 5,
    } = {}) {
        let query 
        if(filters){
            if("game_name" in filters){
                query = { $text: { $search: filters["game_name"]}}
            }else if("price" in filters){
                query = { $text: { $search: filters["price"]}}
            }else if("console" in filters){
                query = { $text: { $search: filters["console"]}}
            }
        }
    
        let cursor

        try{
            cursor = await games
                .find(query)
        } catch(e) {
            console.error(`Unable to issue find command` +e)
            return { gamesList: [], totalNumGames: 0}
        }

        const displayCursor = cursor.limit(gamesPerPage).skip(gamesPerPage * page)

        try{
            const gamesList = await displayCursor.toArray()
            const totalNumGames = await games.countDocuments(query) // total number of games are number of rows in the query (rows = documents)

            return {gamesList, totalNumGames}
        }catch(e){
            console.error(
                `Unable to convert cursor to array or problem counting documents,` +e)
            return {gamesList: [], totalNumGames: 0}
            }
        }
}
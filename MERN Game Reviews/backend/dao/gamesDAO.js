import mongodb from "mongodb"
const ObjectId = mongodb.ObjectID
let games

export default class GamesDAO {
  static async injectDB(conn) {
    if (games) {
      return
    }
    try {
      games = await conn.db(process.env.GAMEREVIEWS_NS).collection("games")
    } catch (e) {
      console.error(
        `Unable to establish a collection handle in gamesDAO: ${e}`,
      )
    }
  }

  static async getGames({
    filters = null,
    page = 0,
    gamesPerPage = 10,
  } = {}) {
    let query
    if (filters) {
      if ("game_name" in filters) {
        query = { $text: { $search: filters["game_name"] } }
      } else if ("price" in filters) {
        query = { "price": { $eq: filters["price"] } }
      } else if ("Console" in filters) {
        query = { "Console": { $eq: filters["Console"] } }
      }
    }

    let cursor
    
    try {
      cursor = await games
        .find(query)
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`)
      return { gamesList: [], totalNumGames: 0 }
    }

    const displayCursor = cursor.limit(gamesPerPage).skip(gamesPerPage * page)

    try {
      const gamesList = await displayCursor.toArray()
      const totalNumGames = await games.countDocuments(query)

      return { gamesList, totalNumGames }
    } catch (e) {
      console.error(
        `Unable to convert cursor to array or problem counting documents, ${e}`,
      )
      return { gamesList: [], totalNumGames: 0 }
    }
  }
  static async getGameByID(id) {
    try {
      const pipeline = [
        {
            $match: {
                _id: new ObjectId(id),
            },
        },
              {
                  $lookup: {
                      from: "reviews",
                      let: {
                          id: "$_id",
                      },
                      pipeline: [
                          {
                              $match: {
                                  $expr: {
                                      $eq: ["$game_id", "$$id"],
                                  },
                              },
                          },
                          {
                              $sort: {
                                  date: -1,
                              },
                          },
                      ],
                      as: "reviews",
                  },
              },
              {
                  $addFields: {
                      reviews: "$reviews",
                  },
              },
          ]
      return await games.aggregate(pipeline).next()
    } catch (e) {
      console.error(`Something went wrong in getGameByID: ${e}`)
      throw e
    }
  }

  static async getPrices() {
    let prices = []
    try {
      prices = await games.distinct("price")
      return prices
    } catch (e) {
      console.error(`Unable to get prices, ${e}`)
      return prices
    }
  }
}



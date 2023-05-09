import GamesDAO from "../dao/gamesDAO.js"

export default class GamesController {
  static async apiGetGames(req, res, next) {
    const gamesPerPage = req.query.gamesPerPage ? parseInt(req.query.gamesPerPage, 5) : 10
    const page = req.query.page ? parseInt(req.query.page, 5) : 0

    let filters = {}
    if (req.query.price) {
      filters.price = req.query.price
    } else if (req.query.Console) {
      filters.Console = req.query.Console
    } else if (req.query.game_name) {
      filters.game_name = req.query.game_name
    }

    const { gamesList, totalNumGames } = await GamesDAO.getGames({
      filters,
      page,
      gamesPerPage,
    })

    let response = {
        games: gamesList,
      page: page,
      filters: filters,
      entries_per_page: gamesPerPage,
      total_results: totalNumGames,
    }
    res.json(response)
  }
   static async apiGetGamesById(req, res, next) {
     try {
       let id = req.params.id || {}
       let game = await GamesDAO.getGameByID(id)
       if (!game) {
         res.status(404).json({ error: "Not found" })
         return
       }
       res.json(game)
     } catch (e) {
       console.log(`api, ${e}`)
       res.status(500).json({ error: e })
     }
   }

   static async apiGetGamesPrice(req, res, next) {
     try {
       let price = await GamesDAO.getPrice()
       res.json(price)
     } catch (e) {
       console.log(`api, ${e}`)
       res.status(500).json({ error: e })
     }
   }
}
import express from "express";
import GamesCtrl from "./games.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router() // creates the different routes people can go to

router.route("/").get(GamesCtrl.apiGetGames)    // url to get games
router.route("/id/:id").get(GamesCtrl.apiGetGamesById)    
router.route("/consoles").get(GamesCtrl.apiGetGamesPrice)    

router
    .route("/review")
    .post(ReviewsCtrl.apiPostReview)
    .put(ReviewsCtrl.apiUpdateReview)
    .delete(ReviewsCtrl.apiDeleteReview)

export default router
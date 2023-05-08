import express from "express";

const router = express.Router() // creates the different routes people can go to

router.route("/").get((req, res) => res.send("hello world"))    // if we go to the url: "/" then it will display hello world

export default router
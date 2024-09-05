const express = require('express')
const Joi = require('@hapi/joi')
const Elo = require('arpad');
const { insertItem, getItems, getPlayer1, updateScore1, getCarsForGame, getUser, insertUser } = require('./db')

const router = express.Router()

const itemSchema = Joi.object().keys({
  name: Joi.string(),
  link: Joi.string(),
  score: Joi.number().integer().min(0)
})

const userSchema = Joi.object().keys({
  login: Joi.string(),
  games: Joi.number().integer().min(0).max(10)
})

router.post('/user', (req, res) => {
  const item = req.body
  console.log(req.body)
  const result = userSchema.validate(item)
  if (result.error) {
    console.log(result.error)
    res.status(400).end()
    return
  }
  getUser(item.login)
  .then((dbItem) => {
    if (dbItem) {
      res.statusMessage = "Conflict";
      res.status(409).send('Uzytkownik juz istnieje').end()
    }
    insertUser(item);
    res.status(200).end();
  })
})

router.post('/car', (req, res) => {
  const item = req.body
  console.log(req.body)
  const result = itemSchema.validate(item)
  if (result.error) {
    console.log(result.error)
    res.status(400).end()
    return
  }
  insertItem(item)
    .then(() => {
      res.status(200).end()
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

router.get('/cars', (req, res) => {
  getItems()
    .then((items) => {
      items = items.map((item) => ({
        id: item._id,
        name: item.name,
        licencePlate: item.licencePlate,
        link: item.link,
        score: item.score
      }))
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

router.get('/carsForGame', (req, res) => {
  getCarsForGame()
    .then((items) => {
      items = items.map((item) => ({
        id: item._id,
        name: item.name,
        licencePlate: item.licencePlate,
        link: item.link,
        score: item.score
      }))
      res.json(items)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).end()
    })
})

router.post('/game', (req, res) => {
  const body = req.body
  let player1 = getPlayer1(body.player1);
  let player2 = getPlayer1(body.player2);
  
  Promise.all([player1, player2]).then((values) => {

    const elo = new Elo();

    let player1 = values[0].score;
    let player2 = values[1].score;
    let new_player1;
    let new_player2;
    if(body.wins == 0) {
      new_player1 = elo.newRatingIfWon(player1, player2);
      new_player2 = elo.newRatingIfLost(player2, player1);
    } 
    else {
      new_player1 = elo.newRatingIfLost(player1, player2);
      new_player2 = elo.newRatingIfWon(player2, player1);
    }
    
    console.log(values[body.wins].name, "wins");
    console.log(values[0].name, "new rating:", new_player1);
    console.log(values[1].name, "new rating:", new_player2);

    let sc1 = updateScore1(values[0]._id, new_player1);
    let sc2 = updateScore1(values[1]._id, new_player2);
    Promise.all([sc1, sc2]).then((v) => {
      console.log("Game ended");
    });
    
  });
  res.status(200).end()
})

module.exports = router

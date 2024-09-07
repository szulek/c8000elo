const { MongoClient, ObjectId, ServerApiVersion  } = require('mongodb')

const uri = "mongodb+srv://szulkowsky:kRm2yZaF2V9LFMpq@c8000.fj31d.mongodb.net/?retryWrites=true&w=majority&appName=c8000";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connectionUrl = 'mongodb://localhost:27017'
const dbName = 'club8000'

let db

const init = () => 
  client.connect().then((client) => {
    db = client.db(dbName)
  })
  // MongoClient.connect(connectionUrl, { useNewUrlParser: true }).then((client) => {
  //   db = client.db(dbName)
  // })

const insertItem = (item) => {
  const collection = db.collection('cars')
  return collection.insertOne(item)
}

const getItems = () => {
  const collection = db.collection('cars')
  return collection.find({}).sort( { score: -1 }).toArray()
}

async function getPlayer1(id) {
  const collection = db.collection('cars')
  const result = await collection.findOne({_id: ObjectId(id)});
  return result;
}

async function updateScore1(id, value) {
  const collection = db.collection('cars')
  const result = await collection.updateOne({ _id: ObjectId(id) }, { $set: { score: value } });
  return result;
}

async function getCarsForGame() {
  const collection = db.collection('cars')
  const result = await collection.aggregate([{$sample:{size:2}}]).toArray();
  return result;
}

async function getUser(value) {
  const collection = db.collection('users')
  const result = await collection.findOne({'login': value});
  return result;
}

const insertUser = (item) => {
  const collection = db.collection('users')
  return collection.insertOne(item)
}

module.exports = { init, insertItem, getItems, getPlayer1, updateScore1, getCarsForGame, getUser, insertUser }

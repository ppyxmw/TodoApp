// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");
const MONGO_URL = 'mongodb://ppyxmw:PADrydVoipsich4@ds217560.mlab.com:17560/781911583413';

MongoClient.connect(MONGO_URL, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }   
  console.log('Connected to MongoDB server.');
  const db = client.db('781911583413');
  
  db.collection('Todos').find().toArray().then((docs) => {
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch docs', err)
  });
  
  db.collection('Todos').find().count().then((count) => {
    console.log(`Count Todos: ${count}`);
  }, (err) => {
    console.log('Unable to fetch docs', err)
  });
  // client.close();
});
// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");
const MONGO_URL = 'mongodb://ppyxmw:PADrydVoipsich4@ds217560.mlab.com:17560/781911583413';

MongoClient.connect(MONGO_URL, (err, client) => {
  
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }   
  console.log('Connected to MongoDB server.');
  const db = client.db('781911583413');
  
  db.collection('Todos').insertOne({
    text: 'Something to do.',
    completed: false
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });
  
  db.collection('Users').insertOne({
    name: 'Michael',
    age: 34,
    location: 'Cambridge'
  }, (err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }
    console.log(JSON.stringify(result.ops, undefined, 2));
  });
  client.close();
});
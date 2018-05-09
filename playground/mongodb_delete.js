// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");
const MONGO_URL = 'mongodb://ppyxmw:PADrydVoipsich4@ds217560.mlab.com:17560/781911583413';

MongoClient.connect(MONGO_URL, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }   
  console.log('Connected to MongoDB server.');
  const db = client.db('781911583413');

// deleteMany
//   db.collection('Todos').deleteMany({text: 'Eat lunch.'}).then((result) => {
//     console.log(result);
//   }, (err) => {
//     console.log('Could not delete', err)
//   });

// deleteOne -- deletes first time that matche critrea then stops
//   db.collection('Todos').deleteOne({text: 'Eat lunch.'}).then((result) => {
//     console.log(result);
//   }, (err) => {
//     console.log('Could not delete', err)
//   });


//findOneAndDelete -- deletes first, also returns what was deleted so user can know
  db.collection('Todos').findOneAndDelete({text: 'Eat lunch.'}).then((result) => {
    console.log(result);
  }, (err) => {
    console.log('Could not delete', err)
  });

   client.close();
});
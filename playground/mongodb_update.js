// const MongoClient = require("mongodb").MongoClient;
const {MongoClient, ObjectID} = require("mongodb");
const MONGO_URL = 'mongodb://ppyxmw:PADrydVoipsich4@ds217560.mlab.com:17560/781911583413';

MongoClient.connect(MONGO_URL, (err, client) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server.');
  }   
  console.log('Connected to MongoDB server.');
  const db = client.db('781911583413');

//findOneAndUpdate 
  db.collection('Todos').findOneAndUpdate({
      _id: new ObjectID('5af21008861d741a118da12a')
  }, {
    $set: {
      completed: false
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  }, (err) => {
    console.log('Could not delete', err);
  });

   client.close();
});
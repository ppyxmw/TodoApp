var mongoose = require('mongoose');

const MONGO_URL = 'mongodb://ppyxmw:PADrydVoipsich4@ds217560.mlab.com:17560/781911583413';

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || MONGO_URL);

module.exports = {
 mongoose   
};
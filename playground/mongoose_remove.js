const {ObjectID} = require("mongodb");

const {mongoose} = require("./../server/db/mongoose");
const {Todo} = require("./../server/models/todo");
const {User} = require("./../server/models/user");

var id = '5af8ed510ab1a21c0c2971e2';

if (!ObjectID.isValid(id)) {
  console.log('ID is not valid.');
}

Todo.remover({}).then((result) => {
  console.log(result);
});

Todo.findOneAndRemove({}).then((todo) => {
  
});

Todo.findByIdAndRemove('').then((todo) => {
  
});
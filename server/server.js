var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require("mongodb");


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.json());
 
app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  
  todo.save().then((doc) => {
    res.send(doc);
    console.log('testing', doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (e) => {
    res.status(400).send(e);  
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;
  
  if (!ObjectID.isValid(id)) {
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    return res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started on port ${port}.`);
});

module.exports = {app};





// firstTodo.save().then((doc) => {
//   console.log('Saved todo:', JSON.stringify(doc, undefined, 2));
// }, (e) => {
//   console.log('Unable to save todo.', JSON.stringify(e, undefined, 2));
// });



// firstUser.save().then((doc) => {
//   console.log('Saved user:', doc);
// }, (e) => {
//   console.log('Unable to save user.', JSON.stringify(e, undefined, 2));
// });

// var firstTodo = new Todo({
//   text: 'Clean the bloody kitchen mate'
// });


// var firstUser = new User({
//   email: 'ppyxmw@gmail.com'
// });
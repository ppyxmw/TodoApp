const expect = require("expect");
const request = require("supertest");
const {ObjectID} = require("mongodb");

const {app} = require("./../server");
const {Todo} = require("./../models/todo");
const {User} = require("./../models/user");

const {todos, populateTodos, users, populateUsers} = require("./seed/seed");

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = "string for test";
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
      }).catch((e) => done(e));
    });
  });
  
  it('it should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err) {
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });
  
  it('should not return a todo doc created by other user', (done) =>{
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  
  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  
  it('should return a 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
    })
    .end((err, res) => {
      if(err) {
        return done (err);
      }
      
      Todo.findById(hexId).then((todo) => {
        expect(todo).toNotExist;
        done();
      }).catch((e) => done(e));
    });
  });
  
  it('should not remove a todo by other user', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
      if(err) {
        return done (err);
      }
      
      Todo.findById(hexId).then((todo) => {
        expect(todo).toExist;
        done();
      }).catch((e) => done(e));
    });
  });
  
  it('should return a 404 if todo not found', (done) => {
    var hexId = new ObjectID().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
  
  it('should return a 404 for invalid object ids', (done) => {
    request(app)
      .delete('/todos/123')
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe('PATCH /todos/:id', () => {
  it('should update a todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = "new pretty text";
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: text, completed: true})
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe("new pretty text");
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeANumber;
    })
    .end((err, res) => {
      if(err) {
        return done (err);
      }
      
      Todo.findById(hexId).then((todo) => {
        expect(todo.text).toBe("new pretty text");
        done();
      }).catch((e) => done(e));
    });
  });
  
  it('should not update a todo created by other user', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = "new pretty text";
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: text, completed: true})
      .set('x-auth', users[1].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err) {
          return done (err);
      }
      
      Todo.findById(hexId).then((todo) => {
        expect(todo.text).toBe("First test todo item");
        done();
      }).catch((e) => done(e));
    });
  });
  
  
  it('should clear completedAt when todo is completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = "second new pretty text";
    request(app)
      .patch(`/todos/${hexId}`)
      .send({text: text , completed: false})
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe("second new pretty text");
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist;
    })
    .end((err, res) => {
      if(err) {
        return done (err);
      }
      
      Todo.findById(hexId).then((todo) => {
        expect(todo.text).toBe("second new pretty text");
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
    });
  
  it('it should return a 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
    .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'email@email.com';
    var password = '123qwerk';
    
    request(app)
    .post('/users')
    .send({email, password})
    .expect(200)
    .expect((res) => {
      expect(res.body.email).toBe(email);
      expect(res.headers['x-auth']).toBeTruthy();
      expect(res.body._id).toBeTruthy();
    })
    .end((err) => {
      if(err) {
        return done(err);
      }
      
      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
        done();
      }).catch((e) => done(e));

    });
  });
  
  it('should return validation errors if request invalid', (done) => {
    request(app)
    .post('/users')
    .send({
      email: 'yo', 
      password: '1'
    })
    .expect(400);
    done();
  });
  
  it('should not create a user if email in use', (done) => {
    
    request(app)
    .post('/users')
     .send({
      email: users[0].email, 
      password: 'Password123'
     })
    .expect(400);
    done();
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email, 
      password: users[1].password
     })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      } 
      User.findById(users[1]._id).then((user) => {
        expect(user.toObject().tokens[1]).toMatchObject({
          access: 'auth',
          token: res.header['x-auth']
        });
        done();
      }).catch((e) => done(e));
    });
  });
  
  it('should reject invalid login', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email, 
      password: users[1].password + '1'
     })
    .expect(400)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy;
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      } 
      User.findById(users[1]._id).then((user) => {
        expect(user.tokens.length).toBe(1);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
    .delete('/users/me/token')
    .set('x-auth', users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy;
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      } 
      User.findById(users[0]._id).then((user) => {
        expect(user.tokens.length).toBe(0);
        done();
      }).catch((e) => done(e));
    });    
  });
});

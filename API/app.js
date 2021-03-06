var HTTPError = require('node-http-error')
var bodyParser = require('body-parser')
var express = require('express')
var app = express()
const port = process.env.PORT || 3000  // Use process.env to access the contents of the user environment
const dal = require('../DAL/no-sql.js')

app.use(bodyParser.json())

// ------  GENERAL  -------  //
app.get('/', function (req, res) {
  res.send('Hello World!')
})

//  -----  AutoMobiles CRUDL  -----  //
//Add an item
app.post('/automobiles', function(req, res, next) {       // (x)
  dal.createMobile(req.body, function(err, body) {
    if (err) {
      var newErr = new HTTPError(500, 'Bad Sumtin', {
        m: 'Something went wrong'
      })
      return next(newErr)
    }
    if (body) {
      res.append('content-type', 'application/json')
      res.status(500).send(JSON.stringify(body, null, 2))
    }
  })
})

//Retrieve an item
app.get('/automobiles/:id', function(req, res, next) {    // (x)
    const mobileID = req.params.id;

    dal.getMobile(mobileID, function(err, data) {
        if(err) {
          var newErr = new HTTPError(500, 'Bad Sumtin', {
            m: 'Something went wrong'
          })
          return next(newErr)
        }
        if(data) {
            res.append('Content-type', 'application/json')
            res.send(data);
        }
    })
})

//List a collection of items
app.get('/automobiles', function(req, res, next) {        // (x)
  const sortBy = req.query.sortby || 'automobiles';
  const sortToken = req.query.sorttoken || '';
  const limit = req.query.limit || 5;
  console.log(sortBy)

  dal.listMobiles(sortBy, sortToken, limit, function(err, body){
    if (err) {
      var newErr = new HTTPError(500, 'Bad Sumtin', {
        m: 'Something went wrong'
      })
      return next(newErr)
    }
    if (body) {
      res.append('content-type', 'application/json')
      res.status(500).send(JSON.stringify(body.rows, null, 2))
    }
  })
})

//Update an item
app.put('/automobiles/:id', function(req, res, next) {    // (x)
  dal.getMobile(req.params.id, function(err, data){
    if (err) {
      var newErr = new HTTPError(500, 'Bad Request ID', {
        m: 'Get mobile did not work'
      })
      return next(newErr)
    }
    req.body["_id"] = data["_id"]
    req.body["_rev"] = data["_rev"]
    dal.updateMobile(req.body, function(err, body) {
      if (err) {
        var newErr = new HTTPError(500, 'Bad Request ID', {
          m: 'Update Person did not work'
        })
        return next(newErr)
      }
      if (body) {
        res.append('content-type', 'application/json')
        res.status(500).send(JSON.stringify(body, null, 2))
      }
    })
  })
})

//Delete an item
app.delete('/automobiles/:id', function(req, res, next) { // (x)
  dal.getMobile(req.params.id, function(err, data) {
    if (err) return next(err)
    if (data) {
      dal.deleteMobile(data, function(deletedErr, deletedBody) {
        if (deletedErr) {
          var newErr = new HTTPError(500, 'Bad Request ID', {
            m: 'Delete Mobile did not work'
          })
          return next(newErr)
        }
        if (deletedBody) {
          res.append('content-type', 'application/json')
          res.status(500).send(JSON.stringify(deletedBody, null, 2))
        }
      })
    }
  })
})

//Get items by make
app.get('/make/:name', function(req, res, next) {         // (x)
  const make = req.params.name
  dal.getByMake(make, function(err, body) {
    if (err) return next(console.log("Get By Make Error"))
    res.status(500).send(body)
  })
})

//  ----------------------------  //
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(err)
})

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})

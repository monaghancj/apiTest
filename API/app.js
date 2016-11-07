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
app.post('/automobiles', function(req, res, next) {     // (x)
  dal.createMobile(req.body, function(err, body) {
    if (err) console.log('Didnt work')
    if (body) {
      res.append('content-type', 'application/json')
      res.status(500).send(JSON.stringify(body, null, 2))
    }
  })
})

//Retrieve an item
app.get('/automobiles/:id', function(req, res, next) {  // (x)
    const mobileID = req.params.id;

    dal.getMobile(mobileID, function(err, data) {
        if(err) {
            var responseError = BuildResponseError(err)
            //console.log("Error calling dal.getReliefEffort", err)
            return next(new HTTPError(responseError.status, responseError.message))
        }
        if(data) {
            res.append('Content-type', 'application/json')
            res.send(data);
        }
    })
})

//List a collection of items
app.get('/automobiles', function(req, res, next) {      // (x)
  const sortBy = req.query.sortby || 'automobiles';
  const sortToken = req.query.sorttoken || '';
  const limit = req.query.limit || 5;

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

//  ----------------------------  //
app.use(function(err, req, res, next) {
  console.error(err.stack)
  res.status(500).send(err)
})

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})

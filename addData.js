const dalNoSQL = require('./DAL/no-sql.js');

// Add data to DB
var data = [
  {
    "name":"tesla",
    "description": "2016_model_s",
    "inStock": "true",
    "retailCost": "66000",
    "dateAvailable": "now"
  },
  {
    "name":"tesla",
    "description": "2016_model_x",
    "inStock": "true",
    "retailCost": "74000",
    "dateAvailable": "now"
  },
  {
    "name":"land_rover",
    "description": "2017_range_rover",
    "inStock": "false",
    "retailCost": "85650",
    "dateAvailable": "01-01-17"
  },
  {
    "name":"honda",
    "description": "2017_pilot",
    "inStock": "false",
    "retailCost": "30345",
    "dateAvailable": "01-01-17"
  }
]

data.forEach(function(element) {
  dalNoSQL.createMobile(element, function(err, data) {
    if (err) return console.log(err)
    return console.log("Success:" + data)
  })
})

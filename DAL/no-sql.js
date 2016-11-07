/*jshint esversion: 6 */
const path = require('path');
const PouchDB = require('pouchdb-http');
PouchDB.plugin(require('pouchdb-mapreduce'));
const fetchConfig = require('zero-config');
var R = require('ramda');

var config = fetchConfig(path.join(__dirname, '..'), {dcValue: 'test'});
const urlFormat = require('url').format;
const db = new PouchDB(urlFormat(config.get("couch")));

var dal = {
  createMobile: createMobile,
  getMobile: getMobile,
  listMobiles: listMobiles,
  updateMobile: updateMobile,
  deleteMobile: deleteMobile,
  createView: createView,
  bulkCreate: bulkCreate,
  getByMake: getByMake
}

//  -------   Helpers / Utility  ------   //
function bulkCreate(data, callback) {
  db.bulkDocs(data, function(err, response) {
    if (err) { return callback(err); }
    callback(response)
  });
}

function getDocByID(id, callback) {
    // Call to couch retrieving a document with the given _id value.
    if (typeof id == "undefined" || id === null) {
        return callback(new Error('400Missing id parameter'));
    } else {
        db.get(id, function(err, data) {
            if (err) return callback(err);
            if (data) return callback(null, data);
        });
    }
}

function listDocs(sortBy, startKey, limit, callback) {
  //Validate perams
  if (sortBy === undefined || sortBy === null ) return callback(new Error("listDocs sortBy null/undefined"))
  console.log(limit)
  limit = startKey !== '' ? limit + 1 : limit
  console.log(limit)
  db.query(sortBy, {
    startkey: startKey,
    limit: limit
  }, function(err, data) {
    if (err) return callback(err)
    if (startKey !== '') data.rows.shift()
    callback(null, data)
  })

}

function updateDoc(data, callback) {
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for update'));
    } else if (data.hasOwnProperty('_id') !== true) {
        return callback(new Error('400Missing id property from data'));
    } else if (data.hasOwnProperty('_rev') !== true) {
        return callback(new Error('400Missing rev property from data'));
    } else {
        db.put(data, function(err, response) {
            if (err) return callback(err);
            if (response) return callback(null, response);
        });
    }
}

function deleteDoc(data, callback) {
  if (typeof data == "undefined" || data === null) {
      return callback(new Error('400Missing data for delete'));
  } else if (data.hasOwnProperty('_id') !== true) {
      return callback(new Error('400Missing _id property from data'));
  } else if (data.hasOwnProperty('_rev') !== true) {
      return callback(new Error('400Missing _rev property from data'));
  } else {
      db.remove(data, function(err, response) {
          if (err) return callback(err);
          if (response) return callback(null, response);
      });
  }
}


//  -----  Public Functions  -----  //
function createMobile(data, callback) {
    if (typeof data == "undefined" || data === null) {
        return callback(new Error('400Missing data for create'));
    } else if (data.hasOwnProperty('_id') === true) {
        return callback(new Error('400Unnecessary id property within data.'));
    } else if (data.hasOwnProperty('_rev') === true) {
        return callback(new Error('400Unnecessary rev property within data'));
    } else if (data.hasOwnProperty('name') !== true) {
        return callback(new Error('400Missing name property within data'));
    } else if (data.hasOwnProperty('description') !== true) {
        return callback(new Error('400Missing description property within data'));
    } else if (data.hasOwnProperty('inStock') !== true) {
        return callback(new Error('400Missing inStock property within data'));
    } else if (data.hasOwnProperty('dateAvailable') !== true) {
        return callback(new Error('400Missing dateAvailable property within data'));
    } else if (data.hasOwnProperty('retailCost') !== true) {
        return callback(new Error('400Missing retailCost property within data'));
    } else {
        data.active = true;
        data.type = 'automobile';
        data._id = 'automobile_' + data.name + "_" + data.description;

        db.put(data, function(err, response) {
            if (err)
                return callback(err);
            if (response)
                return callback(null, response);
            }
        );
    }
}

function getMobile(id, callback) {
  getDocByID(id, callback);
}

function listMobiles(sortBy, startKey, limit, callback) {
  listDocs(sortBy, startKey, limit, callback)
}

function createView(designDoc, callback) {
  if (typeof designDoc == "undefined" || designDoc === null) {
      return callback(new Error('400Missing design document.'));
  } else {
    db.put(designDoc).then(function(response) {
        return callback(null, response);
    }).catch(function(err) {
        return callback(err);
    });
  }
}

function updateMobile(data, callback) {
  updateDoc(data, callback)
}

function deleteMobile(data, callback) {
  deleteDoc(data, callback)
}

function getByMake(make, callback) {
    db.allDocs({
        include_docs: true,
        attachments: true
    }, function(err, response) {
        if (err) {
            return callback(err);
        }
        var results = []
        R.map(function(item) {
            if (R.prop('name', item.doc)) {
                if (item.doc.name === make) {
                    results.push(item.doc)
                }
            }
        }, R.prop('rows', response) )
        callback(null, results)
    })
}

module.exports = dal

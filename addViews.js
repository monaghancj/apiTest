const dalNoSQL = require('./DAL/no-sql.js');

// Add Design Doc View
var designDoc = {
    _id: '_design/automobiles',
    views: {
        'automobiles': {
            map: function(doc) {
                if (doc.type === 'automobile') {
                    emit(doc._id);
                }
            }.toString()
        }
    }
}

dalNoSQL.createView(designDoc, function callback(err, data) {
    if (err) return console.log(err);
    if (data) {
        console.log('success: ', data);
    }
})

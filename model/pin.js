var docClient = require('./../database/dynamo');

var pin = 0 ;
var uid = "" ;
var ttl =0;

var params = {
    TableName:"pin",
    Item:{
        pin: pin,
        uid: uid,
        ttl: ttl
    }
};

var getparams = {
    TableName: "pin",
    Key:{
        pin: pin,
    }
};

exports.put = function(pin, uid) {
    params.Item.pin = pin;
    params.Item.uid = uid;
    params.Item.ttl = Math.round((new Date()).getTime() / 1000) + 300;

    return new Promise( (resolve, reject) => {
        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                resolve(data);
            }
        });
    });
}

exports.get = function(pin) {
    getparams.Key.pin = pin;
    return new Promise( (resolve, reject) => {
        docClient.get(getparams, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                reject(err);
            } else {
                if(Object.keys(data).length === 0) resolve(null);
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                resolve(data.Item);
            }
        });
    });
}
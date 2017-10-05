var docClient = require('./../database/dynamo');

var params_noprofile = {
    TableName:"uid",
    Item:{
        uid: "uid",
        pin: "pin",
    }
};
var params_profile = {
    TableName:"uid",
    Item:{
        uid: "uid",
        pin: "pin",
        profile: "profile"
    }
};

var getparams = {
    TableName: "uid",
    Key:{
        uid: "uid"
    }
};
exports.get = function(uid) {
    getparams.Key.uid = uid;
    return new Promise( (resolve, reject) => {
        docClient.get(getparams, (err, data) => {
            if (err) reject(err);
            else {
                if(Object.keys(data).length === 0) resolve(null);
                resolve(data.Item)
            };
        });
    });
}

exports.put = function(uid, pin, profile) {
    let params;
    if (!profile) {        
        params_noprofile.Item.pin = pin;
        params_noprofile.Item.uid = uid;
        params = params_noprofile;
    } else  {
        params_profile.Item.pin = pin;
        params_profile.Item.uid = uid;
        params_profile.Item.profile = profile;
        params = params_profile;
    }

    return new Promise( (resolve, reject) => {
        docClient.put(params, function(err, data) {
            if (err)   reject(err);
            else     resolve(data);   
        });
    });
}
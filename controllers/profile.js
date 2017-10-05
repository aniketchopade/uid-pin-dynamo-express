var uiddb = require('./../model/uid');
var pindb = require('./../model/pin');

exports.getProfile = function(req, res) {
 
   if (!req.query.UID) {
        res.json( {success: false, message: "Not enough information!"})
        return;
   }
   uiddb.get(req.query.UID).then( (result)=> {
        if (!result) generateNewPIN( req, res )
        else if (result.profile) res.json({success: true, profile: result.profile})
        else if (result.pin) {
            pindb.get(result.pin).then( (result)=>{
                let current = Math.round((new Date()).getTime() / 1000); 
                if (!result || result.ttl < current) 
                    generateNewPIN( req, res )
                else
                    res.json( {success: false, PIN: result.pin, status: "old"} )                
            })   
        }
   }, (err) => {
       res.json({message: "failed" , data: err});
   });
};

let generateNewPIN = function( req, res ) {
    let generatedPIN = Math.floor(Math.random() * (999999 - 100000) + 100000);

    pindb.put(generatedPIN.toString(), req.query.UID).then ( (result) => {
        uiddb.put ( req.query.UID, generatedPIN.toString()  ). then( (result)=>{
            res.json( {success: false, PIN: generatedPIN, status: "new"} )
        })
    }, (err) => {
        res.json({sucess: "false" , data: err});
    });

};

exports.postProfile = function(req, res) {
    console.log('postprofile -->' + JSON.stringify(req.body));

    if(!req.body.pin && !req.body.profile) {    
        res.json( { success: "false",message: "Not enought information"});
    }

    pindb.get(req.body.pin).then( (result)=>{
        let current = Math.round((new Date()).getTime() / 1000); 
        if (!result || result.ttl < current) 
            res.json({ success: "false",message: "Account not linked!"});
        else {
            uiddb.put(result.uid,req.body.pin, req.body.profile ).then( (result)=>{
                res.json( {success: true, message: "Account linked!"} )
            })
        }
    }, (err)=>{
        res.json({ success: "false",message: err});
    }) 
}
const CacheData = require("./models/CacheData.js");

module.exports = {

  updateLocation : async function(req,res){
    var location = req.body.location;
    var returnData = await CacheData.forge({
      location : location,
    }).save();
    if(returnData!= null && returnData != undefined){
      res.json({"status":"Success"});
    }else{
      res.json({"status":"Error"});
    }
  },
  getLocation : async function(req,res){
    let qUser;
    await CacheData
      .fetchAll()
        .then((lUser) => {
            qUser = lUser;
        })
        .catch((err) => {
            console.log('Error---' + err);
            qUser = undefined;
    });
    res.json(qUser);
  }
}

const CacheData = require("./models/CacheData.js");

module.exports = {

  updateLocation : async function(req,res){
    let fetchedAppUser;
    await CacheData
    .fetchAll()
    .then((lFetchedAppUser) => {
      console.log(lFetchedAppUser);
      if(lFetchedAppUser.models.length > 0){
        fetchedAppUser = lFetchedAppUser.models[0];
      }
    })
    .catch((err) => {
      fetchedAppUser = undefined;
    });
    if(fetchedAppUser != null && fetchedAppUser!= undefined){
      await fetchedAppUser.save({
        location : req.body.location
      });
    }else{
      await CacheData.forge({
        location : req.body.location
      }).save();
    }
    res.json({"message":"Successfully updated"});
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

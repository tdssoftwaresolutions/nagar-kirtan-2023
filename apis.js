const CacheData = require("./models/CacheData.js");

module.exports = {

  updateLocation : async function(req,res){
    let fetchAdminUser;
    await CacheData.where('id',1)
    .fetch()
    .then((lFetchAdminUser) => {
      fetchAdminUser = lFetchAdminUser;
    })
    .catch((err) => {
      fetchAdminUser = undefined;
    });
    if(fetchAdminUser != null && fetchAdminUser!= undefined){
      await fetchAdminUser.save({
        location: req.body.location
      });
    }
    res.json({"status" : "success"});
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

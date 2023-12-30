const CacheData = require("./models/CacheData.js");
const Donation = require("./models/Donation.js");

module.exports = {

  updateLocation : async function(req,res){
    try{
      let fetchedAppUser;
      await CacheData.where('id',1)
      .fetch()
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
          location : req.body.location,
          id : 1
        }).save();
      }
      res.json({"message":"Successfully updated"});
    }catch(e){
       console.log(e);
       res.json({"message" : "Error saving"});
    }
  },
  getLocation : async function(req,res){
    let user;
    await await CacheData.where('id',1)
        .fetch()
        .then((lUser) => {
              user = lUser;
        })
        .catch((err) => {
            console.log('Error---' + err);
            user = undefined;
    });
    res.json(user);
  },
  newDonation : async function(req,res){
    try{
      await Donation.forge({
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        emailAddress : req.body.emailAddress,
        phoneNumber : req.body.phoneNumber,
        address : req.body.address,
        state : req.body.state,
        donationFor : req.body.donationFor
      }).save();
      res.json({success:true});
    }catch(e){
      res.json({success:false,error:e});
    }
  }
}

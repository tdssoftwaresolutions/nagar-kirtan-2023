const User = require('./models/user.js');
const PartyInformation = require('./models/PartyInformation.js');
const Membership = require('./models/Membership.js');
const News = require('./models/News.js');
const Upload = require('./models/Upload');
const AppUser = require("./models/AppUser");
const ICard = require("./models/ICard");
const AdminUser = require("./models/AdminUser.js");
const CacheData = require("./models/CacheData.js");
var admin = require("firebase-admin");
const fs = require('fs');
const user = require('./models/user.js');
const { PassThrough } = require('stream');
const axios = require('axios');
const { table } = require('console');
const Complaint = require('./models/Complaint');
isFirebaseInitialized = false;

module.exports = {

  setupAllImages: async function(req,res){
   /** let qAllICards;
    await ICard.forge()
        .fetchAll()
        .then((lAllICard) => {
          qAllICards = lAllICard;
        })
        .catch((err) => {
            console.log('Error---' + err);
            qAllICards = undefined;
    });
    console.log('RECORDS');
    for(var i=0;i<qAllICards.length;i++){
      var records = qAllICards.models[i];
      var data = records.attributes;
      var photoString = data.photo;
      if(!photoString.startsWith('data')){
        photoString = "data:image/png;base64,"+photoString;
      }
      await axios
      .post('http://jjjk.mebonix.in/storepicture.php', 
      {
        "base64string" : photoString,
        "filename" : Date.now()
      }
      )
      .then(res => {
        records.save({
          photo: res.data.stored_url,
        });
      })
      .catch(error => {
        console.error(error)
      });
    }
    res.json({'status':'COMPLETED'});**/
  },
  uploadImage : async function(req,response){
    var imageBase64 = req.body.base64string;
    var filename = req.body.filename;
    axios
    .post('http://jjjk.mebonix.in/storepicture.php', 
    {
      "base64string" : imageBase64,
      "filename" : filename
    }
    )
    .then(res => {
      console.log(res.data);
      response.json({"status":"success","stored_url":res.data.stored_url});
    })
    .catch(error => {
      console.error(error)
      response.json({"Status":"failed"});
    })
  },
  getAllICards : async function(req,res){
    var state = req.params.state;
    var appName = req.params.appName;
    let qAllICards;
    await ICard
        .where({'state' :state })
        .where({'app_name':appName})
        .orderBy('created_at','DESC')
        .fetchAll()
        .then((lAllICard) => {
          qAllICards = lAllICard;
        })
        .catch((err) => {
            console.log('Error---' + err);
            qAllICards = undefined;
    });
    res.json(qAllICards);
  },
  downloadData : async function(req,res){
    var downloadData = "";
    var retrievedRecords = "";
    var tableName = req.params.tableName;
    console.log(tableName);
    if(tableName.toLowerCase() === "icard"){
      await ICard.forge()
        .orderBy('created_at','ASC')
        .fetchAll()
        .then((lAllICard) => {
          retrievedRecords = lAllICard;
          downloadData = "#,Name,Father's name,Designation,Aadhar Card No.,DOB,Blood Group,Address,Photo,Id Card Language,Phone No,Approved"
          for(var i=0;i<retrievedRecords.models.length;i++){
            var attributes = retrievedRecords.models[i].attributes;
            downloadData += (i+1)+","+attributes.name+","+attributes.father_name+","+attributes.designation+","+attributes.adhar_card_number+","
            +attributes.dob+","+attributes.blood_group+","+attributes.address+","+attributes.photo+","+attributes.id_card_language+","+attributes.phone_no+
            ","+attributes.is_approved+'\n';
          }
          res.json({"data" : downloadData});
        })
        .catch((err) => {
            console.log('Error---' + err);
            retrievedRecords = undefined;
            res.json({"error" : "There is some error retrieving the download data.Please try again later"});
      });
    }else if(tableName.toLowerCase() === "membership"){
      await Membership.forge()
          .orderBy('created_at','ASC')
          .fetchAll()
          .then((lAllMembership) => {
            retrievedRecords = lAllMembership;
            for(var i=0;i<retrievedRecords.models.length;i++){
              for(var j=0;j<retrievedRecords.models[i].attributes.length;j++){
                  downloadData += retrievedRecords.models[i].attributes[j];
                  downloadData += ",";
              }
              downloadData += "\n";
            }
            res.json({"data" : downloadData});
          })
          .catch((err) => {
              console.log('Error---' + err);
              retrievedRecords = undefined;
              res.json({"error" : "There is some error retrieving the download data.Please try again later"});
      });
    }else{
      res.json({"error" : "Invalid request data type"});
    }
  },
  getAllICardsV2 : async function(req,res){
    var offset = req.params.offset;
    var limit = req.params.limit;
    var search = req.params.search;
    var state = req.params.state;
    var appName = req.params.appName;
    let qAllICard;
    let totalRecords;
    let totalPages;
    if(search.toLowerCase() == "all"){
      await ICard
      .query('orderBy', 'created_at', 'DESC')
      .where({'state':state})
      .where({'app_name':appName})
      .fetchPage({
        limit: limit,
        offset: offset
      })
      .then(function(results) {
        totalRecords = results.pagination.rowCount;
        totalPages = results.pagination.pageCount;
        qAllICard = results 
      })
      .catch((err) => {
        qAllICard = {};
        totalPages = 0;
        totalRecords = 0;
        console.log(err);
      });
    }else if(search.toLowerCase() == "true" || search.toLowerCase() == 'false'){
      await ICard
      .query('orderBy', 'created_at', 'DESC')
      .where({'is_approved' :search })
      .where({'state': state})
      .where({'app_name':appName})
      .fetchPage({
        limit: limit,
        offset: offset
      })
      .then(function(results) {
        totalRecords = results.pagination.rowCount;
        totalPages = results.pagination.pageCount;
        qAllICard = results 
      })
      .catch((err) => {
        qAllICard = {};
        totalPages = 0;
        totalRecords = 0;
        console.log(err);
      });
    }else{
      var searchKeyword = "%"+search+"%".toLowerCase();
      await ICard
      .query('orderBy', 'created_at', 'DESC')
      .where({'state':state})
      .where({'app_name':appName})
      .where(function(){
        this.where('name','LIKE',searchKeyword)
            .orWhere('father_name', 'LIKE',searchKeyword)
            .orWhere('adhar_card_number','LIKE',searchKeyword)
            .orWhere('phone_no','LIKE',searchKeyword)
            .orWhere('address','LIKE',searchKeyword)
      })
      .fetchPage({
        limit: limit,
        offset: offset
      })
      .then(function(results) {
        totalRecords = results.pagination.rowCount;
        totalPages = results.pagination.pageCount;
        qAllICard = results 
      })
      .catch((err) => {
        qAllICard = {};
        totalPages = 0;
        totalRecords = 0;
        console.log(err);
      });
    }
    res.json({
      "totalRecords" : totalRecords,
      "totalPages" : totalPages,
      "records" : qAllICard
    });
  },
  editIdCard : async function(req,res){
    let fetchedICard;
    await ICard.where('id',req.body.record_id)
    .fetch()
    .then((lFetchedICard) => {
      fetchedICard = lFetchedICard;
    })
    .catch((err) => {
        fetchedICard = undefined;
    });
    if(fetchedICard != null && fetchedICard!= undefined){
      await fetchedICard.save({
        name: req.body.name,
        father_name: req.body.father_name,
        designation: req.body.designation,
        adhar_card_number : req.body.adhar_card_number,
        dob : req.body.dob,
        phone_no : req.body.phone_no,
        blood_group : req.body.blood_group,
        address : req.body.address,
        photo : req.body.photo,
        updated_by : req.body.updated_by,
        id_card_language : req.body.id_card_language
      });
    }
    res.json({"status" : "success"});
  },
  updateAdminUser : async function(req,res){
    let fetchAdminUser;
    await AdminUser.where('id',req.body.record_id)
    .fetch()
    .then((lFetchAdminUser) => {
      fetchAdminUser = lFetchAdminUser;
    })
    .catch((err) => {
      fetchAdminUser = undefined;
    });
    if(fetchAdminUser != null && fetchAdminUser!= undefined){
      await fetchAdminUser.save({
        name: req.body.name,
        username: req.body.username,
        password: req.body.password
      });
    }
    res.json({"status" : "success"});
  },
  getMembershipCountByConstituency : async function(req,res){
    let count;
    await Membership
    .where('vidhan_sabha_constituency',req.params.constituency)
    .where('app_name',req.params.appName)
    .count()
    .then((lMembership) => {
      count = lMembership;
    })
    .catch((err) => {
      count = 0;
        console.log(err);
    });
    res.json(count);
  },
  getRecordByAadharCard : async function(req,res){
    let fetchedICard = null
    let fetchedPresidentMLA = null;
    let fetchedMembership = null;
    await ICard.where('adhar_card_number',req.params.aadharcard)
    .fetch()
    .then((lFetchedICard) => {
      fetchedICard = lFetchedICard;
    })
    .catch((err) => {
        fetchedICard = null;
        console.log(err);
    });
    if(fetchedICard != null){
      await User.where('phone',fetchedICard.attributes.phone_no)
      .fetch()
      .then((lFetchedPresidentMLA) => {
        fetchedPresidentMLA = lFetchedPresidentMLA;
      })
      .catch((err1) => {
        fetchedPresidentMLA = null;
          console.log(err1);
      });
    }else{
      await Membership.where('voter_id_number',req.params.aadharcard)
      .fetch()
      .then((lFetchedMembership) => {
        fetchedMembership = lFetchedMembership;
      })
      .catch((err1) => {
        fetchedMembership = null;
          console.log(err1);
      });
    }
    var data = {
      id_card : fetchedICard,
      president_mla : fetchedPresidentMLA,
      membership : fetchedMembership
    }
    res.json(data);
  },
  getIdCardByAdharCard : async function(req,res){
    let fetchedICard;
    await ICard.where('adhar_card_number',req.params.adhar_card_number)
    .fetch()
    .then((lFetchedICard) => {
      fetchedICard = lFetchedICard;
    })
    .catch((err) => {
        fetchedICard = "NOT_FOUND";
        console.log(err);
    });
    res.json(fetchedICard);
  },
  approveICard : async function(req,res){
    let fetchedICard;
    await ICard.where('id',req.body.record_id)
    .fetch()
    .then((lFetchedICard) => {
      fetchedICard = lFetchedICard;
    })
    .catch((err) => {
        fetchedICard = undefined;
    });
    if(fetchedICard != null && fetchedICard!= undefined){
      await fetchedICard.save({
        is_approved : true,
        id_card_language : req.body.id_card_language,
        approved_by : req.body.approved_by
      });
    }
    res.json({"status" : "success"});
  },
  getFile : async function(req,res){
    console.log(req.params.id);
    try{
      let fetchedUpload;
      await Upload.where('id',req.params.id)
      .fetch()
      .then((lUpload) => {
        fetchedUpload = lUpload;
      })
      res.json(fetchedUpload);
    }catch(e){
      res.json();
    }
  },
  approvePresidentMLACandidate : async function(req,res){
    let fetchedUser;
    await User.where('id',req.body.record_id)
    .fetch()
    .then((lUser) => {
      fetchedUser = lUser;
    })
    .catch((err) => {
        fetchedUser = undefined;
    });
    if(fetchedUser != null && fetchedUser!= undefined){
      await fetchedUser.save({
        is_approved : req.body.is_approved
      });
    }
    res.json({"status" : "success"});
  },
  getPresidentMLACandidates: async function(req, res) {
    var state = req.params.state;
    var appName = req.params.appName;
    let qUser;
    await User
    .query('orderBy', 'order', 'ASC')
    .where('app_name',appName)
    .where(function(){
      this.where({'state':state})
      .orWhere({'state' :'all'})
    })
    .fetchAll()
    .then((lUser) => {
        qUser = lUser;
    })
    .catch((err) => {
        console.log('Error---' + err);
        qUser = undefined;
    });
    res.json(qUser);
  },
  getPresidentMLACandidatesV2: async function(req, res) {
    var offset = req.params.offset;
    var limit = req.params.limit;
    var type = req.params.type;
    var state = req.params.state;
    var appName = req.params.appName;
    let qUser;
    let totalRecords;
    let totalPages;
    if(type.toLowerCase() == "all"){
      await User
      .query('orderBy', 'order', 'ASC')
      .where('app_name',appName)
      .where(function(){
        this.where({'state':state})
        .orWhere({'state' :'all'})
      })
      /**await User
        .query(function(qb) {
          qb.select('*');
          qb.whereRaw('state = ?',[state]);
          qb.orWhereRaw('state = ?',['all']);
          qb.orderBy('order','asc');
      })**/
      .fetchPage({
        limit: limit,
        offset: offset
      })
      .then(function(results) {
        totalRecords = results.pagination.rowCount;
        totalPages = results.pagination.pageCount;
        qUser = results 
      })
      .catch((err) => {
        qUser = {};
        totalPages = 0;
        totalRecords = 0;
        console.log(err);
      });
    }else if(type.toLowerCase().startsWith("search=")){
      var searchKeyword = "%"+type.replace("search=","")+"%".toLowerCase();
      await User
      .query('orderBy', 'order', 'ASC')
      .where('app_name',appName)
      .where(function(){
        this.where({'state':state})
        .orWhere({'state' :'all'})
      })
      .where(function(){
            this.where('name','LIKE',searchKeyword)
            .orWhere('type', 'LIKE',searchKeyword)
            .orWhere('designation','LIKE',searchKeyword)
            .orWhere('email','LIKE',searchKeyword)
            .orWhere('phone','LIKE',searchKeyword)
      })
      .fetchPage({
        limit: limit,
        offset: offset
      })
      .then(function(results) {
        totalRecords = results.pagination.rowCount;
        totalPages = results.pagination.pageCount;
        qUser = results 
      })
      .catch((err) => {
        qUser = {};
        totalPages = 0;
        totalRecords = 0;
        console.log(err);
      });
    }else if(type.toLowerCase().includes("type=") && type.toLowerCase().includes("subtype=")){
        var categoryType = type.split("&")[0].replace("type=","");
        var subtype = type.split("&")[1].replace("subtype=","");
        await User
        .query('orderBy', 'order', 'ASC')
        .where({app_name:appName})
        .where({type: categoryType})
        .where({sub_type:subtype})
        .where({is_approved:true})
        .where(function(){
          this.where({'state':state}).orWhere({'state' : 'all'})
        })
        .fetchPage({
          limit: limit,
          offset: offset
        })
        .then(function(results) {
          totalRecords = results.pagination.rowCount;
          totalPages = results.pagination.pageCount;
          qUser = results 
        })
        .catch((err) => {
          qUser = {};
          totalPages = 0;
          totalRecords = 0;
          console.log(err);
        });
    }else{
      await User
      .query('orderBy', 'order', 'ASC')
      .where({app_name: appName})
      .where({type: type})
      .where({is_approved:true})
      .where(function(){
        this.where({'state':state}).orWhere({'state' : 'all'})
      })
      .fetchPage({
        limit: limit,
        offset: offset
      })
      .then(function(results) {
        totalRecords = results.pagination.rowCount;
        totalPages = results.pagination.pageCount;
        qUser = results 
      })
      .catch((err) => {
        qUser = {};
        totalPages = 0;
        totalRecords = 0;
        console.log(err);
      });
    }
    res.json({
      "totalRecords" : totalRecords,
      "totalPages" : totalPages,
      "records" : qUser
    });
  },
  newICard : async function(req,res){
    try{
      await ICard.forge({
        app_name : req.body.app_name,
        name: req.body.name,
        father_name: req.body.father_name,
        designation: req.body.designation,
        adhar_card_number : req.body.adhar_card_number,
        dob : req.body.dob,
        blood_group : req.body.blood_group,
        address : req.body.address,
        phone_no : req.body.phone_no,
        photo : req.body.photo,
        id_card_language : '',
        is_approved : false,
        uploaded_by : req.body.uploaded_by,
        state : req.body.state
      }).save();
      res.json({"status" : "success"});
    }catch(e){
      res.json({"status" : e});
    }
  },
  newPresidenMLACandidate : async function(req,res){
    console.log(req.body.state);
    await User.forge({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      photo : req.body.photo,
      type : req.body.type,
      designation : req.body.designation,
      order : req.body.order,
      is_approved : req.body.is_approved,
      state : req.body.state,
      uploaded_by : req.body.uploaded_by
    }).save();
    res.json({"status" : "success"});
  },
  newPresidenMLACandidateV2 : async function(req,res){
    await User.forge({
      app_name : req.body.app_name,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      photo : req.body.photo,
      type : req.body.type,
      designation : req.body.designation,
      order : req.body.order,
      is_approved : req.body.is_approved,
      uploaded_by : req.body.uploaded_by,
      state : req.body.state,
      sub_type : req.body.sub_type
    }).save();
    res.json({"status" : "success"});
  },
  updateNews : async function(req,res){
    let fetchedNews;
    await News.where('id',req.body.record_id)
    .fetch()
    .then((lNews) => {
      fetchedNews = lNews;
    })
    .catch((err) => {
        fetchedNews = undefined;
    });
    if(fetchedNews != null && fetchedNews!= undefined){
      await fetchedNews.save({
        title: req.body.title,
        description: req.body.description,
      });
    }
    res.json({"status" : "success"});
  },
  updatePresidenMLACandidate: async function(req,res){
    let fetchedUser;
    await User.where('id',req.body.record_id)
    .fetch()
    .then((lUser) => {
      fetchedUser = lUser;
    })
    .catch((err) => {
        fetchedUser = undefined;
    });
    if(fetchedUser != null && fetchedUser!= undefined){
      await fetchedUser.save({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        photo : req.body.photo,
        type : req.body.type,
        designation : req.body.designation,
        order : req.body.order
      });
    }
    res.json({"status" : "success"});
  },
  updatePresidenMLACandidateV2: async function(req,res){
    let fetchedUser;
    await User.where('id',req.body.record_id)
    .fetch()
    .then((lUser) => {
      fetchedUser = lUser;
    })
    .catch((err) => {
        fetchedUser = undefined;
    });
    if(fetchedUser != null && fetchedUser!= undefined){
      await fetchedUser.save({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
        photo : req.body.photo,
        type : req.body.type,
        designation : req.body.designation,
        order : req.body.order,
        sub_type : req.body.sub_type,
        address : req.body.address
      });
    }
    res.json({"status" : "success"});
  },
  getPartyInformation : async function(req,res){
    var appName = req.params.app;
    let qPartyInformation;
    await PartyInformation
        .where('app_name',appName)
        .fetchAll()
        .then((lPartyInformation) => {
            qPartyInformation = lPartyInformation;
        })
        .catch((err) => {
            console.log('Error---' + err);
            qPartyInformation = undefined;
    });
    res.json(qPartyInformation);
  },
  getAllMembership : async function(req,res){
    var state = req.params.state;
    var app_name = req.params.appName;
    let qAllMembership;
    await Membership
        .where('state',state)
        .where('app_name',app_name)
        .orderBy('created_at','DESC')
        .fetchAll()
        .then((lAllMembership) => {
          qAllMembership = lAllMembership;
        })
        .catch((err) => {
            console.log('Error---' + err);
            qAllMembership = undefined;
    });
    res.json(qAllMembership);
  },
  getAllMembershipV2 : async function(req,res){
    var offset = req.params.offset;
    var limit = req.params.limit;
    var search = req.params.search;
    var state = req.params.state;
    var appName = req.params.appName;
    let qAllMembership;
    let totalRecords;
    let totalPages;
    if(search.toLowerCase() == "all"){
      await Membership.query('orderBy', 'created_at', 'DESC')
      .where('state',state)
      .where('app_name',appName)
      .fetchPage({
        limit: limit,
        offset: offset
      })
      .then(function(results) {
        totalRecords = results.pagination.rowCount;
        totalPages = results.pagination.pageCount;
        qAllMembership = results 
      })
      .catch((err) => {
        qAllMembership = {};
        totalPages = 0;
        totalRecords = 0;
        console.log(err);
      });
    }else{
      var searchKeyword = "%"+search+"%".toLowerCase();
      await Membership
      .query('orderBy', 'created_at', 'ASC')
      .where({'state':state})
      .where({'app_name':appName})
      .where(function(){
        this.where('name', 'LIKE',searchKeyword)
        .orWhere('father_or_mother_name', 'LIKE',searchKeyword)
        .orWhere('email', 'LIKE',searchKeyword)
        .orWhere('phone', 'LIKE',searchKeyword)
        .orWhere('district','LIKE',searchKeyword)
      })
      .fetchPage({
        limit: limit,
        offset: offset
      })
      .then(function(results) {
        totalRecords = results.pagination.rowCount;
        totalPages = results.pagination.pageCount;
        qAllMembership = results 
      })
      .catch((err) => {
        qAllMembership = {};
        totalPages = 0;
        totalRecords = 0;
        console.log(err);
      });
    }
    res.json({
      "totalRecords" : totalRecords,
      "totalPages" : totalPages,
      "records" : qAllMembership
    });
  },
  getAllUploads : async function(req,res){
    let qAllUploads;
    await Upload.forge()
        .orderBy('created_at','DESC')
        .where('app_name',req.params.appName)
        .fetchAll()
        .then((lAllUploads) => {
          qAllUploads = lAllUploads;
        })
        .catch((err) => {
            console.log('Error---' + err);
            qAllUploads = undefined;
    });
    res.json(qAllUploads);
  },
  uploadFile : async function(req,res){
    var returnData = await Upload.forge({
      name: req.body.title,
      description: req.body.description,
      file: req.body.file,
      app_name : req.body.app_name
    }).save();
    res.json({"status" : "success"});
  },
  editUpload : async function(req,res){
    let fetchedUpload;
    await Upload.where('id',req.body.record_id)
    .fetch()
    .then((lUpload) => {
      fetchedUpload = lUpload;
    })
    .catch((err) => {
      fetchedUpload = undefined;
    });
    if(fetchedUpload != null && fetchedUpload!= undefined){
      await fetchedUpload.save({
        name: req.body.title,
        description: req.body.description,
        file: req.body.file,
      });
    }
    res.json({"status" : "success"});
  },
  deleteIdCardApproval : async function(req,res){
    try{
      await ICard.where("id", req.params.id).destroy();
      res.json({"status": "success"});
    }catch(err){
      res.json({"status": "error"});
    }
  },
  deleteUpload: async function(req,res){
    try{
      await Upload.where("id", req.params.id).destroy();
      res.json({"status": "success"});
    }catch(err){
      res.json({"status": "error"});
    }
  },
  deletePresidentMLA: async function(req,res){
    try{
      await User.where("id", req.params.id).destroy();
      res.json({"status": "success"});
    }catch(err){
      res.json({"status": "error"});
    }
  },
  deleteNews : async function(req,res){
    try{
      await News.where("id", req.params.id).destroy();
      res.json({"status": "success"});
    }catch(err){
      res.json({"status": "error"});
    }
  },
  uploadNews : async function(req,res){
    var returnData = await News.forge({
      title: req.body.title,
      description: req.body.description,
      app_name : req.body.app_name
    }).save();
    await AppUser
        .where('app_name',req.body.app_name)
        .fetchAll()
        .then((lAllAppUsers) => {
          var registrationTokens = [];
          for(var i=0;i<lAllAppUsers.models.length;i++){
            registrationTokens.push(lAllAppUsers.models[i].attributes.fcm_user_token);
          }
          var registrationTokensArray = [];
          var maximumTokenAllowed = 499;
          for(let j=0;j<registrationTokens.length;j += maximumTokenAllowed){
            registrationTokensArray.push(registrationTokens.slice(j,j+maximumTokenAllowed));
          }

          for(var k=0;k<registrationTokensArray.length;k++){
            var registrationTokensToSend = registrationTokensArray[k];
            const message = {
              notification: {title:req.body.title, body: req.body.description},
              tokens: registrationTokensToSend,
            }
            let jsonData;
            if(req.body.app_name === 'jjjk'){
              console.log('jjjk');
              jsonData = JSON.parse(fs.readFileSync('public/jjjk-adb1e-firebase-adminsdk-c0cce-8af35204ab.json', 'utf-8'));
            }else if(req.body.app_name === 'iu'){
              console.log('iu');
              jsonData = JSON.parse(fs.readFileSync('public/immigration-union-firebase-adminsdk-v849v-bc84301bc1.json', 'utf-8'));
            }
            if(!isFirebaseInitialized){
              admin.initializeApp({
                credential: admin.credential.cert(jsonData)
              });
              isFirebaseInitialized = true;
            }
            admin.messaging().sendMulticast(message)
              .then((response) => {
                console.log(response);
                console.log(JSON.stringify(response));
                if (response.failureCount > 0) {  
                  const failedTokens = [];
                  response.responses.forEach((resp, idx) => {
                    if (!resp.success) {
                      failedTokens.push(registrationTokensToSend[idx]);
                    }
                  });
                  console.log('List of tokens that caused failures: ' + failedTokens);
                }
            });
          }
          res.json({"message":"Succesfully broadcasted the news!"});
         })
        .catch((err) => {
            console.log('Error---' + err);
            res.json({"message":"Due to some internal issue, we can't broadcast the news"});
    });
  },
  getNews: async function(req,res){
    let qAllNews;
    await News.forge()
        .orderBy('created_at','DESC')
        .where('app_name',req.params.appName)
        .fetchAll()
        .then((lAllNews) => {
          qAllNews = lAllNews;
        })
        .catch((err) => {
            console.log('Error---' + err);
            qAllNews = undefined;
    });
    res.json(qAllNews);
  },
  newComplaint:async function(req,res){
    var body = req.body;
    var returnData = await Complaint.forge({
      name : body.name,
       mobile  : body.mobile,
       email_address: body.email_address,
       complaint: body.complaint,
       gender : body.gender,
       state: body.state
    }).save();
    if(returnData!= null && returnData != undefined){
      res.json({"message":"Successfully submitted your complaint"});
    }else{
      res.json({"message":"Due to some internal error, we can't process your request. Please try after sometime."});
    }
  },
  getAllComplaints : async function(req,res){
    var state = req.params.state
    let qAllComplaints;
    await Complaint.where('state',state)
        .orderBy('created_at','DESC')
        .fetchAll()
        .then((lAllComplaints) => {
          qAllComplaints = lAllComplaints
        })
        .catch((err) => {
            console.log('Error---' + err);
            qAllComplaints = undefined;
    });
    res.json(qAllComplaints);
  },
  newMembership :async function(req,res){
    var body = req.body;
    var returnData = await Membership.forge({
       app_name : body.app_name,
       name  : body.name,
       father_or_mother_name: body.father_or_mother_name,
       gender: body.gender,
       dob : body.dob,
       district : body.district,
       state : body.state,
       vidhan_sabha_constituency : body.vidhan_sabha_constituency,
       house_no : body.house_no,
       address : body.address,
       pincode_zipcode : body.pincode_zipcode,
       voter_id_number : body.voter_id_number,
       would_you_want_to_volunteer : body.would_you_want_to_volunteer,
       type_of_membership : body.type_of_membership,
       email : body.email,
       phone : body.phone,
       criminal_case: body.criminal_case,
       qualification: body.qualification
    }).save();
    if(returnData!= null && returnData != undefined){
      res.json({"message":"Successfully submitted your request for membership"});
    }else{
      res.json({"message":"Due to some internal error, we can't process your request. Please try after sometime."});
    }
  },
  savePartyInformation : async function(req,res){
    var data = req.body;
    var about_us = data.about_us;
    var manifesto = data.manifesto;
    var app_name = data.app_name;
    var returnData;
    let qPartyInformation;
    await PartyInformation
        .where('app_name',app_name)
        .fetchAll()
        .then((lPartyInformations) => {
            if(lPartyInformations.length>0){
              qPartyInformation = lPartyInformations.models[0];
            }else{
              qPartyInformation = undefined;
            }
        })
        .catch((err) => {
            qPartyInformation = undefined;
        });
    if (qPartyInformation === undefined) {
        returnData = await PartyInformation.forge({
            about_us: about_us,
            manifesto: manifesto,
            app_name : app_name
        }).save();
    } else {
        returnData = await qPartyInformation.save({
          about_us: about_us,
          manifesto: manifesto,
          app_name : app_name
        });
    }
    res.json({"message":"Succesfully updated the party information!"});
  },
  login : async function(req,res){
    var data = req.query;
    var username = data.username;
    var password = data.password;
    var state = data.state;
    console.log(username+" "+password+" "+state);

    let fetchedLoginUser;
    await AdminUser.where('username',username).where('password',password).where('state',state)
    .fetch()
    .then((lFetchedLoginUser) => {
      fetchedLoginUser = lFetchedLoginUser;
    })
    .catch((err) => {
      console.log(err);
      fetchedLoginUser = undefined;
    });

    if(fetchedLoginUser!= null && fetchedLoginUser != undefined){
      res.json({"status":"OK", "state": fetchedLoginUser.attributes.state, "type" : fetchedLoginUser.attributes.type,"username" : fetchedLoginUser.attributes.username});
    }else{
      res.json({"status":"ERROR"});
    }
  },
  getAllAdminUsers : async function(req,res){
    var state = req.params.state
    let qAllAdminUsers;
    await AdminUser.where('state',state)
        .orderBy('created_at','DESC')
        .fetchAll()
        .then((lAllAdminUsers) => {
          qAllAdminUsers = lAllAdminUsers
        })
        .catch((err) => {
            console.log('Error---' + err);
            qAllAdminUsers = undefined;
    });
    res.json(qAllAdminUsers);
  },
  appLogin: async function(req,res){
    var body = req.body;
    var data = body.data;
    var app_name = body.app_name;
    var fcm_user_token = body.fcm_user_token;
    var returnData = await AppUser.forge({
      data: data,
      fcm_user_token: fcm_user_token,
      app_name : app_name
    }).save();
    if(returnData!= null && returnData != undefined){
      res.json({"status":"Success"});
    }else{
      res.json({"status":"Error"});
    }
  },
  cacheUserData : async function(req,res){
    var data = req.body.data;
    var state = req.body.state;
    var opn = req.body.opn;
    var returnData = await CacheData.forge({
      data : data,
      state : state,
      opn : opn
    }).save();
    if(returnData!= null && returnData != undefined){
      res.json({"status":"Success"});
    }else{
      res.json({"status":"Error"});
    }
  },
  getCacheData : async function(req,res){
    let qUser;
    await CacheData
      .where('app_name',req.params.appName)
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

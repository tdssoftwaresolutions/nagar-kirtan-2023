const express = require('express');
const router = express.Router();
const apis = require('./apis.js');

//V1 APIs
router.get("/getPresidentMLACandidates/:state/:appName",apis.getPresidentMLACandidates); //Completed
router.get("/getFile/:id",apis.getFile);
router.get("/getAllICards/:state/:appName",apis.getAllICards);
router.post("/approveICard",apis.approveICard);
router.post("/editIdCard",apis.editIdCard);
router.get("/getIdCardByAdharCard/:adhar_card_number",apis.getIdCardByAdharCard);
router.post("/newPresidenMLACandidate",apis.newPresidenMLACandidate); // Completed
router.post("/updatePresidenMLACandidate",apis.updatePresidenMLACandidate); //Completed 
router.post("/updateNews",apis.updateNews);
router.post("/newICard",apis.newICard);
router.get("/getPartyInformation/:app",apis.getPartyInformation);
router.get("/getAllMembership/:state/:appName",apis.getAllMembership);
router.get("/getAllUploads/:appName",apis.getAllUploads);
router.post("/uploadFile",apis.uploadFile);
router.post("/editUpload",apis.editUpload);
router.post("/uploadNews",apis.uploadNews);
router.get("/getNews/:appName",apis.getNews);
router.post("/newMembership",apis.newMembership); 
router.post("/savePartyInformation",apis.savePartyInformation); //Completed
router.get("/login",apis.login); //Completed
router.post('/applogin',apis.appLogin); //Completed
router.delete('/deleteUpload/:id',apis.deleteUpload);
router.delete('/deletePresidentMLA/:id',apis.deletePresidentMLA);
router.delete('/deleteNews/:id',apis.deleteNews);
router.delete('/deleteIdCardApproval/:id',apis.deleteIdCardApproval);
router.get("/getAllAdminUsers/:state",apis.getAllAdminUsers);
router.post("/updateAdminUser",apis.updateAdminUser);
router.post("/approvePresidentMLACandidate",apis.approvePresidentMLACandidate);
router.post("/cacheUserData",apis.cacheUserData);
router.get("/getCacheData/:appName",apis.getCacheData);
//V2 APIs
router.get("/getPresidentMLACandidatesV2/:offset/:limit/:type/:state/:appName",apis.getPresidentMLACandidatesV2); //Completed
router.post("/uploadImage",apis.uploadImage); //completed
router.get("/getAllMembershipV2/:offset/:limit/:search/:state/:appName",apis.getAllMembershipV2);
router.get("/getAllICardsV2/:offset/:limit/:search/:state/:appName",apis.getAllICardsV2);
router.get("/setAllImages",apis.setupAllImages); //Completed
router.get("/downloadData/:tableName",apis.downloadData);
router.post("/newPresidenMLACandidateV2",apis.newPresidenMLACandidateV2); //Completed
router.post("/updatePresidenMLACandidateV2",apis.updatePresidenMLACandidateV2); //Completed
router.get("/getRecordByAadharCard/:aadharcard",apis.getRecordByAadharCard);
router.get("/getMembershipCountByConstituency/:constituency/:appName",apis.getMembershipCountByConstituency);
router.post("/newComplaint",apis.newComplaint);
router.get("/getAllComplaints/:state",apis.getAllComplaints);
module.exports = router;

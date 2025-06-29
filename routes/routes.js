const express = require("express");
const {handleCompilation,handleCheckStatus,handleDownload} = require("../controllers/compiler");
const router = express.Router();

router.post("/",handleCompilation)
router.get("/status/:jobId",handleCheckStatus)
router.post("/download",handleDownload)

module.exports = router

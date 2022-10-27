const router = require("express").Router();
const apiController = require("../controller/apiController");
// import multer
// const { uploadSingle, uploadMultiple } = require("../middleware/multer");

router.get("/landing-page", apiController.landingPage);
router.get("/detail-page/:id", apiController.detailPage);

module.exports = router;

const router = require("express").Router();
const adminController = require("../controller/adminController");
// import multer
const { upload } = require("../middleware/multer");

router.get("/dashboard", adminController.viewDashboard);

// Category endpoint
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

// Bank endpoint
router.get("/bank", adminController.viewBank);
router.post("/bank", upload, adminController.addBank);

// Items endpoint
router.get("/items", adminController.viewItems);

// Booking endpoint
router.get("/booking", adminController.viewBooking);

module.exports = router;

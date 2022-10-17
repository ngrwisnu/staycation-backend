const router = require("express").Router();
const adminController = require("../controller/adminController");
// import multer
const { uploadSingle, uploadMultiple } = require("../middleware/multer");

router.get("/dashboard", adminController.viewDashboard);

// Category endpoint
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

// Bank endpoint
router.get("/bank", adminController.viewBank);
router.post("/bank", uploadSingle, adminController.addBank);
router.put("/bank", uploadSingle, adminController.editBank);
router.delete("/bank/:id", adminController.deleteBank);

// Items endpoint
router.get("/items", adminController.viewItems);
router.post("/items", uploadMultiple, adminController.addItem);
router.delete("/items/:id", adminController.deleteItem);

// Booking endpoint
router.get("/booking", adminController.viewBooking);

module.exports = router;

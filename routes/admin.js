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
router.get("/items/show-image/:id", adminController.showItemImage);
router.get("/items/:id", adminController.showEditedItem);
router.put("/items/:id", uploadMultiple, adminController.editItem);

router.delete("/items/:id/delete", adminController.deleteItem);

// Item Detail endpoint
router.get("/items/show-item-detail/:itemId", adminController.viewItemDetail);
router.post("/items/add/feature", uploadSingle, adminController.addFeature);

// Booking endpoint
router.get("/booking", adminController.viewBooking);

module.exports = router;

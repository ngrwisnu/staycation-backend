const router = require("express").Router();
const adminController = require("../controller/adminController");
const auth = require("../middleware/auth");
// import multer
const { uploadSingle, uploadMultiple } = require("../middleware/multer");

// Sign in endpoint
router.get("/signin", adminController.viewSignin);
router.post("/signin", adminController.actionSignin);
router.use(auth);
router.get("/dashboard", adminController.viewDashboard);
router.get("/logout", adminController.actionLogout);

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
router.put("/items/update/feature", uploadSingle, adminController.editFeature);
router.delete("/items/:itemId/feature/:id", adminController.deleteFeature);

// Item Activity endpoint
router.post("/items/add/activity", uploadSingle, adminController.addActivity);
router.put(
  "/items/update/activity",
  uploadSingle,
  adminController.editActivity
);
router.delete("/items/:itemId/activity/:id", adminController.deleteActivity);

// Booking endpoint
router.get("/booking", adminController.viewBooking);
router.get("/booking/:id", adminController.showBookingDetail);
router.put("/booking/:id/confirmation", adminController.actionConfirmation);
router.put("/booking/:id/rejection", adminController.actionReject);

module.exports = router;

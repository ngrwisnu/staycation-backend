const router = require("express").Router();
const adminController = require("../controller/adminController");

router.get("/dashboard", adminController.viewDashboard);

// Category endpoint
router.get("/category", adminController.viewCategory);
router.post("/category", adminController.addCategory);
router.put("/category", adminController.editCategory);
router.delete("/category/:id", adminController.deleteCategory);

// Bank endpoint
router.get("/bank", adminController.viewBank);

// Items endpoint
router.get("/items", adminController.viewItems);

// Booking endpoint
router.get("/booking", adminController.viewBooking);

module.exports = router;

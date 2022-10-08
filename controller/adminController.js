// import Models
const Category = require("../models/Category");
const Bank = require("../models/Bank");

module.exports = {
  viewDashboard: (req, res) => {
    res.render("admin/dashboard/view_dashboard", {
      title: "Staycation | Dashboard",
    });
  },
  // Category tab controller
  viewCategory: async (req, res) => {
    try {
      const category = await Category.find();
      const alertMsg = req.flash("alertMsg");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMsg,
        status: alertStatus,
      };

      // local parameter -> sent variables to views folder
      res.render("admin/category/view_category", {
        category,
        alert,
        title: "Staycation | Category",
      });
    } catch (error) {
      res.redirect("/admin/category");
    }
  },
  addCategory: async (req, res) => {
    try {
      const { name } = req.body;

      await Category.create({ name });

      req.flash("alertMsg", "Successfully added new category");
      req.flash("alertStatus", "success");

      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/category");
    }
  },
  editCategory: async (req, res) => {
    try {
      const id = req.body.id;
      const name = req.body.name;

      const category = await Category.findOne({ _id: id });

      category.name = name;
      await category.save();

      req.flash("alertMsg", "Successfully updated the item");
      req.flash("alertStatus", "success");

      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");

      res.redirect("/admin/category");
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      const category = await Category.findOne({ _id: id });
      await category.remove();

      req.flash("alertMsg", "Success deleting an item");
      req.flash("alertStatus", "success");

      res.redirect("/admin/category");
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");

      res.redirect("/admin/category");
    }
  },
  // Bank tab controller
  viewBank: async (req, res) => {
    try {
      const bank = await Bank.find();
      const alertMsg = req.flash("alertMsg");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMsg,
        status: alertStatus,
      };

      res.render("admin/bank/view_bank", {
        title: "Staycation | Bank",
        bank,
        alert,
      });
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");

      res.redirect("/admin/bank");
    }
  },
  addBank: async (req, res) => {
    try {
      const { bankName, accountNumber, name } = req.body;
      await Bank.create({
        bankName,
        accountNumber,
        name,
        imageUrl: `images/${req.file.filename}`,
      });

      req.flash("alertMsg", "Successfully added new Bank");
      req.flash("alertStatus", "success");

      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/bank");
    }
  },
  // Items tab controller
  viewItems: (req, res) => {
    res.render("admin/items/view_item", { title: "Staycation | Items" });
  },
  // Booking tab controller
  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking", { title: "Staycation | Booking" });
  },
};

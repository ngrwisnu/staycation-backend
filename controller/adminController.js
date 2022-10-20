// import Models
const Category = require("../models/Category");
const Bank = require("../models/Bank");
const Item = require("../models/Item");
const Feature = require("../models/Feature");
const Activity = require("../models/Activity");
const Image = require("../models/Image");

const fs = require("fs-extra");
const path = require("path");

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
  editBank: async (req, res) => {
    try {
      const { id, name, bankName, accountNumber } = req.body;

      const bank = await Bank.findOne({ _id: id });
      if (req.file === undefined) {
        bank.name = name;
        bank.bankName = bankName;
        bank.accountNumber = accountNumber;
        await bank.save();

        req.flash("alertMsg", "Update success");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      } else {
        await fs.unlink(path.join(`public/${bank.imageUrl}`));
        bank.name = name;
        bank.bankName = bankName;
        bank.accountNumber = accountNumber;
        bank.imageUrl = `images/${req.file.filename}`;
        await bank.save();

        req.flash("alertMsg", "Update success");
        req.flash("alertStatus", "success");
        res.redirect("/admin/bank");
      }
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/bank");
    }
  },
  deleteBank: async (req, res) => {
    try {
      const { id } = req.params;
      const bank = await Bank.findOne({ _id: id });
      await fs.unlink(path.join(`public/${bank.imageUrl}`));
      await bank.remove();

      req.flash("alertMsg", "Success deleting an item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/bank");
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/bank");
    }
  },

  // Items tab controller
  viewItems: async (req, res) => {
    try {
      // get all category for item dropdown form
      const category = await Category.find();

      // get all category for item dropdown form
      const item = await Item.find()
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });

      const alertMsg = req.flash("alertMsg");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMsg,
        status: alertStatus,
      };

      res.render("admin/items/view_item", {
        title: "Staycation | Items",
        category,
        item,
        alert,
        action: "view",
      });
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/items");
    }
  },

  addItem: async (req, res) => {
    try {
      const { category, title, price, city, about } = req.body;

      if (req.files.length > 0) {
        const newCategory = await Category.findOne({ _id: category });
        const newItem = {
          categoryId: category,
          title,
          description: about,
          price,
          city,
        };

        const item = await Item.create(newItem);
        newCategory.itemId.push({ _id: item._id });
        await newCategory.save();

        // set image input
        for (let i = 0; i < req.files.length; i++) {
          const saveImage = await Image.create({
            imageUrl: `images/${req.files[i].filename}`,
          });
          item.imageId.push({ _id: saveImage._id });
          await item.save();
        }

        req.flash("alertMsg", "Success adding new item");
        req.flash("alertStatus", "success");
        res.redirect("/admin/items");
      }
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/items");
    }
  },

  showItemImage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate({
        path: "imageId",
        select: "id imageUrl",
      });

      const alertMsg = req.flash("alertMsg");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMsg,
        status: alertStatus,
      };
      res.render("admin/items/view_item", {
        title: "Staycation | Show Item Image",
        alert,
        item,
        action: "show image",
        // user: req.session.user
      });
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/items");
    }
  },

  showEditedItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });
      const category = await Category.find();

      const alertMsg = req.flash("alertMsg");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMsg,
        status: alertStatus,
      };
      res.render("admin/items/view_item", {
        title: "Staycation | Edit Item",
        alert,
        item,
        category,
        action: "edit",
        // user: req.session.user
      });
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/items");
    }
  },

  editItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { category, title, price, city, about } = req.body;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "imageId", select: "id imageUrl" })
        .populate({ path: "categoryId", select: "id name" });

      console.log(req.body);
      console.log(item);
      if (req.files.length > 0) {
        for (let i = 0; i < item.imageId.length; i++) {
          const imageUpdate = await Image.findOne({ _id: item.imageId[i]._id });
          await fs.unlink(path.join(`public/${imageUpdate.imageUrl}`));
          imageUpdate.imageUrl = `images/${req.files[i].filename}`;
          await imageUpdate.save();
        }
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = category;
        await item.save();

        req.flash("alertMsg", "Update success");
        req.flash("alertStatus", "success");
        res.redirect("/admin/items");
      } else {
        console.log(item);
        item.title = title;
        item.price = price;
        item.city = city;
        item.description = about;
        item.categoryId = category;
        await item.save();
        req.flash("alertMsg", "Update success");
        req.flash("alertStatus", "success");
        res.redirect("/admin/items");
      }
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/items");
    }
  },

  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id }).populate("imageId");

      for (let i = 0; i < item.imageId.length; i++) {
        Image.findOne({ _id: item.imageId[i]._id })
          .then((image) => {
            fs.unlink(path.join(`public/${image.imageUrl}`));
            image.remove();
          })
          .catch((error) => {
            req.flash("alertMsg", `${error.message}`);
            req.flash("alertStatus", "warning");
            res.redirect("/admin/items");
          });
      }
      await item.remove();
      req.flash("alertMsg", "Success deleting an item");
      req.flash("alertStatus", "success");
      res.redirect("/admin/items");
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect("/admin/items");
    }
  },

  viewItemDetail: async (req, res) => {
    const { itemId } = req.params;

    try {
      const alertMsg = req.flash("alertMsg");
      const alertStatus = req.flash("alertStatus");
      const alert = {
        message: alertMsg,
        status: alertStatus,
      };

      const feature = await Feature.find({ itemId: itemId });
      const activity = await Activity.find({ itemId: itemId });

      res.render("admin/items/item_detail/view_item_detail", {
        title: "Staycation | Item Detail",
        alert,
        itemId,
        feature,
        activity,
        // user: req.session.user
      });
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    }
  },

  addFeature: async (req, res) => {
    const { name, qty, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash("alertMsg", `Image not found`);
        req.flash("alertStatus", "warning");
        res.redirect(`/admin/items/show-item-detail/${itemId}`);
      }

      const feature = await Feature.create({
        name,
        qty,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.featureId.push({ _id: feature._id });
      await item.save();

      req.flash("alertMsg", `New feature added`);
      req.flash("alertStatus", "success");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    }
  },

  editFeature: async (req, res) => {
    const { id, name, qty, itemId } = req.body;
    try {
      const feature = await Feature.findOne({ _id: id });
      if (req.file == undefined) {
        feature.name = name;
        feature.qty = qty;
        await feature.save();

        req.flash("alertMsg", `Success updated item's feature`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/items/show-item-detail/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${feature.imageUrl}`));
        feature.name = name;
        feature.qty = qty;
        feature.imageUrl = `images/${req.file.filename}`;
        await feature.save();

        req.flash("alertMsg", `Success updated item's feature`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/items/show-item-detail/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    }
  },

  deleteFeature: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const feature = await Feature.findOne({ _id: id });

      const item = await Item.findOne({ _id: itemId }).populate("featureId");

      for (let i = 0; i < item.featureId.length; i++) {
        if (item.featureId[i]._id.toString() === feature._id.toString()) {
          item.featureId.pull({ _id: feature._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${feature.imageUrl}`));
      await feature.remove();

      req.flash("alertMsg", `Success deleting item's feature`);
      req.flash("alertStatus", "success");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    }
  },

  // Activity controller
  addActivity: async (req, res) => {
    const { name, type, itemId } = req.body;

    try {
      if (!req.file) {
        req.flash("alertMsg", `Image not found`);
        req.flash("alertStatus", "warning");
        res.redirect(`/admin/items/show-item-detail/${itemId}`);
      }

      const activity = await Activity.create({
        name,
        type,
        itemId,
        imageUrl: `images/${req.file.filename}`,
      });

      const item = await Item.findOne({ _id: itemId });
      item.activityId.push({ _id: activity._id });
      await item.save();

      req.flash("alertMsg", `Success adding new activity`);
      req.flash("alertStatus", "success");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    }
  },

  editActivity: async (req, res) => {
    const { id, name, type, itemId } = req.body;
    try {
      const activity = await Activity.findOne({ _id: id });
      if (req.file == undefined) {
        activity.name = name;
        activity.type = type;
        await activity.save();

        req.flash("alertMsg", `Success updated item's activity`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/items/show-item-detail/${itemId}`);
      } else {
        await fs.unlink(path.join(`public/${activity.imageUrl}`));
        activity.name = name;
        activity.type = type;
        activity.imageUrl = `images/${req.file.filename}`;
        await activity.save();

        req.flash("alertMsg", `Success updated item's activity`);
        req.flash("alertStatus", "success");
        res.redirect(`/admin/items/show-item-detail/${itemId}`);
      }
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    }
  },

  deleteActivity: async (req, res) => {
    const { id, itemId } = req.params;
    try {
      const activity = await Activity.findOne({ _id: id });

      const item = await Item.findOne({ _id: itemId }).populate("activityId");

      for (let i = 0; i < item.activityId.length; i++) {
        if (item.activityId[i]._id.toString() === activity._id.toString()) {
          item.activityId.pull({ _id: activity._id });
          await item.save();
        }
      }
      await fs.unlink(path.join(`public/${activity.imageUrl}`));
      await activity.remove();

      req.flash("alertMsg", `Success deleting item's activity`);
      req.flash("alertStatus", "success");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    } catch (error) {
      req.flash("alertMsg", `${error.message}`);
      req.flash("alertStatus", "warning");
      res.redirect(`/admin/items/show-item-detail/${itemId}`);
    }
  },

  // Booking tab controller
  viewBooking: (req, res) => {
    res.render("admin/booking/view_booking", { title: "Staycation | Booking" });
  },
};

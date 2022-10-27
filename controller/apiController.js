const Item = require("../models/Item");
const Traveler = require("../models/Booking");
const Landscapes = require("../models/Activity");
const Category = require("../models/Category");
const Bank = require("../models/Bank");

module.exports = {
  landingPage: async (req, res) => {
    try {
      const mostChosen = await Item.find()
        .select("_id title city price unit imageId")
        .limit(3)
        .populate({ path: "imageId", select: "_id imageUrl" });

      const category = await Category.find()
        .select("_id name")
        .limit(3)
        .populate({
          path: "itemId",
          select: "_id title city isPopular imageId",
          perDocumentLimit: 4,
          option: { sort: { sumBooking: -1 } },
          populate: {
            path: "imageId",
            select: "_id imageUrl",
            perDocumentLimit: 1,
          },
        });

      const traveler = await Traveler.find();
      const landscapes = await Landscapes.find();
      const city = await Item.find();

      for (let i = 0; i < category.length; i++) {
        for (let j = 0; j < category[i].itemId.length; j++) {
          const item = await Item.findOne({
            _id: category[i].itemId[j]._id,
          });

          item.isPopular = false;
          await item.save();

          if (category[i].itemId[0] === category[i].itemId[j]) {
            item.isPopular = true;
            await item.save();
          }
        }
      }

      const stories = [
        {
          _id: "stry1",
          rate: 4.9,
          content:
            "What a wonderful moment with my family and I will take another vacation soon",
          name: "John Doe",
          occupation: "Product Designer",
        },
        {
          _id: "stry2",
          rate: 4.9,
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Felis eget velit aliquet sagittis id consectetur purus ut. ",
          name: "Alisa Doe",
          occupation: "Entrepeneur",
        },
        {
          _id: "stry3",
          rate: 4.9,
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          name: "Filly Doe",
          occupation: "UX Designer",
        },
        {
          _id: "stry4",
          rate: 4.9,
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Dictum sit amet justo donec. Malesuada bibendum arcu vitae elementum curabitur vitae nunc sed velit.",
          name: "Robert Doe",
          occupation: "UX Researcher",
        },
        {
          _id: "stry5",
          rate: 4.9,
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor inci",
          name: "Belinda Doe",
          occupation: "Product Designer",
        },
        {
          _id: "stry6",
          rate: 4.9,
          content:
            "In dictum tempor dolor, eu pharetra orci mollis non. Pellentesque leo lectus, placerat ut commodo ac, maximus malesuada metus.",
          name: "Jason Doe",
          occupation: "Web Developer",
        },
        {
          _id: "stry7",
          rate: 4.9,
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
          name: "Jenny Doe",
          occupation: "Product Designer",
        },
        {
          _id: "stry8",
          rate: 4.9,
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. At erat pellentesque adipiscing commodo elit at.",
          name: "Elissa Doe",
          occupation: "Software Engineer",
        },
        {
          _id: "stry9",
          rate: 4.9,
          content:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          name: "Dinda Doe",
          occupation: "Software Developer",
        },
      ];

      res.status(200).json({
        hero: {
          travelers: traveler.length,
          landscapes: landscapes.length,
          cities: city.length,
        },
        landscapes,
        mostChosen,
        category,
        testimonial,
        stories,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server ERROR" });
    }
  },

  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const item = await Item.findOne({ _id: id })
        .populate({ path: "featureId", select: "_id name imageUrl" })
        .populate({ path: "activityId", select: "_id name type imageUrl" })
        .populate({ path: "imageId", select: "_id imageUrl" });

      const bank = await Bank.find();

      const testimonial = {
        _id: "asd1293uasdads1",
        imageUrl: "/images/testimonial1.jpg",
        name: "Happy Family",
        rate: 4.55,
        content:
          "What a great trip with my family and I should try again next time soon ...",
        familyName: "Angga",
        familyOccupation: "Product Designer",
      };

      res.status(200).json({
        ...item._doc,
        bank,
        testimonial,
      });
    } catch (error) {}
  },
};

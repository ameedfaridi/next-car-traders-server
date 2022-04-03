const express = require("express");
require("../db/connection");
const FAQ = require("../db/models/faq");
const Car = require("../db/models/cars");
const url = require("url");

const router = express.Router();

router.get("/faq", async (req, res) => {
  const faq = await FAQ.find();
  res.json(faq);
});

router.post("/faq", async (req, res) => {
  try {
    const obj = req.body;
    const Faq = await new FAQ(obj);
    await Faq.save();
    res.json({ message: "successfull" });
  } catch (e) {
    console.log(e);
  }
});

router.post("/cars", async (req, res) => {
  try {
    const obj = req.body;
    const car = await new Car(obj);
    await car.save();
    res.json({ message: "successfull" });
  } catch (e) {
    res.json({ message: e });
  }
});

router.get("/car/make/model/:id", async (req, res) => {
  const _id = req.params.id;
  try {
    const car = await Car.find({ _id });
    res.send(car);
  } catch (e) {
    res.json({ message: "Whoops! No car found", e });
  }
});

router.get("/car/makes", async (req, res) => {
  try {
    const makeBygroup = await Car.aggregate([
      {
        $group: {
          _id: { make: "$make", model: "$model" },
        },
      },
      {
        $group: {
          _id: "$_id.make",
          count: { $sum: 1 },
        },
      },
    ]);

    res.send(makeBygroup);
  } catch (e) {
    res.status(500).json(e);
  }
});

router.get("/car/models/:make", async (req, res) => {
  const make = req.params;
  try {
    const models = await Car.find(make, { model: 1 });
    res.send(models);
  } catch (e) {
    console.log(e);
  }
});

router.get("/cars/:query", async (req, res) => {
  const query = url.parse(req.url, true).query;
  const make = getStringValue(query.make);
  const model = getStringValue(query.model);
  const minPrice = getNumberValue(query.minPrice, "min");
  const maxPrice = getNumberValue(query.maxPrice);
  const PageNumber = getNumberValue(query.page);
  const numberOfCarsPerPage = 2;

  const getCurrentPageCars =
    PageNumber > 0 ? (PageNumber - 1) * numberOfCarsPerPage : 0;

  const setCurrentPageCars = [
    { $skip: getCurrentPageCars },
    { $limit: numberOfCarsPerPage },
  ];

  const PriceBetween = [
    { averagePrice: { $gte: minPrice } },
    { averagePrice: { $lte: maxPrice } },
  ];

  const reqData = () => {
    if (make === "") return [...PriceBetween];
    if (make && !model) return [{ make }, ...PriceBetween];
    if (make && model) return [{ make }, { model }, ...PriceBetween];
  };

  const schema = () => {
    return {
      $match: {
        $and: reqData(),
      },
    };
  };

  try {
    const cars = await Car.aggregate([schema(), ...setCurrentPageCars]);
    const totalPages = await Car.aggregate([
      schema(),
      {
        $group: {
          _id: "null",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      cars,
      totalPages: Math.ceil(totalPages[0].count / numberOfCarsPerPage),
    });
  } catch (e) {
    res.json({ message: "Whoops! No car found", e });
  }
});

module.exports = router;

const getStringValue = (value) => {
  const newValue = getAsString(value);
  return newValue === undefined || newValue === "all" ? "" : newValue;
};

const getNumberValue = (value, type) => {
  const newValue = +getAsString(value);
  if (isNaN(newValue)) {
    if (type === "min") {
      return 1;
    } else {
      return +100000000000000000000;
    }
  } else {
    return +newValue;
  }
};

const getAsString = (value) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

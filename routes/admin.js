const router = require("express").Router();

const Category = require("../models/category");

router.get("/add-category", (req, res, next) => {
  res.render("admin/add-category", { message: req.flash("success") });
});

router.post("/add-category", (req, res, next) => {
  var category = new Category();
  category.name = req.body.name;

  category.save(function (err) {
    if (err) return next(err);
    req.flash("success", "Successfully added a category");
    return res.redirect("/add-category");
  });
});

module.exports = router;

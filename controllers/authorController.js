const Author = require('../models/author');
const async = require("async");
const Book = require("../models/book");
const { body, validationResult } = require("express-validator");

// display list of all authors
exports.author_list = (req, res, next) => {
  Author.find()
    .sort([["family_name", "ascending"]])
    .exec(function (err, list_authors) {
      if (err) return next(err);
      res.render("author_list", {
        title: "Author List",
        author_list: list_authors,
      });
    });
};

// display detail page for a specific author
exports.author_detail = (req, res, next) => {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.params.id }, "title summary").exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.author == null) {
        const err = new Error("Author not found");
        err.status = 404;
        return next(err);
      }
      res.render("author_detail", {
        title: "Author Detail",
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

// display author create form on GET
exports.author_create_get = (req, res, next) => {
  res.render("author_form", { title: "Create Author" });
};

// handles author create on POST
exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified.")
    .isAlphanumeric()
    .withMessage("Family name has non-alphanumeric characters."),
  body("date_of_death", "Invalid date of Death")
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("author_form", {
        title: "Create Author",
        author: req.body,
        errors: errors.array(),
      });
      return;
    };

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });
    author.save((err) => {
      if (err) return next(err);
      res.redirect(author.url);
    });
  },
];

// handles author delete form on GET
exports.author_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: author delete GET');
};

// handles author delete on POST
exports.author_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: author delete POST');
};

// display author update form on GET
exports.author_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: author update get');
};

// handle author update on POST
exports.author_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: author update POST');
};
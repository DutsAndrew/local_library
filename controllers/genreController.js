const Genre = require("../models/genre");
const Book = require("../models/book");
const async = require("async");
const { body, validationResult } = require('express-validator');
const genre = require("../models/genre");

// Display list of all Genre.
exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort({ name: 1 })
    .exec(function (err, list_genres) {
      if (err) next(err);
      res.render("genre_list", {
        title: "Genre List",
        genre_list: list_genres,
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.genre === null) {
        const err = new Error("Genre not found");
        err.status = 404;
        return next(err);
      }
      res.render("genre_detail", {
        title: "Genre Detail",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = (req, res, next) => {
  res.render("genre_form", { title: "Create Genre" });
};

// Handle Genre create on POST.
exports.genre_create_post = [
  body("name", "Genre name required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    const genre = new Genre({ name: req.body.name });
    
    if (!errors.isEmpty()) {
      res.render("genre_form", {
        title: "Create Genre",
        genre,
        errors: errors.array(),
      });
      return;

    } else {
      Genre.findOne({ name: req.body.name }).exec((err, found_genre) => {
        if (err) return next(err);

        if (found_genre) {
          res.redirect(found_genre.url);

        } else {
          genre.save((err) => {
            if (err) return next(err);
            res.redirect(genre.url);
          });
        };
      });
    };
  }
]

// Display Genre delete form on GET.
exports.genre_delete_get = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id)
          .exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.params.id })
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.genre == null) res.redirect("/catalog/genres");

      // else no errors and genre exists
      res.render("genre_delete", {
        title: "Delete Genre",
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Handle Genre delete on POST.
exports.genre_delete_post = (req, res, next) => {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.body.genreid)
          .exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.body.genreid })
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) return next(err);
      if (results.genre_books.length > 0) {
        res.render("genre_delete", {
          title: "Genre Delete",
          genre: results.genre,
          genre_books: results.genre_books,
        });
        return;
      }

      // if all books have the genre removed 
      Genre.findByIdAndRemove(req.body.genreid, (err) => {
        if (err) return next(err);
        res.redirect("/catalog/genres");
      });
    }
  );
};

// Display Genre update form on GET.
exports.genre_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update GET");
};

// Handle Genre update on POST.
exports.genre_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Genre update POST");
};

const Author = require('../models/author');

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
exports.author_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Author detail: ${req.params.id}`);
};

// display author create form on GET
exports.author_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Author create GET');
};

// handles author create on POST
exports.author_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Author create POST');
};

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
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual('name').get(function () {
  // to avoid errors in cases where other doesn't have family or first name
  // will return empty string
  let fullName = "";
  if (this.first_name && this.family_name) {
    fullName = `${this.family_name}, ${this.first_name}`;
  }
  if (!this.first_name || !this.family_name) {
    fullName = "";
  }
  return fullName;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // no arrow function because we need "this" object
  return `/catalog/author/${this._id}`;
});

module.exports = mongoose.model("Author", AuthorSchema);
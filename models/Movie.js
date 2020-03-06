const mongoose = require('mongoose');
const slugify = require('slugify');

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title']
    },
    slug: String,
    photo: {
      type: String,
      default: 'https://via.placeholder.com/270x360.jpg'
    },
    actors: {
      type: [String],
      required: [true, 'Please add at least 1 actor']
    },
    releaseYear: {
      type: Number,
      required: [true, 'Please add the release year']
    },
    director: {
      type: String,
      required: [true, 'Please add the director']
    },
    budget: {
      type: Number,
      required: [true, 'Please add the budget']
    },
    genres: {
      type: [String],
      required: [true, 'Please add at least 1 genre']
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating must can not be more than 10']
    }
  }
);

MovieSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model('Movie', MovieSchema);
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/v1/movies
// @access  Public
exports.getMovies = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single movie
// @route   GET /api/v1/movies/:id
// @access  Private
exports.getMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({ success: true, data: movie });
});

// @desc    Create movie
// @route   POST /api/v1/movies
// @access  Private
exports.createMovie = asyncHandler(async (req, res) => {
  req.body.user = req.user.id;

  const movie = await Movie.create(req.body);

  res.status(201).json({
    success: true,
    data: movie
  });
});

// @desc    Update movie
// @route   PUT /api/v1/movies/:id
// @access  Private
exports.updateMovie = asyncHandler(async (req, res, next) => {
  let movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404));
  }

  if (req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this movie`, 401));
  }

  await movie.updateOne(req.body, { runValidators: true });

  res.status(200).json({ success: true, data: movie });
});

// @desc    Delete movie
// @route   DELETE /api/v1/movies/:id
// @access  Private
exports.deleteMovie = asyncHandler(async (req, res, next) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    return next(new ErrorResponse(`Movie not found with id of ${req.params.id}`, 404));
  }

  if (req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this movie`, 401));
  }

  movie.remove();

  res.status(200).json({ success: true, data: {} });
});
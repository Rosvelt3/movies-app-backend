const router = require('express').Router();

const {
    getMovies,
    getMovie,
    createMovie,
    updateMovie,
    deleteMovie,
} = require('../controllers/movies');

const Movie = require('../models/Movie');

const advancedResults = require('../middleware/advancedResults');


const { protect, authorize } = require('../middleware/auth');

router.route('/')
    .get(advancedResults(Movie, 'users'), getMovies)
    .post(protect, authorize('admin'), createMovie)

router.route('/:id')
    .get(getMovie)
    .put(protect, authorize('admin'), updateMovie)
    .delete(protect, authorize('admin'), deleteMovie)

module.exports = router;

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const MovieSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        min: 1
    },
    title: {
        type: String,
        required: true,
        trim: true
    }, 
    tagline: String,
    popularity: Number,
    original_language: {
        type: String,
        default: 'en',
    },
    budget: {
        type: Number,
        default: 10000000
    }, 
    revenue: {
        type: String,
        default: 10000000
    },
    runtime: {
        type: Number,
        default: 120
    },
    release_date: {
        type: Date,
        default: '1900-01-01'
    },
    overview: String,
    genres: [{
        id: Number,
        name: String,
    }],
    vote_average: {
        type: Number,
        default: 0
    },
    vote_count: {
        type: Number,
        default: 0
    }
});

MovieSchema.plugin(mongoosePaginate);

const Movie = mongoose.model('Movie', MovieSchema);

module.exports = Movie;
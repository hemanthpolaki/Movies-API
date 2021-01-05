const Movie = require('../Models/Movie');
const axios = require('axios');

// Function fetch movies data from MOVIEDb API.
const FetchMovies = async (limit) => {

    const arr = [];
    for (let i=1; i<=limit; i++) arr.push(i);

    arr.map( async function(i) {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${i+1}?api_key=${process.env.MOVIEDB_API_KEY}`)
            if (response.data) {
                const movie = new Movie(response.data);
                if (movie) { await movie.save(); }
            }
        } catch (error) {
            // console.log({error: error.message});
        }
    });
}

module.exports = FetchMovies;
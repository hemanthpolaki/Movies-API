const Movie = require('../Models/Movie');
const FetchMovies = require('../db/FetchMovies');

const Routes = [

    // GET /api/v1/movies
    // GET /api/v1/movies?page=x&limit=y
    // GET /api/v1/movies?search=field:value
    // GET /api/v1/movies?sortBy=field:order(asc/desc)
    {
        method: 'GET',
        path: '/api/v1/movies',
        handler: async (request, h) => {
            try {
                const {searchQuery, options} = getProperties(request.query);
                const movies = await Movie.paginate(searchQuery, options);
                return h.response({totalDocs: movies.totalDocs, docs: movies.docs}).code(200);
            }
            catch (error) {
                return h.response({error: error.message}).code(500);
            }
        }
    },
    // POST /api/v1/movies
    {
        method: 'POST',
        path:'/api/v1/movies',
        handler: async (request, h) => {
    
            try {
                const movie = new Movie(request.payload);
                const result = await movie.save();
                return h.response(result).code(201);
            }
            catch (error) {
                return h.response({error: error.message}).code(500);
            }
        }
    },
    // PATCH /api/v1/movies/{id}
    {
        method: 'PATCH',
        path: '/api/v1/movies/{id}',
        handler: async (request, h) => {
    
            try {
                const updateFields = Object.keys(request.payload);
                const movieId = request.params.id;
    
                const movie = await Movie.findOne({id: movieId});
                if (!movie) {
                    return h.response({error: 'Check the provided movie id'}).code(400);
                }
                updateFields.forEach(updateField => movie[updateField] = request.payload[updateField]);
                const result = await movie.save();
    
                return h.response(result).code(201);
            }
            catch (error) {
                return h.response({error: error.message}).code(500);
            }
        }
    },
    // PATCH /api/v1/db/fetch?limit=x
    // This handler is for fetching movies data initially to some specified limit.
    {
        method: 'POST',
        path: '/api/v1/db/fetch',
        handler: async (request, h) => {
            try {
                let limit = 50;
                if (request.query.limit) { limit = request.query.limit; };
    
                await FetchMovies(limit);
                return h.response({success: `Data fetched`}).code(201);
            }
            catch (error) {
                return h.response({error: error.message}).code(500);
            }
        }
    },
    // All remaining routes
    {  
        method: ['GET', 'POST', 'PATCH'],
        path: '/{any*}',
        handler: (request, h) => {
            return h.response('Error 404').code(404)
        }
    }
]

// Function for setting search_query and options fields required for fetching data
// as per user's request.
const getProperties = ({search, sortBy, page, limit}) => {
    const searchQuery = {}
    const options = {}
    if (page) { options.page = page }
    if (limit) { options.limit = limit }
    if (search) {
        const parts = search.split(':');
        searchQuery[parts[0]] = parts[1];
    }
    if (sortBy) {
        const parts = sortBy.split(':');
        options.sort = { [parts[0]]: parts[1] === 'desc' ? -1 : 1 }
    }
    return {searchQuery, options}
}

module.exports = Routes;
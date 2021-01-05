const Hapi = require('@hapi/hapi');
require('./db/Mongoose');
const Routes = require('./Routers/Movie');

// Setting server properties
const server = Hapi.server({
    port: process.env.PORT, 
    host: process.env.LOCAL_HOST || '0.0.0.0'
});

// Adding route handlers
server.route(Routes);

// Initializing server
const init = async () => {
    await server.start();
    console.log('Server running on %s', server.info.uri);
};

init();
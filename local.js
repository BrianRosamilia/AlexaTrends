var AlexaAppServer = require('alexa-app-server');
AlexaAppServer.start({
    server_root:__dirname,     // Path to root
    app_dir: "skills",            // Where alexa-app modules are stored
    app_root:"/alexa/",        // Service root
    port:80                    // What port to use, duh
});
const express = require("express");
const app = express();
const livereload = require('livereload');
const connectLivereload = require('connect-livereload');
const path = require('path');

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));


// Pinger nettleseren når serveren har kobblet til
liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
        liveReloadServer.refresh('/');
    }, 100);
});


// Middleware setup
app.use(connectLivereload());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));


const pageRoutes = require('./routes/page_routes');
const apiCoreRoutes = require('./routes/api_core_routes');
const apiModulesRoutes = require('./routes/api_modules_routes');

app.use('/dashboard', pageRoutes);
app.use('/api/core', apiCoreRoutes);
app.use('/api/modules', apiModulesRoutes);


app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on http://localhost:3000/dashboard. To stop the server, press Ctrl + C");
});
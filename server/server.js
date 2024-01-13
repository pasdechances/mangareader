const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');
const bodyParser = require('body-parser')
global.config = require('./conf.json');

const app = express();
const port = global.config.port;

app.use(cors(global.config.cors));
app.use(bodyParser.json());
app.use(bodyParser.json({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
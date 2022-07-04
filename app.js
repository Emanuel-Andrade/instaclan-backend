require('dotenv').config();
require('./src/database/db');
const express = require('express');
const path = require('path');
const cors = require('cors');

const routes = require('./src/routes/routes');

const app = express();
const port = process.env.PORT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use('/uploads', express.static(path.join(__dirname, 'src', '/uploads')));

app.use(routes);

app.listen(port, () => {
  console.log('app is runnig');
  console.log(`http:localhost:${port}`);
});

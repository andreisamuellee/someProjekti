'use strict';
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const passport = require('./utils/pass.js');
const authRoute = require('./routes/authRoute');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('uploads'));
app.use('/thumbnails', express.static('thumbnails'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/auth', authRoute);
app.use('/post',  passport.authenticate('jwt', {session: false}), postRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
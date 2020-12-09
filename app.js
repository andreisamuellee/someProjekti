'use strict';
const express = require('express');
const cors = require('cors');
const fs      = require('fs');
const https = require('https');
const bodyParser = require('body-parser');
const postRoute = require('./routes/postRoute');
const userRoute = require('./routes/userRoute');
const passport = require('./utils/pass.js');
const authRoute = require('./routes/authRoute');
const getpostsRoute = require('./routes/getpostsRoute');
const app = express();
const port = 3000;

app.enable('trust proxy');

app.use(cors());
app.use(express.static('public'));

app.use('/thumbnails', express.static('thumbnails'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

if (process.env.NODE_ENV === 'production') {
    app.use((req, res, next) => {
      if (req.secure) {
        // request was via https, so do no special handling
        next();
      } else {
        // if express app run under proxy with sub path URL
        // e.g. http://www.myserver.com/app/
        // then, in your .env, set PROXY_PASS=/app
        // Adapt to your proxy settings!
        const proxypath = process.env.PROXY_PASS || '';
        // request was via http, so redirect to https
        console.log(`https://${req.headers.host}${proxypath}${req.url}`);
        res.redirect(301, `https://${req.headers.host}${proxypath}${req.url}`);
      }
    });
  }

app.use('/auth', authRoute);
app.use('/getposts', getpostsRoute);
app.use('/post',  passport.authenticate('jwt', {session: false}), postRoute);
app.use('/user', passport.authenticate('jwt', {session: false}), userRoute);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

// if production, add https, with this if no need to install certs locally
if (process.env.NODE_ENV === 'production') {
    const sslkey = fs.readFileSync('/etc/pki/tls/private/ca.key');
    const sslcert = fs.readFileSync('/etc/pki/tls/certs/ca.crt');
    const options = {
      key: sslkey,
      cert: sslcert
    };
    https.createServer(options, app).listen(8000,
        () => console.log(`HTTPS on port ${8000}!`)); //https traffic
  }
const express = require('express')
const path = require('path')
const cors  = require('cors')
const PORT = process.env.PORT || 5000
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

var app = express();
app.use(express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.get('/', (req, res) => res.render('pages/index'))
app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
app.use(express.static(__dirname + 'public'));

var corsOptions = {
  origins: [
    "file:///C:/Users/Tarandeep/Desktop/JJJK/party_information.html",
    "http://jjjk.mebonix.in"
  ],
  credentials: true,
  optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.set('json spaces',2);
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));

app.use(require('./apis_router'));
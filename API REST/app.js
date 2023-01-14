const express = require('express');
const session = require('express-session');

const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const bodyParser = require('body-parser');
const { tacheGet, tachePost, tacheDelete, tachePut} = require('./tacheController');
const { signIn, login, logout, isConnected } = require("./authController")
const { listeGet, ListeTacheGet } = require("./listeController")
const cors = require('cors')

const url = "mongodb://127.0.0.1:27017/";
const app = express();
const port = 3000;


app.use(session({
    secret: "chut, c'est un secret",
    name: "cookieTacheApplication"
}));


app.use(bodyParser.json());


app.use(cors({ credentials: true, origin: 'http://localhost:4200' }))

function checkSignIn(req, res, next) {
    if (req.session.user) {
        next(); //Si la session existe on passe à la callback suivante
    } else {
        res.status(401).send("Unauthorized");
    }
}


app.post('/signin', signIn);
app.post('/login', login);
app.post('/logout', logout);
app.get('/isConnected', checkSignIn, isConnected);

app.get('/listes', checkSignIn, listeGet);
app.get('/listes/:id', checkSignIn, ListeTacheGet);

app.get('/taches', checkSignIn, tacheGet);
app.post('/taches', checkSignIn, tachePost);
app.delete('/taches/:id', checkSignIn, tacheDelete);
app.put('/taches/:id', checkSignIn, tachePut);


app.listen(port, () => {
    console.log(`L'application écoute le port ${port}`)
})
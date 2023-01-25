const express = require('express');
const app = express()
const port = 3000
app.use(express.json());
app.use('/site', express.static('site'))

let MongoClient = require('mongodb').MongoClient;
let mongodb = require('mongodb');

let url = "mongodb://127.0.0.1:27017/";


app.get('/taches', async(req, res, next) => {
    try {
        let db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        let datas = await dbo.collection("taches").find({}).toArray();
        res.status(200).json(datas);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
});


app.delete('/taches/:id', async(req, res, next) => {
    try {
        let db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        let datas = await dbo.collection("taches").deleteOne({ _id: mongodb.ObjectId(req.params.id) });
        res.status(200).json(datas);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
});

app.post("/taches", (req, res, next) => {
    let tache = req.body; // { "titre": titre, "termine":false }
    console.log(tache);
    MongoClient.connect(url).then((db) => {
        let dbo = db.db("taches");
        return dbo.collection("taches").insertOne(tache);
    }).then((data) => {
        res.status(200).json(data);
    }).catch((err) => {
        res.status(500).json({ message: err })
    });
});

app.put('/taches/:id', async(req, res, next) => {
    let tache = req.body; // { "titre": titre, "termine":false }
    try {
        let db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        console.log(req.params)
        let retour = await dbo.collection("taches").updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: tache });
        res.status(200).json({ ok: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
});

app.listen(port, () => {
    console.log(`L'application écoute le port ${port}`)
})
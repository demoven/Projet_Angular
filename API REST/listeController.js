const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const url = "mongodb://127.0.0.1:27017/";

exports.listeGet = async function (req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        console.log(req.params.id)
        let user = await dbo.collection("utilisateur").findOne({ _id: new ObjectId(req.params.id) });
        const listeIds = user.listeIds.map(l => new ObjectId(l));
        let listeObject = await dbo.collection("listes").find({ _id: { $in: listeIds } }).toArray();
        for (let i = 0; i < listeObject.length; i++) {
            const liste = listeObject[i];
            if(liste.taches){
            const taches = liste.taches.map(t => new ObjectId(t));
            liste.tachesliste = await dbo.collection("taches").find({ _id: { $in: taches } }).toArray();
            }
            
        }
        res.status(200).json(listeObject);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    } 
};

exports.listePost = async function (req, res) {
    let liste = req.body;
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        await dbo.collection("listes").insertOne(liste);
        res.status(200).json(liste);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
};

exports.listeDelete = async function (req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        await dbo.collection("listes").deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
};

exports.listePut = async function (req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        await dbo.collection("listes").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $set: { titre: req.body.titre, taches: req.body.taches } });
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
};

exports.UserInfo = async function(req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        let user = await dbo.collection("utilisateur").findOne({ login: req.session.user });
        //renvoyer l'id de l'utilisateur et la listeIds
        res.status(200).json({ _id:new mongodb.ObjectId(user._id), login:"",password:"",listeIds: user.listeIds });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err });
    }
}

exports.userPut = async function (req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        await dbo.collection("utilisateur").updateOne({ _id: new mongodb.ObjectId(req.params.id) }, { $set: { listeIds: req.body.listeIds } });
        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
}

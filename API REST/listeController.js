const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId;
const url = "mongodb://127.0.0.1:27017/";






exports.listeGet = async function (req, res) {
    try {
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        let datas = await dbo.collection("listes").find({}).toArray();
        res.status(200).json(datas);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
};

exports.ListeTacheGet = async function (req, res) {
    try {
        const listeId = new ObjectId(req.params.id);
        db = await MongoClient.connect(url);
        let dbo = db.db("taches");
        const listeObject = await dbo.collection("listes").findOne({ _id: listeId });
        if(listeObject){
            const taches = listeObject.taches.map(t => new ObjectId(t));
            const tachesObject = await dbo.collection("listes").aggregate([
                { $match: { _id: listeId } },
                {
                    $lookup: {
                        from: "taches",
                        let : { taches: taches },
                        pipeline: [
                            { $match: { $expr: { $in: ["$_id", "$$taches"] } } }
                        ],
                        as: "tachesliste"
                    }
                }
            ]).toArray();
        res.status(200).json(tachesObject);
        } 

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err })
    }
};




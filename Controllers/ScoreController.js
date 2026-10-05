const ScoreLog = require('../Models/ScoreLog');

exports.saveScore = async (req, res) => {
    try {
        const userId = req.params.userId;
        const newScore = new ScoreLog({
            ...req.body,
            userId: userId
        });
        const savedScore = await newScore.save();
        res.status(201).json(savedScore);
    } catch (error) {
        console.error("Erreur lors de la sauvegarde du score :", error);
        res.status(500).json({ message: "Erreur lors de la sauvegarde du score" });
    }
};

exports.getScoresByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const scores = await ScoreLog.find({ userId: userId }).sort({ date: -1 });
        res.status(200).json(scores);
    } catch (error) {
        console.error("Erreur lors de la récupération des scores :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des scores" });
    }
};

exports.getScoresBySpecificId = async (req, res) => {
    try {
        const specificId = req.params.specificId;
        const scores = await ScoreLog.find({ specificId: specificId }).sort({ date: -1 });
        res.status(200).json(scores);
    } catch (error) {
        console.error("Erreur lors de la récupération des scores du patient :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des scores" });
    }
};

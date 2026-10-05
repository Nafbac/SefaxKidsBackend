const ChildRecord = require('../Models/ChildRecord1');

// Contrôleur pour récupérer toutes les fiches enfants de l'utilisateur par son ID
exports.getAllChildRecords = async (req, res) => {
    try {
        const userId = req.params.userId; // Récupérer l'ID de l'utilisateur depuis la requête
        const childRecords = await ChildRecord.find({ userId });
        res.status(200).json(childRecords);
    } catch (error) {
        console.error("Erreur lors de la récupération des fiches enfant de l'utilisateur :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des fiches enfant de l'utilisateur" });
    }
};

// Contrôleur pour récupérer une fiche enfant par son ID et l'ID de l'utilisateur
exports.getChildRecordById = async (req, res) => {
    try {
        const userId = req.params.userId; // Récupérer l'ID de l'utilisateur depuis la requête
        const childRecord = await ChildRecord.findOne({ _id: req.params.id, userId });
        if (!childRecord) {
            return res.status(404).json({ message: 'Fiche enfant non trouvée' });
        }
        res.status(200).json(childRecord);
    } catch (error) {
        console.error("Erreur lors de la récupération de la fiche enfant par son ID :", error);
        res.status(500).json({ message: "Erreur lors de la récupération de la fiche enfant par son ID" });
    }
};

// Contrôleur pour mettre à jour une fiche enfant
exports.updateChildRecord = async (req, res) => {
    try {
        const userId = req.params.userId; // Récupérer l'ID de l'utilisateur depuis la requête
        const updatedRecord = await ChildRecord.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true });
        if (!updatedRecord) {
            return res.status(404).json({ message: 'Fiche enfant non trouvée' });
        }
        res.status(200).json(updatedRecord);
    } catch (error) {
        console.error("Erreur lors de la mise à jour de la fiche enfant :", error);
        res.status(500).json({ message: "Erreur lors de la mise à jour de la fiche enfant" });
    }
};

// Contrôleur pour supprimer une fiche enfant
exports.deleteChildRecord = async (req, res) => {
    try {
        const userId = req.params.userId; // Récupérer l'ID de l'utilisateur depuis la requête
        const deletedRecord = await ChildRecord.findOneAndDelete({ _id: req.params.id, userId });
        if (!deletedRecord) {
            return res.status(404).json({ message: 'Fiche enfant non trouvée' });
        }
        res.status(200).json({ message: 'Fiche enfant supprimée avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression de la fiche enfant :", error);
        res.status(500).json({ message: "Erreur lors de la suppression de la fiche enfant" });
    }
};

// Contrôleur pour créer une nouvelle fiche enfant
exports.createChildRecord = async (req, res) => {
    try {
        const userId = req.params.userId; // Récupérer l'ID de l'utilisateur depuis la requête
        const newChildRecord = new ChildRecord(req.body);
        newChildRecord.userId = userId; // Définir l'ID de l'utilisateur pour la nouvelle fiche enfant
        const savedRecord = await newChildRecord.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        console.error("Erreur lors de la création de la fiche enfant :", error);
        res.status(500).json({ message: "Erreur lors de la création de la fiche enfant" });
    }
};

// Contrôleur pour rechercher une fiche enfant par son specificId (pour les soignants)
exports.lookupBySpecificId = async (req, res) => {
    try {
        const specificId = req.params.specificId;
        const childRecord = await ChildRecord.findOne({ specificId: specificId });
        if (!childRecord) {
            return res.status(404).json({ message: 'Fiche enfant non trouvée avec ce specificId' });
        }
        res.status(200).json(childRecord);
    } catch (error) {
        console.error("Erreur lors de la recherche par specificId :", error);
        res.status(500).json({ message: "Erreur lors de la recherche par specificId" });
    }
};
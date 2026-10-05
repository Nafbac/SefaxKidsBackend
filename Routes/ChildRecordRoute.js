const express = require('express');
const router = express.Router();
const cors = require('cors');
const ChildRecordController = require('../Controllers/ChildRecordController1');

// Route pour créer une nouvelle fiche enfant
router.post('/childRecords/:userId', ChildRecordController.createChildRecord);

// Route pour rechercher une fiche enfant par son specificId (pour les soignants)
router.get('/childRecords/lookup/:specificId', ChildRecordController.lookupBySpecificId);

// Route pour récupérer toutes les fiches enfants de l'utilisateur
router.get('/childRecords/:userId', ChildRecordController.getAllChildRecords);

// Route pour récupérer une fiche enfant par son ID
router.get('/childRecords/:id', ChildRecordController.getChildRecordById);

// Route pour mettre à jour une fiche enfant
router.put('/childRecords/:id', ChildRecordController.updateChildRecord);

// Route pour supprimer une fiche enfant
router.delete('/childRecords/:id', ChildRecordController.deleteChildRecord);


module.exports = router;
const mongoose = require('mongoose');

const scoreLogSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    specificId: { type: String, required: true }, // The child's specific ID
    exerciseName: { type: String, required: true },
    score: { type: Number, required: true },
    durationSeconds: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

const ScoreLog = mongoose.model('ScoreLog', scoreLogSchema);
module.exports = ScoreLog;

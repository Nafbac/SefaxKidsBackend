require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const UsersRoutes = require('./Routes/userRoute');
const cors = require('cors');
const errorHandler = require('./utils/errorHandler');
const ChildRecordRouter = require('./Routes/ChildRecordRoute');
const ScoreRouter = require('./Routes/ScoreRoute');

const connectDB = require('./Config/dbConfig');
const app = express();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Express server is up and running.');
});
app.use('/', UsersRoutes);
app.use('/', ChildRecordRouter);
app.use('/scores', ScoreRouter);

//const PORT = 5000 ;
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});

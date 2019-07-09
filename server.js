require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

// body-parser
app.use(express.json());

const port = process.env.PORT || 3000;

// METHOD + PATH LOGGER

app.use((req, res, next) => {
    console.log(`${req.method} @ ${req.path}`);
    next();
})


// Connectiong MongoDB
const db = process.env.db;
mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected successfully...'))
    .catch(err => console.log(err)); 

app.use('/api/users', require('./routes/sign/users'));
app.use('/api/auth', require('./routes/sign/auth'));
app.use('/api/messages', require('./routes/dialogues/messages'));

// Serve static if in production
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build', 'index.html'))
    })
}

// 404 Middleware
app.use((req, res, next) => {
    res
        .status(404)
        .type('text')
        .send('Not found');
});

app.listen(port || 3000, () => {
    console.log(`Server listening on port ${port}`);
})
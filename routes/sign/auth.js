const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User')

// Auth a user POST @ /api/users
router.post('/', (req, res) => {
    const {name, password} = req.body;
    User
        .findOne({name})
        .then(user => {
            if (!user) 
                res.status(400).json({message: 'User does not exist!'})
            else {
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch) 
                            return res.status(400).json({message: 'Wrong password!'})
                        jwt.sign({
                            id: user.id
                        }, process.env.jwtSecret, (err, token) => {
                            if (err) 
                                throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            })
                        })
                    })
            }
        })
})

// Get user data
// Private
router.get('/user', auth, (req, res) => {
    User
        .findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
})

module.exports = router;
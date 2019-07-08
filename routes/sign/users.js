const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../../models/User')

// Register a user POST @ /api/users

router.post('/', (req, res) => {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res
            .status(400)
            .json({message: 'Please, enter all fields.'});

    } else {
        User
            .findOne({email})
            .then(user => {
                if (user) 
                    res.status(400).json({message: 'Email already in use!'})
                else {
                    User
                        .findOne({name})
                        .then(user => {
                            if (user) 
                                res.status(400).json({message: 'Username already in use!'})
                            else {
                                const newUser = new User({name, email, password});
                                console.log(newUser)
                                // salt & hash
                                bcrypt.genSalt(10, (err, salt) => {
                                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                                        if (err) 
                                            throw err;
                                        newUser.password = hash;
                                        newUser
                                            .save()
                                            .then(user => {
                                                jwt.sign(
                                                    {id: user.id},
                                                    process.env.jwtSecret,
                                                    (err, token) => {
                                                        if (err) throw err;
                                                        res.json({
                                                            token,
                                                            user: {
                                                                id: user.id,
                                                                name: user.name,
                                                                email: user.email
                                                            }
                                                        })
                                                    }
                                                )
                                            })
                                    })
                                })
                            }
                        })
                }
            })
    }
})

// Get all users /api/users/all_users
router
    .get('/all_users', (req, res) => {
        User
            .find()
            .select('name')
            .then(docs => {
                res.json(docs);
            })
    })

module.exports = router;
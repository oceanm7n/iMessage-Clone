const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User');
const Dialogue = require('../../models/Dialogue');
const Message = require('../../models/Message');

// async foreach
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// Get recents
router.get('/recents', auth, async(req, res) => {
    const myId = req.user.id;

    try {
        const dialogues = await Dialogue.find({members: myId});

        let recents = [];

        await asyncForEach(dialogues, async(dialogue) => {
            let dialogueId = dialogue._id;

            // Partner ID
            let userId = dialogue
                .members
                .filter(member => String(member) !== String(myId))[0];

            const user = await User.findOne({_id: userId});
            if (user) {
                // User with such ID exists => get common messages
                const lastMessage = await Message.findOne({
                    dialogueId
                }, {}, {
                    sort: {
                        '_id': -1
                    }
                });

                // Dialogue exists, but empty
                if (!lastMessage) 
                    recents.push({user: user.name, message: '<empty>', id: dialogueId});
                else // Dialogue exists, not empty
                    recents.push({user: user.name, message: lastMessage.body, id: dialogueId});
                }
            else {
                res
                    .status(500)
                    .json({message: 'No user found'})
            }
        })
        res.json(recents);
    } catch (err) {
        console.log(err);
    }
})

// Get messages by DIALOGUE ID !
router.get('/dialogue/:sel', auth, async(req, res) => {
    // Pulling request data
    const dialogueId = req.params.sel;
    const myId = req.user.id;

    // Page not specified
    const page = req.query.page;

    if (!dialogueId || !myId) 
        return res.status(400).json({message: 'Not all ids specified'});
    
    try {
        // Total number of messages

        const messages = await Message
            .find({dialogueId})
            .sort('-created_on')
            .skip((page - 1) * 20)
            .limit(20);
        let returnValue = {};
        returnValue.messages = messages.map(msg => ({
            body: msg.body,
            created_on: msg.created_on,
            id: msg._id,
            isMine: String(msg.author) == String(myId)
                ? true
                : false
        }))
        const dialogue = await Dialogue.findById(dialogueId);
        returnValue.user_id = dialogue
            .members
            .filter(member => String(member) !== String(myId));
        res.json(returnValue);
    } catch (err) {
        console.log(err);
    }
})

// Create a new dialogue
router.post('/new_dialogue/:sel', auth, (req, res) => {
    const myId = req.user.id;
    const partnerId = req.params.sel;
    Dialogue
        .findOne({
        members: {
            $all: [partnerId, myId]
        }
    })
        .then(dialogue => {
            if (dialogue) 
                return res.json({dialogue_id: dialogue._id});
            const newDialogue = new Dialogue({
                members: [myId, partnerId]
            });
            newDialogue
                .save()
                .then(dialogue => {
                    res.json({dialogue_id: dialogue._id});
                })
        })

})

// Send a new message to USER_ID!
router.post('/new_message/:sel', auth, (req, res) => {
    const partnerId = req.params.sel;
    const myId = req.user.id;
    const body = req.body.message;

    if (!partnerId || !myId) 
        return res.status(400).json({message: 'Not all ids specified'});
    if (!body) 
        return res.status(400).json({messaeg: "Can't send an empty message!"});
    if (partnerId === myId) 
        return res.status(400).json({message: `You can't sent messages to yourself!`})
        // Finding a user
    User
        .findById(partnerId)
        .then(user => {
            if (user) {
                // User found
                Dialogue
                    .findOne({
                    members: {
                        $all: [partnerId, myId]
                    }
                })
                    .then(dialogue => {
                        if (dialogue) {
                            // Dialogue exists
                            const dialogueId = dialogue._id;
                            const newMessage = new Message({
                                dialogueId,
                                author: myId,
                                body,
                                created_on: Date.now()
                            });
                            newMessage
                                .save()
                                .then(msg => {
                                    res.json({msg})
                                })
                                .catch(err => {
                                    console.log(err)
                                    res
                                        .status(500)
                                        .json({message: 'Something went wrong! Check server console.'})
                                })
                        } else {
                            // Dialogue does not exist, creating a new one
                            const newDialogue = new Dialogue({
                                members: [myId, partnerId]
                            })
                            newDialogue
                                .save()
                                .then(dialogue => {
                                    const dialogueId = dialogue._id;
                                    const newMessage = new Message({
                                        dialogueId,
                                        author: myId,
                                        body,
                                        created_on: Date.now()
                                    });
                                    newMessage
                                        .save()
                                        .then(msg => {
                                            res.json({msg})
                                        })
                                        .catch(err => {
                                            console.log(err)
                                            res
                                                .status(500)
                                                .json({message: 'Something went wrong! Check server console.'})
                                        })
                                })
                                .catch(err => {
                                    console.log(err)
                                    res
                                        .status(500)
                                        .json({message: 'Something went wrong! Check server console.'})
                                })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                        res
                            .status(500)
                            .json({message: 'Something went wrong! Check server console.'})
                    });
            } else 
                res
                    .status(400)
                    .json({message: 'User does not exist!'});
            }
        )
        .catch(err => {
            console.log(err)
            res
                .status(500)
                .json({message: 'Something went wrong! Check server console.'})
        })
})

module.exports = router;
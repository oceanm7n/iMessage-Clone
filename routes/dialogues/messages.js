const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

// User Model
const User = require('../../models/User');
const Dialogue = require('../../models/Dialogue');
const Message = require('../../models/Message');

// Async foreach
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// Get recents
router.get('/recents', auth, async(req, res) => {
    // Pulling out query variables
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
    // Pulling out query variables
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
router.post('/new_dialogue/:sel', auth, async(req, res) => {
    // Pulling out query variables
    const myId = req.user.id;
    const partnerId = req.params.sel;

    try {
        // Finding a dialogue
        const dialogue = await Dialogue.findOne({
            members: {
                $all: [partnerId, myId]
            }
        });

        // Dialogue already exists, sending its _id to client
        if (dialogue) 
            return res.json({dialogue_id: dialogue._id});

        // Creating a new dialogue and sending it's _id to client
        const newDialogue = new Dialogue({
            members: [myId, partnerId]
        });
        const id = await newDialogue.save();
        res.json({dialogue_id: id._id});
    } catch (err) {
        console.log(err);
    }
})

// Send a new message to USER_ID!
router.post('/new_message/:sel', auth, async(req, res) => {
    // Pulling out query variables
    const partnerId = req.params.sel;
    const myId = req.user.id;
    const body = req.body.message;

    // Handling bad queries
    if (!partnerId || !myId) 
        return res.status(400).json({message: 'Not all ids specified'});
    if (!body) 
        return res.status(400).json({messaeg: "Can't send an empty message!"});
    if (partnerId === myId) 
        return res.status(400).json({message: `You can't sent messages to yourself!`});
    
    try {
        const user = await User.findById(partnerId);
        
        // User not found
        if (!user)
            return res.status(400).json({message: 'User does not exist!'});
        
        const dialogue = await Dialogue.findOne({
            members: {
                $all: [partnerId, myId]
            }
        });

        if (dialogue) {
            // Dialogue exists

            const dialogueId = dialogue._id;
            const newMessage = new Message({
                dialogueId,
                author: myId,
                body,
                created_on: Date.now()
            });

            const msg = await newMessage.save();
            res.json({msg});

        } else {
            // Dialogue does not exist, creating a new one

            const newDialogue = new Dialogue({
                members: [myId, partnerId]
            })

            const savedNewDialogue = await newDialogue.save();
            const dialogueId = savedNewDialogue._id;
            const newMessage = new Message({
                dialogueId,
                author: myId,
                body,
                created_on: Date.now()
            });
            const msg = await newMessage.save();
            res.json({msg})
        }
    } catch (err) {
        res.status(500).json({message: 'Something went wrong! Check server console.'});
        console.log(err);
    }
})

module.exports = router;
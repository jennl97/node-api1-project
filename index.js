// implement your API here
//import Nodejs
const express = require('express');

//import database
const db = require('./data/db');


//create server
const server = express();

//set port
server.listen(4000, () => {
    console.log('===server listening on port 4000 ===')
});

//middleware
server.use(express.json());

//make sure server is working
server.get('/', (req, res) => {
    res.send('It works!');
});

//GET Returns an array of all the user objects contained in the database.
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json(users);
        })
        .catch(err => {
            res.status(500).json({
                error: "There was an error while saving the user to the database" 
            })
        })
});

//GET Returns the user object with the specified id.
server.get('/api/users/:id', (req, res) => {
    const id= req.params.id;
    db.findById(id)
        .then(users => {
            if(users){
                res.status(200).json({success: true, users});
            } else {
                res.status(404).json({
                    success: false,
                    message: "The user with the specified ID does not exist."
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                error: "The user information could not be retrieved."
            })
        })
});

//POST Creates a user using the information sent inside the request body.
server.post('/api/users', (req, res) => {
    const userInfo = req.body;
    // console.log(userInfo);

    db.insert(userInfo)
        .then(user => {
            if(!user.name || !user.bio){
                res.status(400).json({
                    errorMessage: "Please provide name and bio for the user." 
                })
            } else {
                res.status(201).json(user)
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "There was an error while saving the user to the database"
            })
        })
});

//DELETE Removes the user with the specified id and returns the deleted user.
server.delete('/api/users/:id', (req, res) => {
    const id= req.params.id;
    db.remove(id)
        .then(user => {
            if(!user){
                res.status(404).json({
                    message: "The user with the specified ID does not exist."
                })
            } else {
                res.status(204).end();
            }
            
        })
        .catch(err => {
            res.status(500).json({
                error: "The user could not be removed"
            })
        })
});

//PUT Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.
server.put('/api/users/:id', (req, res) => {
    const id= req.params.id;
    const userInfo = req.body;

    db.update(id, userInfo)
        .then(user => {
            if(!user){
                res.status(404).json({
                    message: "The user with the specified ID does not exist."
                })
            } else if (!user.name || !user.bio){
                res.status(400).json({
                    errorMessage: "Please provide name and bio for the user."
                })
            } else {
                res.status(200).json(user)
            }
        })
        .catch(err => {
            res.status(500).json({
                error: "The user information could not be modified."
            })
        })

})
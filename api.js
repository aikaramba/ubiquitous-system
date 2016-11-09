const express = require("express");
const uuid = require("node-uuid");
const _ = require("lodash");
let rooms = require("./data/rooms.json");
let messages = require("./data/messages.json");
const users = require("./data/users.json");

let router = express.Router();
module.exports = router;

router.get("/rooms", (req, res) => {
    res.json(rooms);
});

router.route("/rooms/:roomId/messages")
    .get((req, res) => {
        let roomId = req.params.roomId;
        let roomMessages = messages
            .filter(m => m.roomId == roomId)
            .map(m => {
                let user = _.find(users, u => u.id === m.userId);
                return {text: `${user.name} : ${m.text}`}
            });
        let room = _.find(rooms, r => r.id === roomId);
        if(!room){
            next(new Error("Oh no"));
            res.sendStatus(404);
            return;
        }

        res.json({
            room: room,
            messages: roomMessages
        });
    })
    .post((req, res) => {
        let roomId = req.params.roomId;
        let message = {
            roomId: roomId,
            text: req.body.text,
            userId: req.user.id,
            id: uuid.v4()
        };

        messages.push(message);
        res.sendStatus(200);
    })
    .delete((req, res) => {
        let roomId = req.params.roomId;

        messages = messages.filter(m => m.roomId !== roomId);

        res.sendStatus(200);
    });
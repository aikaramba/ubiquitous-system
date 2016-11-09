const express = require("express");
const uuid = require("node-uuid");
const _ = require("lodash");

let rooms = require("./data/rooms.json");

let router = express.Router();
module.exports = router;

router.use((req, res, next) => {
    if(req.user.admin) {
        next();
        return;
    }
    res.redirect('/login');
});


// all rooms hub
router.get('/rooms', (req, res) => {
    res.render("rooms", {
        title: "Admin Rooms",
        rooms: rooms,
        baseUrl: req.baseUrl
    });
});
// adding new room
router.route('/rooms/add')
    .get((req, res) => {
        res.render("add", {baseUrl: req.baseUrl});
    })
    .post((req, res) => {
        let room = {
            name : req.body.name,
            id : uuid.v4()
        };
        rooms.push(room);
        res.redirect(req.baseUrl + "/rooms");
    });
// editing a room name
router.route('/rooms/edit/:id')
    .all((req, res, next) => {
        let roomId = req.params.id;

        let room = _.find(rooms, r => r.id === roomId);
        if(!room){
            next(new Error("Oh no"));
            res.sendStatus(404);
            return;
        }
        res.locals.room = room;
        res.locals.baseUrl = req.baseUrl;
        next();
    })
    .get((req, res) => {
        res.render("edit");
    })
    .post((req, res) => {
        res.locals.room.name = req.body.name;

        res.redirect(req.baseUrl + "/rooms");
    });
// deleting a room
router.get('/rooms/delete/:id', (req, res) => {
    let roomId = req.params.id;

    rooms = rooms.filter(r => r.id !== roomId);

    res.redirect(req.baseUrl + "/rooms");
});

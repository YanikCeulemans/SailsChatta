/**
 * RoomController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

    postMessage: function(req, res){
        var message = req.param('message');
        if (message){
            Room.findOne(2).done(function(err, room){
                    if (!room.messages){
                        room.messages = [];
                    }
                    room.messages.push(message);
                    room.save(function(err){
                            res.json(room);
                        });
                });
        }else{
            res.send('no message paramater defined', 500);
        }
    }


};

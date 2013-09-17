/**
 * MessageController
 *
 * @module      :: Controller
 * @description :: Contains logic for handling requests.
 */

function logError(res, err) {
    res.send('Something went wrong...', 500);
    console.log('Error ocurred: ', err);
    return;
};

module.exports = {

    // TODO: Check for nulls !
    createMsg: function(req, res) {
        var roomId = req.param('room'),
            userId = req.param('user'),
            content = req.param('content');

        Message.create({
            user: userId,
            room: roomId,
            content: content
        }).done(function(err, message) {
            if (err) {
                logError(res, err);
            } else {
                var resultModel = message;
                User.findOne(resultModel.user).done(function(err, user) {
                    if (err) {
                        logError(res, err);
                    } else {
                        resultModel.username = user.nickname;
                        res.json(resultModel);
                        sails.io.sockets.emit('MsgCreatedRoom' + roomId, message);
                    }
                });
            }
        });

    },
    getMessagesByRoom: function(req, res) {
        var roomId = req.param('roomid');
        var returnModel = [];

        if ( !! !roomId) {
            res.send('please specify the roomId');
            return;
        }
        // we have to manually subscribe our req's socket object to the Message model
        Message.subscribe(req.socket);
        Message.findByRoom(roomId).limit(10).done(function(err, messages) {
            if (err) {
                logError(res, err);
            } else {
                returnModel = messages;
                for (var i = 0; i < returnModel.length; i++) {
                    var m = returnModel[i];
                    User.findOne(m.user).done(function(err, user) {
                        if (err) {
                            logError(res, err);
                        } else {
                            m.username = user.nickname;
                        }
                    });
                };
                res.json(returnModel);
            }
        })
    }

};
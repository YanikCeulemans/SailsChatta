/**
 * MessageController
 *
 * @module      :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {

    getMessagesByRoom: function(req, res) {
        var roomId = req.param('roomid');

        if(!!!roomId){
            res.send('please specify the roomId', 500);
        }
        console.log('Room id is: ', roomId);
        Message.find({
            where: {
                content: {
                    contains: 'test' // TODO: Continue from here ... we need to get the chat rooms by id !
                }
            }
        }).limit('10').done(function (err, messages) {
            if (err){
                // error handling...
                console.log(err);
            }else{
                console.log('sending messages: ', messages);
                res.json(messages);
            }
        })
    }


};
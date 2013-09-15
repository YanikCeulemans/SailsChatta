/**
 * MessageController
 *
 * @module      :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  addMessage: function (req, res) {
      var userId = req.param('userid');
      var roomId = req.param('roomid');

      Message.create({
        user: userId,
        room: roomId
      }).done(function (err, message) {
          if (err){
            return console.log(err);
          }else{
            console.log('message created: ', message);
          }
      });
  }
  

};

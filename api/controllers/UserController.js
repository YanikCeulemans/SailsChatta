/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  sayHello: function (req, res) {
    res.send('hello world!');
  },
  create: function (req, res) {
      var nickname = req.param('nickname');
      if (nickname){
          User.create({
                  nickname: nickname
              }).done(function(err, user){
                      if (err || !user){
                          res.json(err, 500);
                      }else{
                          res.send('User created: ' + user);
                      }
                  });
          }else{
              res.send('no nickname was passed',500);
          }
  }

};

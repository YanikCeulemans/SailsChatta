/**
 * UserController
 *
 * @module      :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {

    getUserByName: function(req, res) {
        var name = req.param('name');

        User.find({
            nickname: name
        }).done(function (err, user) {
            res.json(user);
        });
    },
    uniqueCreate: function (req, res) {
        var nickname = req.param('nickname');

        if (!!!nickname){
            res.send('Please provide a nickname');
        }else{
            User.findOneByNickname(nickname).done(function (err, user) {
                if (err) {
                    console.log(err);
                }else{
                    if (user){
                        //TODO: check by IP if this username belongs to the user (I don't want users to have to register)
                        // If the username does belong to the user, return the user...
                        res.json(user);
                        // res.send('that username already exists ... sry :(');
                    }else{
                        User.create({
                            nickname: nickname
                        }).done(function (err, newUser) {
                            if (err){
                                console.log('error occured when trying to create user: ', err);
                            }else{
                                res.json(newUser);
                            }
                        });
                    }
                }
            })
        }
    }

};
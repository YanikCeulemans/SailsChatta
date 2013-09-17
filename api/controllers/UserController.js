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
    }

};
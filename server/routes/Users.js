const DbSvc = require('../services/Db.js');
const AuthSvc = require('../services/Auth.js');
const UserSvc = require('../services/Users.js');

exports.getUsers = (async function (req, res) {
    const db = await DbSvc.connectToDB();
    const users = await UserSvc.getAllUsers(db);
    db.end();
    if(users) {
        res.status(200).send(users);
        return true;
    } else {
        res.status(404).send({ message: "Couldn't get users"});
        return false;
    }
})

exports.getUserByUsername = (async function (req, res) {
    const db = await DbSvc.connectToDB();
    const user = await UserSvc.getUserByUsername(db, req.params.username);
    db.end();
    if(user) {
        res.status(200).send(user);
        return true;
    } else {
        res.status(404).send({ message: "Couldn't get user"});
        return false;
    }
})

exports.createUser = (async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    const hashAndSalt = AuthSvc.hashPassword(password);
    const db = await DbSvc.connectToDB();
    const newUserID = UserSvc.addUser(db, username, hashAndSalt.hash, hashAndSalt.salt);

    if(!newUserID) {
        res.status(404).json({
            auth: false,
            added: false,
        });
        return false;
    }

    const user = await UserSvc.getUserByUsername(db, username);
    const token = await AuthSvc.validateUser(username, password, user);
    console.log(user);
    console.log(token);
    const success = user && token;
    const status = success ? 200 : 404;

    res.status(status).json({
      auth: success,
      token: success ? token : null,
      result: success ? user : null,
      added: true,
    });

   return success;
})

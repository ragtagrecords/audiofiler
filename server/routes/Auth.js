const DbSvc = require('../services/Db.js');
const UserSvc = require('../services/Users.js');
const AuthSvc = require('../services/Auth.js');

// The user objects returned here explicitly do not include the hashed password and salt.
// DO NOT return the whole user object, always use destructuring to return the columns you want.

exports.authorize = (async function (req, res) {
    const username = req.body.username;
    const password = req.body.password;
    
    const db = await DbSvc.connectToDB();
    const user = await UserSvc.getUserByUsername(db, username);
    const token = await AuthSvc.validateUser(username, password, user);
    db.end();

    if (!token) {
        res.status(404).json({ auth: false });
        return false;
    } else {
        res.status(200).json({
            auth: true,
            token: token,
            user: {
                id: user.id,
                username: user.username,
                createTimestamp: user.createTimestamp
            }
        });
        return true;
    }
})

exports.authenticate = (async function (req, res) {
  try {
    if(!req.userID) {
        throw new Error('No userID found');
    }

    // Fetch user data from DB
    const db = await DbSvc.connectToDB();
    const user = await UserSvc.getUserByID(db, req.userID);
    db.end();

    if (!user || !user.id) {
      throw new Error('No user found');
    }

    res.status(200).send({
        auth: true,
        id: req.userID,
        username: user.username,
        createTimestamp: user.createTimestamp
    });
    return true;
  } catch {
    res.status(404).send({ auth: false });
    return false;
  }
})
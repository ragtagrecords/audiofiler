const mysql = require('mysql2');
const Logger = require('../utils/Logger.js');
const { sqlInsert, sqlSelect } = require('../services/Db.js');

// Users
const defaultColumns = [
    'users.username',
    'users.hashedPassword',
    'users.salt'
];
const allColumns = [
    ...defaultColumns,
    'users.id',
    'users.createTimestamp'
];

// Columns to be returned to frontend
const clientColumns = [
    'users.id',
    'users.username',
    'users.createTimestamp'
];

async function getAllUsers(db) {
    if (!db) {
        return false;
    }

    return sqlSelect(
        db,
        'users',
        allColumns,
        null,
        null,
        true
    );
}

async function getUserByID(db, id, allColumns = false) {
    if (!db || !id) {
        console.log('ERROR: ID required');
        return false;
    }

    return sqlSelect(
        db,
        'users',
        allColumns ? allColumns : clientColumns,
        'WHERE id = ?',
        [id],
        true
    );
}

async function getUserByUsername(db, username) {
    if (!db || !username) {
        console.log('ERROR: Username required');
        return false;
    }

    return sqlSelect(
        db,
        'users',
        allColumns,
        'WHERE username = ?',
        [username],
        true
    );
}
async function addUser(db, username, hash, salt) {
    if(!db || !username || !hash || !salt) {
        console.log('ERROR: Username, hash, and salt are required');
        return false;
    }

    return sqlInsert(
        db,
        'users',
        defaultColumns,
        [username, hash, salt]
    );
}



module.exports = { getAllUsers, getUserByID, getUserByUsername, addUser};

const mysql = require('mysql2/promise');
const Logger = require('../utils/Logger.js');

async function connectToDB() {
    const db = await mysql.createConnection({
        user: process.env.MYSQL_USER,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

    db.connect(function(err) {
        if (err) {
            Logger.logError('createDBConnection()', "Couldn't connect to database");
        }
        return false;
    });

    return db;
}

function getQuestionMarks(count) {
    if (count <= 0) {
        return '';
    }
    let str = '?';
    for (let i = 0; i < count - 1; i += 1) {
        str += ',?';
    }
    return str;
}

/* Given: 
    [name, tempo, path]

   Returns:
    'name = ?, tempo = ?, path = ?'
*/
function getSQLStringToUpdateColumns(cols) {
  let str = '';
  for(let i = 0; i < cols.length; i += 1) {
      if (i != 0) {
          str += ', '
      }
      str += `${cols[i]} = ?`
  }
  return str;
}

// Template for INSERT queries on our database
async function sqlInsert(db, table, cols, args = null) {

  if (!db || !table || !cols || !args) {
    return false;
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO ${table} (${cols}) VALUES (${getQuestionMarks(args.length)})`,
      args,
    );
    Logger.logSuccess('sqlInsert()', `id(${result.insertId}) added to ${table}`);
    return result.insertId;
  } catch (err) {
    Logger.logError('sqlInsert()', err.sqlMessage ?? "Database Error, No message found");
    return false;
  }
}

// Template for SELECT queries on our database
async function sqlSelect(db, table, cols, whereClause, whereVals, multipleRows = false) {

    if (!db || !table || !cols) {
        console.log('ERROR: Necessary params not provided for sqlSelect()');
        return false;
    }

    // If only one of them is included
    if (!!whereClause + !!whereVals == 1) {
        console.log('If where clause provided, also need values');
        return false;
    }

    try {
        const [rows] = await db.execute(
            `SELECT ${cols} FROM ${table} ${whereClause ?? ''};`,
            whereVals ?? [],
        );
        Logger.logSuccess('sqlSelect()', `Returned rows from ${table}`);
        return rows;
    } catch (err) {
        Logger.logError(`sqlSelect() on table: ${table}`, err.sqlMessage ?? "Database Error, No message found");
        return false;
    }
}

// Template for DELETE queries on our database
async function sqlDelete(db, table, whereClause, args) {
    if (!db || !table || !whereClause || !args) {
        return false;
    }

    try {
      const [result] = await db.execute(`DELETE FROM ${table} ${whereClause} LIMIT 100;`, args);
      Logger.logSuccess(
        'sqlDelete()',
        `Deleted ${args} from ${table}`
      );
      console.log(result);
      return result.affectedRows;
    } catch (err) {
      Logger.logError(`sqlDelete() on table: ${table}`, err.sqlMessage ?? "Database Error, No message found");
      return false;
    }
}

// Template for UPDATE queries on our database
// Expects an object that has properties correlating to columns in the database
// Object must contain a row ID that exists in the table
// EXAMPLE: To update a song:
/*
    object = {
        name: 'new song name',
        tempo: '102'
    }
*/
async function sqlUpdate(db, table, whereClause, object, whereValues) {

    if (!db || !table || !whereClause || !object || Object.keys(object).length === 0 || !whereValues) {
        console.log('ERROR: Required fields to update not found');
        return false;
    }

    // Read object property names and values into arrays
    let colNames = Object.keys(object);
    let colValues = Object.values(object);

    try {
      const [result] = await db.execute(
        `UPDATE ${table} SET ${getSQLStringToUpdateColumns(colNames)} ${whereClause};`,
        [...colValues, ...whereValues],
      );
      const message = `Updated ${colNames.join(', ')} for ${table} | ${whereClause} | ${whereValues}`;
      Logger.logSuccess('sqlUpdate()', message);
      const updatedRow = await sqlSelect(db, table, colNames, whereClause, whereValues, false);
      return updatedRow;
    } catch (err) {
      Logger.logError(`sqlUpdate() on table: ${table}`, err.sqlMessage ?? "Database Error, No message found");
      return false;
    }
}

// Template for MAX queries on our database
async function sqlMax(db, table, maxColumn, whereClause, args) {
  if (!db || !maxColumn || !table) {
      console.log('ERROR: Required args not found');
      return false;
  }

  try {
    const [rows] = await db.execute(
      `SELECT MAX(${maxColumn}) as maxPosition FROM ${table} ${whereClause}`,
      args ?? [],
    );
    Logger.logSuccess('sqlMax()', `Max returned from ${table}`);
    return rows[0].maxPosition;
  } catch (err) {
    Logger.logError('sqlMax()', err.sqlMessage ?? "Database Error, No message found");
    return false;
  }
}

module.exports = { connectToDB, sqlInsert, sqlSelect, sqlUpdate, sqlDelete, sqlMax };

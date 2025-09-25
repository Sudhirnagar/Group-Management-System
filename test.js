// testDB.js
const queryDatabase = require('./db');

async function test() {
    try {
        const result = await queryDatabase('SELECT * FROM LogIn', []);
        console.log(result);
    } catch (err) {
        console.error(err);
    }
}

test();

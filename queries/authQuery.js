// queries/authQuery.js
const dbQuery = require("../db");

async function authorizeUser(emailID, password) {
    const result1 = await dbQuery(
        `SELECT * FROM LogIn WHERE EmailAddress = ?`,
        [emailID]
    );

    if (result1.length === 1) {
        const result2 = await dbQuery(
            `SELECT * FROM LogIn WHERE EmailAddress = ? AND password = ?`,
            [emailID, password]
        );
        if (result2.length === 1) {
            result2[0].status = 200;
            return result2[0];
        } else {
            return { status: 401 }; // invalid password
        }
    } else {
        return { status: 404 }; // user not found
    }
}

async function getUserID(emailID, userType) {
    if (userType === 's') {
        const result = await dbQuery(
            `SELECT userID FROM student JOIN LogIn ON student.EmailAddress = LogIn.EmailAddress WHERE student.EmailAddress = ?`,
            [emailID]
        );
        if (result.length === 1) {
            result[0].status = 200;
            return result[0];
        } else {
            return { status: 404 };
        }
    } else if (userType === 't') {
        const result = await dbQuery(
            `SELECT userID FROM teacher JOIN LogIn ON teacher.EmailAddress = LogIn.EmailAddress WHERE teacher.EmailAddress = ?`,
            [emailID]
        );
        if (result.length === 1) {
            result[0].status = 200;
            return result[0];
        } else {
            return { status: 404 };
        }
    } else {
        return { status: 400 };
    }
}

async function updatePassword(emailID, newPassword) {
    try {
        await dbQuery(`UPDATE LogIn SET password = ? WHERE EmailAddress = ?`, [newPassword, emailID]);
        return { status: 200 };
    } catch (err) {
        console.error(err);
        return { status: 500 };
    }
}

module.exports = { authorizeUser, getUserID, updatePassword };

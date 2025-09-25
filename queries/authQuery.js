// queries/authQuery.js
const dbQuery = require("../db");

async function authorizeUser(emailID, password) {
    // check if user exists
    const result = await dbQuery(
        `SELECT * FROM LogIn WHERE EmailAddress = ? AND password = ?`,
        [emailID, password]
    );

    if (result.length === 1) {
        const user = result[0];
        user.status = 200;

        // determine role
        const isStudent = await dbQuery(`SELECT * FROM student WHERE EmailAddress = ?`, [emailID]);
        if (isStudent.length === 1) {
            user.role = 's';
        } else {
            const isTeacher = await dbQuery(`SELECT * FROM teacher WHERE EmailAddress = ?`, [emailID]);
            if (isTeacher.length === 1) {
                user.role = 't';
            } else {
                return { status: 404 }; // no role found
            }
        }

        return user;
    } else {
        // invalid email or password
        const checkEmail = await dbQuery(`SELECT * FROM LogIn WHERE EmailAddress = ?`, [emailID]);
        if (checkEmail.length === 0) return { status: 404 }; // user not found
        return { status: 401 }; // wrong password
    }
}

async function getUserID(emailID, userType) {
    if (userType === 's') {
        const result = await dbQuery(
            `SELECT RollNo AS userID FROM student WHERE EmailAddress = ?`,
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
            `SELECT Teacher_ID AS userID FROM teacher WHERE EmailAddress = ?`,
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

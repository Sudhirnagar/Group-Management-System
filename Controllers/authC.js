// Controllers/authC.js
const catchAsyncErrors = require('../Middlewares/catchAsyncErrors');
const { authorizeUser, getUserID, updatePassword } = require('../queries/authQuery');
const { generateToken } = require('../utils/jwt');

exports.loginController = catchAsyncErrors(async (req, res) => {
    const { email: emailID, password } = req.body; // map frontend 'email' key to 'emailID'

    if (!emailID || !password) return res.status(400).send("Bad Request");

    const result1 = await authorizeUser(emailID, password);

    if (result1.status === 200) {
        const result2 = await getUserID(result1.EmailAddress, result1.role);
        if (result2.status !== 200) return res.status(500).send("Error Logging In");

        const token = generateToken(result1.EmailAddress, result1.role, result2.userID);
        if (token !== 500) {
            res.cookie('token', token, { httpOnly: true });
            if (result1.role === 's') return res.status(200).send("Student Logged In");
            else if (result1.role === 't') return res.status(200).send("Teacher Logged In");
            else return res.status(500).send("Invalid User Type");
        }
    }

    return res.status(result1.status).send(result1);
});

exports.logoutController = (req, res) => {
    res.clearCookie('token');
    res.status(200).send("You are logged out");
};

exports.changePasswordController = catchAsyncErrors(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).send("Old and New Password required");
    if (oldPassword === newPassword) return res.status(400).send("Old and New Password cannot be same");

    const isOldPasswordValid = await authorizeUser(req.emailID, oldPassword);
    if (isOldPasswordValid.status !== 200) return res.status(isOldPasswordValid.status).send("Error changing password");

    const result = await updatePassword(req.emailID, newPassword);
    if (result.status === 200) res.status(200).send("Password changed successfully");
    else res.status(500).send("Password change failed, try again later");
});

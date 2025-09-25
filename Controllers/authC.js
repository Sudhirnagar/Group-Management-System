// Controllers/authC.js
const catchAsyncErrors = require('../Middlewares/catchAsyncErrors');
const { authorizeUser, getUserID, updatePassword } = require('../queries/authQuery');
const { generateToken } = require('../utils/jwt');

// Login Controller
exports.loginController = catchAsyncErrors(async (req, res) => {
    const { email: emailID, password } = req.body; // maps frontend 'email' to backend emailID
    if (!emailID || !password) return res.status(400).send("Bad Request");

    const result1 = await authorizeUser(emailID, password);

    if (result1.status === 200) {
        const result2 = await getUserID(result1.EmailAddress, result1.role);
        if (result2.status !== 200) return res.status(500).send("Error Logging In");

        const token = generateToken(result1.EmailAddress, result1.role, result2.userID);
        if (token !== 500) {
            res.cookie('token', token, { httpOnly: true });

            if (result1.role === 's') {
                // Render student home page
                return res.render('Student/Home', { email: result1.EmailAddress });
            } else if (result1.role === 't') {
                // Render teacher home page
                return res.render('Teacher/Home', { email: result1.EmailAddress });
            } else {
                return res.status(500).send("Invalid User Type");
            }
        }
    } else if (result1.status === 401) {
        return res.status(401).send("Incorrect password");
    } else if (result1.status === 404) {
        return res.status(404).send("User not found");
    } else {
        return res.status(500).send("Something went wrong");
    }
});

// Logout Controller
exports.logoutController = (req, res) => {
    res.clearCookie('token');
    res.status(200).send("You are logged out");
};

// Change Password Controller
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

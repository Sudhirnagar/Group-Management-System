const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { fetchProfileTeacher } = require('../../queries/profile');
const { fetchProjectTeacher } = require('../../queries/projectQuery');

// Render Teacher Profile page
exports.fetchProfile = catchAsyncErrors(async (req, res) => {
    const { userID } = req;
    const output = await fetchProfileTeacher(userID);

    if (output.status === 200) {
        res.render('Teacher/ProfilePage', { teacher: output.teacher });
    } else {
        res.status(500).send('Error loading profile');
    }
});

// Render Teacher Home Page with Projects
exports.loadHomePage = catchAsyncErrors(async (req, res) => {
    const { userID } = req;
    const result = await fetchProjectTeacher(userID);

    if (result.status === 500) {
        res.status(500).send("Internal Server Error");
    } else {
        res.render('Teacher/Home', { projects: result });
    }
});

const catchAsyncErrors = require('../../Middlewares/catchAsyncErrors');
const { fetchProjectStudent } = require('../../queries/projectQuery');
const { fetchProfileStudent } = require('../../queries/profile');

// ================= Profile =================
exports.fetchProfile = catchAsyncErrors(async (req, res) => {
    const { userID } = req;
    const output = await fetchProfileStudent(userID);

    if (output.status === 200) {
        return res.status(200).send(output);
    } else if (output.status === 404) {
        return res.status(400).send(output);
    } else {
        return res.status(500).send(output);
    }
});

// ================= Home Page =================
exports.loadHomePage = catchAsyncErrors(async (req, res) => {
    const { userID } = req;

    const result = await fetchProjectStudent(userID);
    if (result.status === 500) {
        res.status(500).send("Internal Server Error");
    } else {
        // render student home with projects list
        res.render("Student/Home", { Courses: result.data || [] });
    }
});

// ================= Join Course Page =================
exports.joinCoursePage = catchAsyncErrors(async (req, res) => {
    // simply render the JoinCourse.hbs page
    res.render("Student/JoinCourse", { message: null });
});

// ================= Join Course Handler =================
exports.joinCourseHandler = catchAsyncErrors(async (req, res) => {
    const { Course_ID } = req.body;
    const { userID } = req;

    if (!Course_ID) {
        return res.render("Student/JoinCourse", { message: "Please enter a valid Course ID" });
    }

    try {
        // TODO: integrate with your DB (insert into student_courses or equivalent)
        console.log(`Student ${userID} joined course: ${Course_ID}`);

        return res.render("Student/JoinCourse", { message: `Successfully joined course ${Course_ID}` });
    } catch (err) {
        console.error(err);
        return res.render("Student/JoinCourse", { message: "Error joining course" });
    }
});

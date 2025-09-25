const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');

const { fetchProfile, loadHomePage } = require('../Controllers/Teacher/homeC');
const { authenticateToken, validateUserTypeT } = require('../Middlewares/jwtTokenVerifer');
const { createProject, getProjectDetails } = require('../Controllers/Teacher/ProjectC');
const { getEnrolledStudentList, getGroups, fetchGroupDetails, fetchNonGroupStudents, fetchVacantGroups } = require('../Controllers/commonC');

router.use(cookieParser());
router.use(authenticateToken);
router.use(validateUserTypeT);

// Profile & Home
router.get('/profile', fetchProfile); 
router.get('/home', loadHomePage);

// Create Course Page
router.get('/CreateCourse', (req, res) => {
    res.render('Teacher/CreateCourse'); // HBS view
});

// Project Routes
router.put('/project', createProject);
router.get('/project/:Project_ID', getProjectDetails);
router.get('/project/:Project_ID/viewParticpants', getEnrolledStudentList);
router.get('/project/:Project_ID/viewGroups', getGroups);
router.get('/project/:Project_ID/group/:GID', fetchGroupDetails);
router.get('/project/:Project_ID/viewNonGroupStudents', fetchNonGroupStudents);
router.get('/project/:Project_ID/viewVacantGroups', fetchVacantGroups);

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
});

module.exports = router;

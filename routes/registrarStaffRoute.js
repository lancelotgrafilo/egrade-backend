const express = require('express');
const router = express.Router();

const { 
  postRegistrarStaff
} = require('../controllers/registrarStaffController');

router.route('/post_registrar_staff').post(postRegistrarStaff);

module.exports = router;
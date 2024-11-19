const express = require('express');
const router = express.Router();

const { 
  postRegistrarStaff,
  getRegistrarDetails
} = require('../controllers/registrarStaffController');

router.route('/post_registrar_staff').post(postRegistrarStaff);

router.route("/get_registrar_details/:id").get(getRegistrarDetails);

module.exports = router;
const express = require('express');
const router = express.Router();

const { 
  postRegistrarStaff,
  getRegistrarDetails,
  updateUserStatus
} = require('../controllers/registrarStaffController');

router.route('/post_registrar_staff').post(postRegistrarStaff);

router.route("/get_registrar_details/:id").get(getRegistrarDetails);

router.patch('/update-registrar-staff-status/:userId', updateUserStatus);

module.exports = router;
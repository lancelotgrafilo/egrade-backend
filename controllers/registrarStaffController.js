const express = require('express');
const asyncHandler = require('express-async-handler');
const registrarStaffModel = require('../models/registrarStaffModel');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const { sendEmailSuccess } = require('./emailSuccessController');

// Function to generate a random password
const generateRandomPassword = (length = 6) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

const registrarStaffSchema = Joi.object({
  ID: Joi.string(),
  last_name: Joi.string().required(),
  first_name: Joi.string().required(),
  middle_initial: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  isActive: Joi.boolean().default(true), // Default value added
  createdAt: Joi.date().default(Date.now), // Default value added
});

const validateRegistrarStaff = (data) => {
  return registrarStaffSchema.validate(data, { abortEarly: false }); // Ensure all errors are captured
};

const postRegistrarStaff = asyncHandler(async (req, res) => {
  // Validate and apply default values
  const { error, value: validatedData } = validateRegistrarStaff(req.body);

  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { ID, last_name, first_name, middle_initial, password, email, isActive, createdAt } = validatedData;

  // Check if the email already exists
  const existingRegistrarStaff = await registrarStaffModel.findOne({ email });
  if (existingRegistrarStaff) {
    return res.status(400).json({ message: "Email already registered" });
  }
  // Generate and hash the random password
  const generatedPassword = generateRandomPassword();
  const plainPassword = generatedPassword;
  const hashedPassword = await bcrypt.hash(generatedPassword, 10); // 10 is the salt rounds

  const registrarStaff = new registrarStaffModel({
    ID,
    last_name,
    first_name,
    middle_initial,
    password: hashedPassword, // Store hashed password
    email,
    isActive,
    createdAt,
  });


  try {
    await registrarStaff.save();

    await sendEmailSuccess({
      email,
      plainPassword
    });

    res.status(201).json({ message: "Successfully Added New Registrar Staff" });

  } catch (err) {
    console.error('Error saving registrar staff:', err);
    res.status(500).json({ message: "Failed to add registrar staff", error: err });
  }

  
  
});



const getRegistrarDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid userId format' });
  }

  try {
    // Fetch user by id
    const user = await registrarStaffModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ message: 'Failed to fetch user details', error: error.message });
  }
});

const updateUserStatus = async (req, res) => {
  const { userId } = req.params;
  const { isActive } = req.body; // Expecting { isActive: false }

  try {
    // Find user by ID and update the isActive field
    const updatedUser = await registrarStaffModel.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User status updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  postRegistrarStaff,
  getRegistrarDetails,
  updateUserStatus
};

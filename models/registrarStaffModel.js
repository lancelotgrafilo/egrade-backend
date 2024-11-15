const mongoose = require('mongoose');

const registrarStaffSchema = new mongoose.Schema({
  ID: { type: String, default: "rs-001" },
  email: { type: String, require: true },
  last_name: { type: String, require: true },
  first_name: { type: String, require: true },
  middle_initial: { type: String, require: true },
  password: { type: String, required: false },
  title: { type: String, default: "registrar_staff" },
  email: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
}, { collection: 'registrarStaffs' });

// Function to generate the next ID based on the previous ID
const generateNextID = async () => {
  const lastRegistrarStaff = await registrarStaffModel.findOne().sort({ ID: -1 }).exec();
  if (lastRegistrarStaff && lastRegistrarStaff.ID) {
    const lastIDNumber = parseInt(lastRegistrarStaff.ID.split('-')[1], 10);
    return `rs-${(lastIDNumber + 1).toString().padStart(3, '0')}`;
  }
  return 'rs-001'; // Default ID if no admins exist
};

// Middleware to set the ID before saving
registrarStaffSchema.pre('save', async function (next) {
  if (this.isNew) {
    this.ID = await generateNextID();
    // Capitalize the first letter of first_name, last_name, and middle_initial
    this.first_name = this.first_name.charAt(0).toUpperCase() + this.first_name.slice(1).toLowerCase();
    this.last_name = this.last_name.charAt(0).toUpperCase() + this.last_name.slice(1).toLowerCase();
    this.middle_initial = this.middle_initial.charAt(0).toUpperCase(); // Capitalize the first character
  }
  next();
});


const registrarStaffModel = new mongoose.model("Registrar", registrarStaffSchema);
module.exports = registrarStaffModel;
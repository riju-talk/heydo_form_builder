import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
    UID: { type: String, default: "" ,unique:true},
    password: { type: String, default: "" },
    clerk_uid: { type: String, default: "" },});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin;
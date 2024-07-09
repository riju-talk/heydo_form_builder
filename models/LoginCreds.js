import mongoose from "mongoose";


const loginCredsforPortalsSchema = new mongoose.Schema({
    userId: { type: String, default: "",},
    appUID: { type: String, default: "" },
    CompanyName: { type: String, default: "" ,unique:true},
    portalCredentials: {
        type: Map,
        of: Map
    }

});

const LoginCredsforPortals = mongoose.models.LoginCredsforPortals || mongoose.model("LoginCredsforPortals", loginCredsforPortalsSchema);

export default LoginCredsforPortals; 
import mongoose from "mongoose";


const companyPortalsSchema = new mongoose.Schema({
    cname: {
        type: String,
        required: true,
        unique:true
    },
    portals: {
        type: Map,
        of: [String]
    },
    entriesDone: 
    {type: Boolean, default: false}
    
})



const companyPortals = mongoose.models.companyPortals || mongoose.model("companyPortals", companyPortalsSchema);

export default companyPortals;
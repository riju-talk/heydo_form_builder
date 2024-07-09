import mongoose from 'mongoose';

// const portalEntrySchema = new mongoose.Schema({
//     portalName: {
//         type: String,
//         required: true,
//         unique:true
//     },
//     id: {
//       type: String,
//       required: true  
//     },
//     password: {
//       type: String,
//       required: true  
//     }
//   });
  
  
  const portalSchema = new mongoose.Schema({
    userId: { type: String, default: "" ,unique:true},
    portalsArray: {type : [portalEntrySchema], default:[]}
  });

const Portals = mongoose.models.Portals|| mongoose.model('Portals',portalSchema);

export default Portals;
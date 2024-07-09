import mongoose ,{Schema} from 'mongoose';
import { v4 as uuidv4 } from 'uuid';


const formSchema = new mongoose.Schema({
  userId: String,
  UID: { type: String },
  createdAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: false },
  name: String,
  description: { type: String, default: "" },
  content: { type: String, default: "[]" },
  visits: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  shareURL: { type: String},
  formSubmissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FormSubmission' }]
});

const Form = mongoose.models.Form || mongoose.model('Form', formSchema)  ;



export default Form;
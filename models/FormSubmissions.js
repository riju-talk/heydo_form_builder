
import mongoose from 'mongoose';

const formSubmissionSchema = new mongoose.Schema({
  
  createdAt: { type: Date, default: Date.now },
  // UID: {type: String, required: true},
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form' },
}, { strict: false }); // Disable strict mode

  const FormSubmission =mongoose.models.FormSubmission ||   mongoose.model('FormSubmission', formSubmissionSchema);

export default FormSubmission;

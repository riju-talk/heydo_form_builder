import { Document, Types } from 'mongoose';

interface MForm extends Document {
  _id: Types.ObjectId;
  userId: string;
  createdAt: Date;
  published: boolean;
  name: string;
  description: string;
  content: string;
  visits: number;
  submissions: number;
  shareURL: string;
  formSubmissions: Types.ObjectId[]; // Array of ObjectIds referencing FormSubmissions
}

export default MForm;

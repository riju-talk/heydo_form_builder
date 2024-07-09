"use server";
import mongoose, { ObjectId, StringExpression } from "mongoose";
// import { Request, Response } from 'express'; // If you're using Express
// import { Form} from './models'; // Assuming models are defined
import { formSchema, formSchemaType } from "@/schemas/form";
import { currentUser } from "@clerk/nextjs";
import Form from "@/models/Form";
// import  MForm from '@/models/mongoForm';
import FormSubmission from "@/models/FormSubmissions";
import Admin from "@/models/Admin";
import companyPortals from "@/models/CompanyPortals";
import LoginCredsForPortals from "@/models/LoginCreds";

// import Portals from '@/models/Portal';

// import { connect } from 'http2';
// import { connected } from 'process';
import connectDB from "@/helper/mongoDb";
import { v4 as uuidv4 } from "uuid";
import { get } from "http";

class UserNotFoundErr extends Error {}

export async function GetFormStats() {
  await connectDB();

  const user = await currentUser();
  // console.log(user?.primaryEmailAddressId);
  // console.log(user?.emailAddresses);
  // console.log(user?.id);
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    const stats = await Form.aggregate([
      { $match: { userId: user.id } },
      { $group: { _id: null, visits: { $sum: "$visits" }, submissions: { $sum: "$submissions" } } },
    ]);

    const result = stats[0] || { visits: 0, submissions: 0 };
    const submissionRate = result.visits > 0 ? (result.submissions / result.visits) * 100 : 0;
    const bounceRate = 100 - submissionRate;

    return { visits: result.visits, submissions: result.submissions, submissionRate, bounceRate };
  } catch (error) {
    console.error(error);
    // throw new Error("Error fetching form stats");
  }
}

// export async function CreateForm(data: formSchemaType) {
//   const validation = formSchema.safeParse(data);
//   if (!validation.success) {
//     throw new Error("form not valid");
//   }

//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }

//   const { name, description } = data;

//   const form = await prisma.form.create({
//     data: {
//       userId: user.id,
//       name,
//       description,
//     },
//   });
// if (!form) {
//   //     throw new Error("something went wrong");
//   //   }

//   //   return form.id;
//   // }

export async function duplicateForm(formId: String, data: formSchemaType) {
  await connectDB();
  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }
  const ad = await getAdminByclerkID();
  if (!ad) {
    throw new UserNotFoundErr();
  }
  const oldForm = await GetFormById(formId);
  const content = oldForm?.content;
  const { name, description } = data;
  try {
    // Validate data here

    const myUuid = uuidv4();

    const newForm = new Form({
      userId: ad?.clerk_uid,
      UID: ad?.UID,
      name,
      description,
      shareURL: myUuid.toString(),
      content: content,
    });

    await newForm.save();
    return newForm._id;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating form");
  }
}

export async function CreateForm(data: formSchemaType) {
  await connectDB();

  const validation = formSchema.safeParse(data);
  if (!validation.success) {
    throw new Error("form not valid");
  }
  const ad = await getAdminByclerkID();
  if (!ad) {
    throw new UserNotFoundErr();
  }

  const { name, description } = data;
  try {
    // Validate data here

    const myUuid = uuidv4();

    const newForm = new Form({
      userId: ad?.clerk_uid,
      UID: ad?.UID,
      name,
      description,
      shareURL: myUuid.toString(),
    });

    await newForm.save();
    return newForm._id;
  } catch (error) {
    console.error(error);

    // throw new Error("Error creating form");
  }
}

// export async function GetForms() {
//
//   return await prisma.form.findMany({
//     where: {
//       userId: user.id,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//   });
// }

export async function GetForms() {
  await connectDB();

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  try {
    return await Form.find({ userId: user.id }).sort({ createdAt: -1 });
  } catch (error) {
    console.error(error);
    // throw new Error("Error fetching forms");
  }
}

// export async function GetFormById(id: number) {
//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }

//   return await prisma.form.findUnique({
//     where: {
//       userId: user.id,
//       id,
//     },
//   });
// }

export async function GetFormById(id: String) {
  await connectDB();

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
    // console.log("user not found");
  }
  try {
    return await Form.findOne({ _id: id, userId: user.id || null });
  } catch (error) {
    console.error(error);
    // throw new Error("Error fetching form by ID");
  }
}

// export async function UpdateFormContent(id: number, jsonContent: string) {

//   return await prisma.form.update({
//     where: {
//       userId: user.id,
//       id,
//     },
//     data: {
//       content: jsonContent,
//     },
//   });
// }

export async function UpdateFormContent(id: String, jsonContent: String) {
  const user = await currentUser();
  await connectDB();

  if (!user) {
    throw new UserNotFoundErr();
  }

  try {
    return await Form.updateOne({ _id: id, userId: user.id }, { content: jsonContent });
  } catch (error) {
    // console.error(error);
    throw new Error("Error updating form content");
  }
}

export async function UpdatePublish(id: StringExpression, pub: Boolean) {
  const user = await currentUser();
  await connectDB();

  if (!user) {
    throw new UserNotFoundErr();
  }

  try {
    return await Form.updateOne({ _id: id, userId: user.id }, { published: pub });
  } catch (error) {
    // console.error(error);
    throw new Error("Error updating form content");
  }
}

// export async function PublishForm(id: number) {
//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }

//   return await prisma.form.update({
//     data: {
//       published: true,
//     },
//     where: {
//       userId: user.id,
//       id,
//     },
//   });
// }
export async function PublishForm(id: String) {
  await connectDB();

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    return await Form.updateOne({ _id: id, userId: user.id }, { published: true });
  } catch (error) {
    console.error(error);
    // throw new Error("Error publishing form");
  }
}

// export async function GetFormContentByUrl(formUrl: string) {
//   return await prisma.form.update({
//     select: {
//       content: true,
//     },
//     data: {
//       visits: {
//         increment: 1,
//       },
//     },
//     where: {
//       shareURL: formUrl,
//     },
//   });
// }

export async function GetFormContentByUrl(formUrl: String) {
  await connectDB();

  try {
    return await Form.findOneAndUpdate({ shareURL: formUrl }, { $inc: { visits: 1 } }, { new: true }).select(
      "content published",
    );
  } catch (error) {
    console.error(error);
    // throw new Error("Error fetching form content by URL");
  }
}

export async function GetFormIdbyUrl(formUrl: String) {
  await connectDB();
  try {
    const form = await Form.findOne({ shareURL: formUrl, published: true });
    if (!form) {
      throw new Error("Form not found or not published");
    }
    return form._id;
  } catch (error) {
    console.error(error);
    throw new Error("Error submitting form");
  }
}

export async function SubmitForm(formUrl: String, content: object) {
  await connectDB();

  try {
    const form = await Form.findOne({ shareURL: formUrl, published: true });
    if (!form) {
      throw new Error("Form not found or not published");
    }

    // Create a new submission
    const submission = new FormSubmission({ formId: form._id, ...content });
    await submission.save();

    // Update the Form document to include the new submission
    await Form.findByIdAndUpdate(form._id, {
      $inc: { submissions: 1 },
      $push: { formSubmissions: submission._id }, // Add submission ID to formSubmissions array
    });

    return submission._id;
  } catch (error) {
    console.error(error);
    throw new Error("Error submitting form");
  }
}

// export async function GetFormWithSubmissions(id: number) {
//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }

//   return await prisma.form.findUnique({
//     where: {
//       userId: user.id,
//       id,
//     },
//     include: {
//       FormSubmissions: true,
//     },
//   });
// }

export async function GetFormWithSubmissions(id: String) {
  await connectDB();

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    return await Form.findOne({ _id: id, userId: user.id }).populate("FormSubmissions");
  } catch (error) {
    console.error(error);
    // throw new Error("Error fetching form with submissions");
  }
}
export async function updateAdminPassword(userId: String, newPassword: String) {
  await connectDB();

  try {
    const existingAdmin = await Admin.findOne({ UID: userId });

    if (existingAdmin) {
      // Admin exists, update the password
      existingAdmin.password = newPassword; // Ensure newPassword is securely hashed if it isn't already
      await existingAdmin.save();
      return 200; // Successfully updated
    } else {
      // If you're sure the admin always exists, this might indicate a more severe error.
      console.error("Admin not found - unexpected since admin should exist");
      return 404; // Not found
    }
  } catch (error) {
    console.error(error);
    // Consider customizing error handling here
    return 500; // Indicate a server error
  }
}

export async function setIdPassforApp(userId: String, Password: String) {
  await connectDB();

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    const clerk_id = user.id;
    const existingAdmin = await Admin.findOne({ UID: userId });
    if (existingAdmin) {
      return 401;
    } else {
      const newAdmin = new Admin({ UID: userId, password: Password, clerk_uid: clerk_id });
      await newAdmin.save();
      return 200;
    }
  } catch (error) {
    console.error(error);
    // throw new Error("Error fetching form with submissions");
  }
}

export async function getAdminByclerkID() {
  await connectDB();
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    const admin = await Admin.findOne({ clerk_uid: user.id });
    if (admin) {
      return admin;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    // throw new Error("Error fetching form with submissions");
  }
}

export async function DeleteForm(formId: String) {
  await connectDB(); // Connect to the database

  const user = await currentUser(); // Get the current user
  if (!user) {
    throw new UserNotFoundErr(); // If no user is found, throw an error
  }

  try {
    // Find the form to ensure it exists and belongs to the user
    const formToDelete = await Form.findOne({ _id: formId, userId: user.id });
    if (!formToDelete) {
      // console.log('Form not found or user does not have permission to delete this form.');
      return 404; // Not found or no permission
    }

    // Delete all related FormSubmissions
    await FormSubmission.deleteMany({ formId: formId });

    // Remove the form from the admin's list of forms (assuming the list is an array of form IDs)

    // Now delete the form itself
    await Form.deleteOne({ _id: formId });

    // console.log('Form and related submissions deleted successfully.');
    return 200; // Successfully deleted
  } catch (error) {
    console.error(error);
    return 500; // Server error
  }
}

// export async function GetPortals(){
//   await connectDB();
//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }
//   try{
//     const portalentry = await Portals.findOne({ clerk_uid: user.id });
//     if(portalentry){
//       return portalentry.portalsArray;
//     }
//     else{
//       return null;
//     }
//   }
//   catch (error) {
//     console.error(error);
//     throw new Error("Error fetching Portal Details");
//   }

// }

// export async function AddPortal(portalname:String,portalId:String,portalPassword:String){
//   await connectDB();
//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }
//   try{
//     const portalEntry= await Portals.findOne({ clerk_uid: user.id });
//    if(!portalEntry){
//     const newPortalEntry = new Portals({ clerk_uid: user.id, portalsArray: [{portalName:portalname,id:portalId,password:portalPassword}] });
//     await newPortalEntry.save();
//     return 200;
//    }
//     else{
//       const portalArray= portalEntry.portalsArray;
//       const newPortalArray= portalArray.concat({portalName:portalname,id:portalId,password:portalPassword});
//       await Portals.updateOne({ clerk_uid: user.id }, { portalsArray:newPortalArray });
//       return 200;
//     }
//   }
//   catch (error) {
//     console.error(error);
//     return 500;
//     // throw new Error("Error fetching Portal Details");
//   }

// }

// export async function DeletePortal(portalName:String,portalId:String,portalPassword:String){
//   await connectDB();
//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }
//   try{
//     const portalEntry= await Portals.findOne({ clerk_uid: user.id });
//    if(!portalEntry){
//     return 404;
//    }
//     else{
//       const portalArray= portalEntry.portalsArray;
//       const newPortalArray= portalArray.filter((portal:any)=>portal.Name!=portalName);
//       await Portals.updateOne({ clerk_uid: user.id }, { portalsArray:newPortalArray });
//       return 200;
//     }
//   }
//   catch (error) {
//     console.error(error);
//     return 500;
//     // throw new Error("Error fetching Portal Details");
//   }
// }

// export async function EditndUpdatePortal(portalName:String,portalId:String,portalPassword:String){
//   await connectDB();
//   const user = await currentUser();
//   if (!user) {
//     throw new UserNotFoundErr();
//   }
//   try{
//     const portalEntry= await Portals.findOne({ clerk_uid: user.id });

//   }
//   catch (error) {
//     console.error(error);
//     return 500;
//     // throw new Error("Error fetching Portal Details");
//   }

// }
export interface PortalsData {
  [portalName: string]: {
    [credName: string]: string;
  };
}

export async function AddCredsinPortals(Compname: String, portalsData: PortalsData, portalName: string) {
  await connectDB();
  const user = await currentUser();
  if (!user) {

    throw new UserNotFoundErr();
  }
  try {
    // console.log("this is portals data", portalsData,"name\n",portalName);
    // console.log("compname\n",Compname);
    const admin = await Admin.findOne({ clerk_uid: user.id });
    // const comp= await companyPortals.findOne({cname:Compname});
    // console.log("this is entryu asta:",comp.entriesDone);
    // const entriesDone= comp?.entriesDone;
    const appuid = admin?.UID;
    const portalEntry = await LoginCredsForPortals.findOne({CompanyName:Compname });
    if (!portalEntry) {
      // console.log("portal entry nahi hai\n");
      const newPortalEntry = new LoginCredsForPortals({
        userId: user.id,
        appUID: appuid,
        CompanyName: Compname,
        portalCredentials: portalsData,
      });
      await newPortalEntry.save();
    await companyPortals.updateOne({cname:Compname},{entriesDone:true});
      return 200;
    } else {
    
      // const portalsDataget = portalEntry.portalCredentials.get(portalName);
      // console.log(typeof portalsData);
      // // console.log("portal name naya data",portalsData.get(portalName));
      // console.log("portal name purarna data",portalsDataget);
      // if (portalsDataget) {
      //   // Update the specific entry in portalCredentials
      //   portalEntry.portalCredentials.set(portalsDataget,portalsData.portalName);

      //   // Save the updated document
      //   await portalEntry.save();
      //   return 200;
      // console.log("portal entry hai\n");
      if (portalEntry.portalCredentials.has(portalName)) {
        const innerMap = portalEntry.portalCredentials.get(portalName);
        // console.log("inner map", innerMap);

        // Loop through the new data in portalsData[portalName]
        for (const credName in portalsData[portalName]) {
          if (portalsData[portalName].hasOwnProperty(credName)) {
            portalEntry.portalCredentials.get(portalName).set(credName, portalsData[portalName][credName]);
          }
          // console.log("inner map", innerMap);
        }
        await LoginCredsForPortals.updateOne({CompanyName:Compname},{ $set: { portalCredentials: portalEntry.portalCredentials } }); 
        return 200;

      } else {
      
        console.log("Portal not found");
        throw new Error("Portal not found");
      }
    }
  } catch (error) {
    console.error(error);
    return 500;
    // throw new Error("Error fetching Portal Details");
  }
}
export async function GetCredsinPortals(portalname: String) {
  await connectDB();
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    const portalEntry = await LoginCredsForPortals.findOne({ clerk_uid: user.id });
    if (!portalEntry) {
      return {
        status: 404,
        message: "No portals added yet for this user",
      };
    } else {
      const portalobject = portalEntry.portalCredentials;
      const portalData = portalobject.get(portalname);
      if (portalData) {
        return { status: 200, data: portalData };
      } else {
        return { status: 404, message: "No data available for the selected Portal." };
      }
    }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Error fetching Portal Details" };
    // throw new Error("Error fetching Portal Details");
  }
}

export async function UpdateCredsinPortals(pname: String, portalNameData: object) {
  await connectDB();
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    const updateResult = await LoginCredsForPortals.updateOne(
      { userId: user.id }, // or use the appropriate field to identify the user
      { $set: { [`portalCredentials.${pname}`]: portalNameData } },
    );

    if (updateResult.matchedCount === 0) {
      return { status: 404, message: "No entry found for the user" };
    }

    if (updateResult.modifiedCount === 0) {
      return { status: 400, message: "No update made, possibly due to no change in data" };
    }

    return { status: 200, message: "Portal credentials updated successfully" };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Error updating portal credentials" };
  }
}

export async function GetCompanies() {
  await connectDB();
  // const user = await currentUser();

  try {
    const companies = await companyPortals.find();
    return companies;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching Portal Details");
  }
}


export async function findCompanyinCreds(companyName: String) {

  await connectDB();
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  try {
    const portalEntry = await LoginCredsForPortals.findOne({CompanyName: companyName });
    if (!portalEntry) {
      return {
        status: 404,
        message: "No portals added yet for this user",
      };
    } else {
      const portalobject = portalEntry.portalCredentials;
      // console.log("portal object", portalobject);
      // const portalData = portalobject.get(companyName);
      if (portalobject) {
        return { status: 200, data: portalobject};
      } else {
        return { status: 401, message: "No Portals available for given company." };
      }
    }
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Error fetching Portal Details" };
    // throw new Error("Error fetching Portal Details");
  }


}

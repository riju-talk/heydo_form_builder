import { GetFormById } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
import React from "react";
// import { UpdatePublish } from "@/actions/form";

async function BuilderPage({
  params,
}: {
  params: {
    id: string;
   
  };
}) {
  
  const { id} = params;
  
  const form = await GetFormById(String(id));
  if (!form) {
    // throw new Error("form not found");
  }
  return <FormBuilder form={form} publish={true}/>;
}

export default BuilderPage;

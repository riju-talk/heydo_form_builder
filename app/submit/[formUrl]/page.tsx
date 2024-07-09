import { GetFormContentByUrl } from "@/actions/form";
import { FormElementInstance } from "@/components/FormElements";
import FormSubmitComponent from "@/components/FormSubmitComponent";
import React from "react";
import FormNotPublished from "@/components/FormNotPublished";


async function SubmitPage({
  params,
}: {
  params: {
    formUrl: string;
  };
}) {
  const form = await GetFormContentByUrl(params.formUrl);
  

  if (!form) {
    throw new Error("form not found");
  }

if(form.published==false){
  return <FormNotPublished/>;
}
else{
  let  formContent = JSON.parse(form.content) as FormElementInstance[];
  // formContent= formContent.filter((element) => element.type == "ImageField");

  return <FormSubmitComponent formUrl={params.formUrl} content={formContent} />;}
}
export default SubmitPage;

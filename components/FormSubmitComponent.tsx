"use client";

import React, { useCallback, useRef, useState } from "react";
import { FormElementInstance, FormElements } from "./FormElements";
import { Button } from "./ui/button";

import { toast } from "./ui/use-toast";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/form";
import axios from "axios";
// import { count } from "console";
// import { urlToUrlWithoutFlightMarker } from "next/dist/client/components/app-router";

function FormSubmitComponent({ formUrl, content }: { content: FormElementInstance[]; formUrl: string }) {
  const formValues = useRef<{ [key: string]: string }>({});
  type FetchedData = {
    [key: string]: string;
  };
  // const fetchedData :FetchedData={"3092":"haan","4593":"verma","6413":"ji"};

  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());

  const [submitted, setSubmitted] = useState(false);
  // const [pending, startTransition] = useTransition();
  const [Pending, setPending] = useState(false);
  const [view, setView] = useState(1); // 1 for first view, 2 for second view
  var counts=0;

  const isImageField = (element: FormElementInstance) => element.type === "ImageField";

  // Object.keys(fetchedData).forEach(key => {
  //         formValues.current[key] = fetchedData[key];
  //       });
  // useEffect(() => {
  //   if (fetchedData) {
  //     Object.keys(fetchedData).forEach(key => {
  //       formValues.current[key] = fetchedData[key];
  //     });
  //     setRenderKey(new Date().getTime()); // Trigger a re-render
  //   }
  // }, [fetchedData]);

  // Object.keys(fetchedData).forEach(key => {
  //   //       formValues.current[key] = fetchedData[key];
  //   //     });
  const filteredContent =
    view === 1 ? content.filter(isImageField) : content.filter((element) => !isImageField(element));

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }

    return true;
  }, [content]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  type FormValues = { [key: string]: string }; // Assuming formValues.current has this structure

  interface ImageInfo {
    id: string;
    base64: string;
  }

  interface FieldInfo {
    id: string;
    value: string;
  }

  interface FormData {
    Images: { [key: string]: ImageInfo };
    Fields: { [key: string]: FieldInfo };
  }
  interface finalSubmitData {
    [key: string]: string;
  }

  function formatDataForApi(content: FormElementInstance[], formValues: FormValues): FormData {
    const data: FormData = {
      Images: {},
      Fields: {},
    };

    content.forEach((element) => {
      const value = formValues[element.id] || "";
      if (element.type === "ImageField") {
        // console.log(value);
        data.Images[element.extraAttributes?.label || ""] = {
          id: element.id,
          base64: value,
        };
      } else {
        data.Fields[element.extraAttributes?.label || ""] = {
          id: element.id,
          value: value,
        };
      }
    });

    return data;
  }

  function isFieldInfo(obj: any): obj is FieldInfo {
    return obj && typeof obj.id === "string" && typeof obj.value === "string";
  }

  function isFormData(obj: any): obj is FormData {
    if (typeof obj !== "object" || obj === null) return false;
    if (!obj.Fields) return false;

    // Check if Fields is a dictionary of FieldInfo
    for (const key in obj.Fields) {
      if (!isFieldInfo(obj.Fields[key])) {
        return false;
      }
    }

    return true;
  }
  async function makeApiCall() {
    const data = formatDataForApi(content, formValues.current);
    // console.log("Data being sent to the API:", data);
    var response = data;

    try {
      // Perform the API call
      const url: string = process.env.NEXT_PUBLIC_API_URL || " ";
      // console.log(url)

      const response1 = await axios.post(url, data);

      

      if (isFormData(response1.data)) {
        return response1.data;
        // throw new Error("Invalid response from API");
      } else {
        // console.log(response1.data);
        toast({
          title: "Error",
          description: "Can't Fetch data from Images.",
          variant: "destructive",
        });
       
        return response;
      }
    } catch (error) {
      
      console.error("Error making the API call:", error);

      throw error; // Rethrow the error so the caller can handle it}
    }
  }
  async function makeApiCallndFill() {
    try {
      setPending(true);

      const filledData = await makeApiCall();
      fillFields(filledData);
      // const data = formatDataForApi(content, formValues.current);
      // console.log("Data being sent to the API:", data);

      setView(2);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data from Images.Try again.",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  }

  function fillFields(data: FormData) {
    Object.keys(data.Fields).forEach((key) => {
      const field = data.Fields[key];
      formValues.current[field.id] = field.value;
    });
  }

  function formatFinalData() {
    const finalData: finalSubmitData = {};

    content.forEach((element) => {
      if (
        element.type !== "SeparatorField" &&
        element.type !== "SpacerField" &&
        element.type !== "SubTitleField" &&
        element.type !== "ParagraphField" &&
        element.type !== "TitleField"
      ) {
        const value = formValues.current[element.id] || "";
        const key = element.extraAttributes?.extraLabel || "";
        finalData[key] = value;
      }
    });
    return finalData;
  }

  // function sendFinalData(data: FormData) {};

  const submitForm = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: "Error",
        description: "please check the form for errors",
        variant: "destructive",
      });
      return;
    }
    try {
      setPending(true);

      const FinalData = formatFinalData();

      await SubmitForm(formUrl, FinalData);
      setSubmitted(true);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setPending(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
          <h1 className="text-2xl font-bold">Form submitted</h1>
          <p className="text-muted-foreground">Thank you for submitting the form, you can close this page now.</p>
        </div>
      </div>
    );
  }

  // const dataReadyForApiCall()=>{

  // }
  return (
    <div className="flex justify-center w-full h-full items-center m-8">
      <div
        key={renderKey}
        className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-lg shadow-cyan-400 rounded"
      >
        {filteredContent.map((element) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        {view === 1 && (
          // <Button className="mt-4" onClick={() => setView(2)}>
          //   Next
          // </Button>
          <Button className="mt-4" onClick={makeApiCallndFill} disabled={Pending}>
            {Pending ? <ImSpinner2 className="animate-spin" /> : "Next"}
          </Button>
        )}
        {view === 2 && (
          <>
            <Button className="mt-8" onClick={() => setView(1)}>
              Back
            </Button>
            <Button className="mt-4" onClick={submitForm} disabled={Pending}>
              {Pending ? <ImSpinner2 className="animate-spin" /> : "Submit"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default FormSubmitComponent;

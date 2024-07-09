"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRef } from "react";
import { z } from "zod";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements";
import useDesigner from "../hooks/useDesigner";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import CloudinaryUploadWidget from "@/components/CloudinaryUploadWidget";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage, responsive, placeholder } from "@cloudinary/react";

import { BsImage } from "react-icons/bs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Switch } from "../ui/switch";
import { Button } from "../ui/button";
// import { Button } from "../ui/button";

const type: ElementsType = "ImageField";

const imageFieldExtraAttributes = {
  label: "Image Upload",
  extraLabel: "Image_Upload",
  helperText: "Upload an image",
  required: false,
};

const imagePropertiesSchema = z.object({
  label: z.string().min(2).max(50),
  extraLabel: z.string().min(2),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
});

export const ImageFieldFormElement: FormElement = {
  type: "ImageField",
  construct: (id: string) => ({
    id,
    type: "ImageField",
    extraAttributes: imageFieldExtraAttributes,
  }),
  designerBtnElement: {
    icon: BsImage, // You can use an appropriate icon from 'react-icons'
    label: "Image Upload",
  },
  designerComponent: DesignerComponent,
  formComponent: ImageFormComponent,
  propertiesComponent: PropertiesComponent,
  validate: (formElement: FormElementInstance, currentValue: string): boolean => {
    const element = formElement as CustomInstance;
    return element.extraAttributes.required ? currentValue.length > 0 : true;
  },
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof imageFieldExtraAttributes;
};

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance; // Cast to CustomInstance type
  const { label, required, helperText, extraLabel } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <div className="border border-dashed border-gray-300 p-2 text-center">Image Upload Placeholder</div>
      {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>}
    </div>
  );
}

function ImageFormComponent({
  elementInstance,
  submitValue,
  isInvalid,
}: {
  elementInstance: FormElementInstance;
  submitValue?: SubmitFunction;
  isInvalid?: boolean;
}) {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [publicId, setPublicId] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  // Replace with your own cloud name
  const [cloudName] = useState(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  // console.log('cloudName',cloudName);
  // Replace with your own upload preset
  const [uploadPreset] = useState(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  // console.log('uploadPreset',uploadPreset);
  const [uploadtext, setUploadtext] = useState("Choose File");
  const [buttonClass, setButtonClass] = useState(""); // Default class


  const [uwConfig] = useState({
    cloudName,
    uploadPreset,
    theme: "Office", //change to a purple theme
  });

  const cld = new Cloudinary({
    cloud: {
      cloudName,
    },
  });
  const myImage = cld.image(publicId);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file)); // Set image preview

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // sessionStorage.setItem(`uploadedImage-${elementInstance.id}`, base64String); // Save to session storage with unique key
        submitValue?.(elementInstance.id, base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    submitValue?.(elementInstance.id, imgUrl);
    // console.log('pid',publicId);
    if(publicId!="")
   { setUploadtext("Change File");
   setButtonClass("bg-green-500 hover:bg-green-300");
}
  }, [imgUrl]);
  


  const element = elementInstance as CustomInstance;
  const { label, required, helperText } = element.extraAttributes;

  // console.log("publicId",publicId);/
  return (
    <div>
      <Label className="flex flex-row justify-between pb-2 text-lg">
        {label}
        <div className="text-red-600">{required && "*"}</div>
      </Label>
      <Button variant={"outline"} className={` w-full ${buttonClass}`} >
        
      <CloudinaryUploadWidget uwConfig={uwConfig} setPublicId={setPublicId} setImgUrl={setImgUrl} showtext={uploadtext} />
      </Button>
     
      <AdvancedImage className="mt-2" cldImg={myImage} plugins={[responsive(), placeholder()]} />
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof imagePropertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(imagePropertiesSchema),
    mode: "onBlur",
    defaultValues: element.extraAttributes,
  });
  const { watch, setValue } = form;
  const labelValue = watch("label"); // Watch the label value for changes

  useEffect(() => {
    // Update extraLabel based on label, convert to lowercase and replace spaces with underscores
    const formattedExtraLabel = labelValue.toLowerCase().replace(/\s+/g, "_") + "_image";
    setValue("extraLabel", formattedExtraLabel);
  }, [labelValue, setValue]);

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  const applyChanges = (values: propertiesFormSchemaType) => {
    updateElement(element.id, {
      ...element,
      extraAttributes: values,
    });
  };

  return (
    <Form {...form}>
      <form onBlur={form.handleSubmit(applyChanges)} onSubmit={(e) => e.preventDefault()} className="space-y-3">
        {/* Form fields for label, helperText, required */}
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>The label of the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="extraLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extra Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              {/* <FormDescription>The helper text of the field.</FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The helper text of the field. <br />
                It will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between">
              <FormLabel>Required</FormLabel>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default PropertiesComponent;
//

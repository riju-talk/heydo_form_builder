"use client";
import React from "react";
import { IoDuplicate } from "react-icons/io5";
import { formSchema, formSchemaType } from "@/schemas/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImSpinner2 } from "react-icons/im";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "./ui/use-toast";
// import { CreateForm, getAdminByclerkID } from "@/actions/form";
// import { BsFileEarmarkPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/app/appIdpass/loading";
import { duplicateForm } from "@/actions/form";
// import { set } from "mongoose";

function DuplicateFormbtn({ formId }: { formId: string }) {
  const form = useForm<formSchemaType>({ resolver: zodResolver(formSchema) });
    const router = useRouter();

  const [loading, setLoading] = useState(false); // State to manage loading

  async function onSubmit(values: formSchemaType) {
    try {
    setLoading(true);
      const newFormId = await duplicateForm(formId.toString(),values);
      setLoading(false);

      toast({ title: "Success", description: "Form duplicated successfully" });

      router.push(`/builder/${newFormId}/`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  }




  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full mt-2 text-md gap-4 ">
          Duplicate<IoDuplicate />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate this Form</DialogTitle>
          <DialogDescription>Create a Duplicate Form with Same Fields</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=""
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
            {!form.formState.isSubmitting && <span>Save</span>}
            {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
      {loading && <Loading />} 
    </Dialog>
  );
}

export default DuplicateFormbtn;

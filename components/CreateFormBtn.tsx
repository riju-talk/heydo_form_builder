"use client";

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
import { CreateForm, getAdminByclerkID } from "@/actions/form";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Loading from "@/app/appIdpass/loading";

function CreateFormBtn() {
  // const router = useRouter();
  // const form = useForm<formSchemaType>({
  //   resolver: zodResolver(formSchema),
  // });

  // async function onSubmit(values: formSchemaType) {
  //   try {
  //     const formId = await CreateForm(values);
  //     toast({
  //       title: "Success",
  //       description: "Form created successfully",
  //     });
  //     router.push(`/builder/${formId}`);
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Something went wrong, please try again later",
  //       variant: "destructive",
  //     });
  //   }
  // }
  const router = useRouter();
  const form = useForm<formSchemaType>({ resolver: zodResolver(formSchema) });
  const [isAdmin, setIsAdmin] = useState(true); // State to track if the user is an admin
  const [loading, setLoading] = useState(false); // State to manage loading

  const checkAdminCredentials = async () => {
    setLoading(true);
    const admin = await getAdminByclerkID();
    setLoading(false);
    if (!admin) {
      setIsAdmin(false);
    } else {
      setIsAdmin(true);
      // Continue with form creation process
    }
  };

  async function onSubmit(values: formSchemaType) {
    try {
      if (!isAdmin) {
        throw new Error("No admin credentials");
      }
      const formId = await CreateForm(values);
      toast({ title: "Success", description: "Form created successfully" });
      router.push(`/builder/${formId}/`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    }
  }
  // if (loading) return <Loading />;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="group border border-primary/20 min-h-[250px] h-full items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
          onClick={checkAdminCredentials}
        >
          <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary" />
          <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Create new form</p>
        </Button>
      </DialogTrigger>
      {/* <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4"
          onClick={checkAdminCredentials}
        >
          
        </Button>
      </DialogTrigger> */}
      {!isAdmin && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unable to Create Form</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You cannot create a form as you have not set up Credentials for your desktop.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => router.push("/appIdpass")} className="w-full mt-4">
              Set Up Credentials
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
      {isAdmin && (

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>Create a new form to start collecting responses</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
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
        )}
        {loading && <Loading />}
    </Dialog>
  );
}

export default CreateFormBtn;

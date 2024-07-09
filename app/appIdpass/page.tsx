"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import CryptoJS from 'crypto-js';


import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userFormSchema, AdminSchemaType } from "@/schemas/Admin";
import { getAdminByclerkID, setIdPassforApp, updateAdminPassword } from "@/actions/form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ImSpinner2 } from "react-icons/im";
import Loading from "./loading"; // Assuming Loading is in the same directory

function UserIdPasswordPage() {
  const [adminExists, setAdminExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const router = useRouter();
  const form = useForm<AdminSchemaType>({
    resolver: zodResolver(userFormSchema),
  });

  useEffect(() => {
    const fetchAdmin = async () => {
      setLoading(true);
      const admin = await getAdminByclerkID();
      if (admin) {
        setAdminExists(true);
        form.setValue("userId", admin.UID); // Set the user ID if the admin exists
      }
      setLoading(false);
    };

    fetchAdmin();
  }, [form]);

  const onSubmit = async (data: AdminSchemaType) => {
    setLoading(true);
    const saltRounds = 10;
    // const hashedPassword = bcrypt.hashSync(data.password, saltRounds);
    const hashedPassword = CryptoJS.SHA256(data.password).toString(CryptoJS.enc.Hex);

    if(adminExists){
        const responseCode = await updateAdminPassword(data.userId, hashedPassword);
        if (responseCode === 404 || responseCode === 500) {
            toast({
            title: "Error",
            description: "User with this id not found.",
            variant: "destructive",
            });
        } else {
            toast({
            title: "Success",
            description: "ID and Password set successfully.",
            // variant:
            });
            router.push("/");
        }
        setLoading(false);


    }
    else{
    const responseCode = await setIdPassforApp(data.userId, hashedPassword);
    if (responseCode === 401) {
      toast({
        title: "Error",
        description: "User ID already exists. Please choose a different one.",
        variant: "destructive",
      });
      form.reset(); // Reset the form if the user ID exists
    } else {
      toast({
        title: "Success",
        description: "ID and Password set successfully.",
      });
      router.push("/");
    }
    setLoading(false);
}
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (loading) return <Loading />; // Show loading spinner when loading

  return (
    <Card className="mx-auto my-auto text-3xl p-10">
      <CardHeader>
        {adminExists &&  <><CardTitle>Reset Password</CardTitle> <CardDescription  className=" text-red-600 text">Once registered only Password can be changed not User Id</CardDescription> </>}
        {!adminExists &&<><CardTitle>Credentials for Desktop Application</CardTitle><CardDescription>Set User Id and Password for you desktop application</CardDescription></> }
        
        {/* <CardTitle>Desktop App Credentials</CardTitle> */}

        
      </CardHeader>
      <CardContent>
      <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <fieldset disabled={loading}>
                    <FormField control={form.control} name="userId" render={({ field }) => (
                      <FormItem>
                        <FormLabel>User ID</FormLabel>
                        <FormControl>
                          <Input {...field} disabled={adminExists} />
                        </FormControl>
                          {form.formState.errors.userId && <FormMessage>{form.formState.errors.userId.message}</FormMessage>}
                      </FormItem>
                    )}/>
                    <FormField control={form.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type={showPassword ? 'text' : 'password'} {...field} />
                        </FormControl>
                          {/* <button type="button" onClick={togglePasswordVisibility}>Show/Hide</button> */}
                        {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
                      </FormItem>
                    )}/>
                    {/* Add confirm password field here following similar structure */}
                    <Button type="submit" className="w-full mt-4">
                        {!form.formState.isSubmitting && <span>Submit</span>}
                        {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
                    </Button>
                </fieldset>
            </form>
        </Form>
        
      </CardContent>
      {/* <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter> */}
    </Card>
    //     <div className="flex justify-center items-center px-4 w-full">

    //   </div>
  );
}

export default UserIdPasswordPage;

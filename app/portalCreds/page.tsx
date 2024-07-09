"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";

// import CryptoJS from "crypto-js";

import React, {  useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
// import { ImSpinner2 } from "react-icons/im";
// import Loading from "./loading"; // Assuming Loading is in the same directory
import * as z from "zod";
// import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
 
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  GetCompanies,
  
  AddCredsinPortals,

  findCompanyinCreds,
} from "@/actions/form";
// import { AnyArray, set } from "mongoose";
import { DialogClose } from "@radix-ui/react-dialog";

const FormSchema = z.object({
  CompanyName: z.string({
    required_error: "Please select an Company to fetch portal details.",
  }),
});

interface Company {
  _id?: string; // Optional, as it's usually provided by MongoDB
  cname: string;
  portals: Map<string, string[]>;
  entriesDone: boolean;
}

function PortalCreds() {
  const [fetchedComps, setFetchedComps] = useState<Company[]>([]);
  const[selectedCompany, setSelectedCompany] = useState<string>("");
  const [selectedPortals, setSelectedPortals] = useState<Map<string, string[]> | null>(null);
  const portalArray = selectedPortals ? Array.from(selectedPortals, ([name, creds]) => ({ name, creds })) : [];
  const [portalCredsInput, setPortalCredsInput] = useState<PortalsData>({});
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  interface PortalCredentialInputs {
    [key: string]: string;
  }

  interface PortalsData {
    [portalName: string]: PortalCredentialInputs;
  }


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companies = await GetCompanies();
        // console.log("companies", companies);
        setFetchedComps(companies);
      } catch (error) {
        console.error("Error fetching companies:", error);
       
      }
    };
    fetchCompanies();
  }, []);





const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const selectedCompanyName = data.CompanyName;
    setSelectedCompany(selectedCompanyName);
    const selectedCompany = fetchedComps.find((comp) => comp.cname === selectedCompanyName);
    if(selectedCompany && selectedCompany.entriesDone){
      // console.log("selectedCompany", selectedCompanyName);
      const res = await findCompanyinCreds(selectedCompanyName);

      // console.log("res. data", res.data);

      convertPortalCredentials(new Map(Object.entries(res.data)));

      // console.log("data type ", new Map(Object.entries(res.data)));
      setSelectedPortals(selectedCompany.portals);
      // setPortalCredsInput(res.data);
      // await initializePortalCredentials();
// 
    }

    else if (selectedCompany && !selectedCompany.entriesDone) {

      setSelectedPortals(selectedCompany.portals);
      await initializePortalCredentials(selectedCompany.portals);

    } else {
      toast({ title: "Company not found" });
    }
  };

  function convertPortalCredentials(portalCredentials: Map<string, Map<string, string>>){
    const portalsData: PortalsData = {};
  
    // Iterate through the portalCredentials map
    portalCredentials.forEach((credsMap, portalName) => {
      const portalData: PortalCredentialInputs = {};
  
      // Iterate through the credentials map for the current portal
      credsMap.forEach((value, credName) => {
        portalData[credName] = value;
      });
  
      // Assign the portalData to the portalsData object under the portalName
      portalsData[portalName] = portalData;
    });
    // console.log("portalsData", portalsData)
    // console.log("type ", typeof(portalsData))
    setPortalCredsInput(portalsData);
    
  }



  const initializePortalCredentials = async (portals: Map<string, string[]>) => {

    try{
  
      const portalsdata = new Map(Object.entries(portals));

      let initialInputs: PortalsData = {};

      portalsdata.forEach((creds, portalName) => {
        initialInputs[portalName] = creds.reduce((acc: any, cred: any) => {
          acc[cred] = "";
          return acc;
        }, {} as PortalCredentialInputs);
      });
      // console.log("initialInputs", initialInputs);
      setPortalCredsInput(initialInputs);
      // console.log()
    }
    catch(error){
      console.error("Error fetching credentials:", error);
    }
  };

  const handleCredInputChange = (portalName: string, credName: string, value: any) => {
    setPortalCredsInput((prevState) => ({
      ...prevState,
      [portalName]: {
        ...prevState[portalName],
        [credName]: value,
      },
    }));
  };


  const onSend = async (portname: string) => {
    try {
      const response = await AddCredsinPortals(selectedCompany, portalCredsInput, portname);
      // console.log("Response:", response);
      if (response == 200) toast({ title: "Credentials saved successfully" });

      else {
        toast({ title: "Error sending credentials else", variant: "destructive" });
      }
    } 
    catch (error) {
      console.error("Error sending credentials:", error);
      toast({ title: "Error sending credentials", variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto my-auto text-3xl ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="CompanyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Company to fetch Portal details" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fetchedComps.map((comp) => (
                      <SelectItem key={comp._id} value={comp.cname}>
                        {comp.cname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      {selectedPortals && (
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {Array.from(Object.keys(selectedPortals)).map((portalName, index) => (
              <CarouselItem key={index}>
                <div className="p-1">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6">
                          <CardHeader>{portalName}</CardHeader>
                          <CardDescription>{Object.values(selectedPortals)[index].length} credentials</CardDescription>
                          {/* <CardDescription>{index} credentials</CardDescription> */}
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="overflow-y-scroll max-h-screen">
                      {/* <ul>
                        {(Array.from(Object.values(selectedPortals)[index])).map((portalCreds, index1) => (
                          <li key={index1}>{portalCreds as ReactNode}</li>
                          
                        // ))}
                      </ul> */}
                      {Object.keys(portalCredsInput[portalName]).map((credObj, credIndex) => (
                        <div key={credIndex}>
                          <label
                            htmlFor={`${portalName}-${credObj}`}
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            {credObj}
                          </label>
                          <Input
                            id={`${portalName}-${credObj}`}
                            placeholder={credObj as string}
                            value={portalCredsInput[portalName][credObj]}
                            onChange={(e) => handleCredInputChange(portalName, credObj, e.target.value)}
                          />
                        </div>
                      ))}
                      <DialogClose asChild>
                      <Button type="submit" onClick={() => onSend(portalName)}>Send</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}
    </div>
  );
}

export default PortalCreds;

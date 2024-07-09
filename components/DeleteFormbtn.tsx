"use client";
import React from "react";
import { IoTrashBin } from "react-icons/io5";
import { Button } from "./ui/button";
import { DeleteForm } from "@/actions/form";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
// import Loading from '@/app/appIdpass/loading'
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

function DeleteFormbtn({ formId }: { formId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading

  const deleteForm = async () => {
    setLoading(true);
    const res = await DeleteForm(formId);
    setLoading(false);
    // console.log(res);
    if (res == 200) {
      toast({ title: "Success", description: "Form deleted successfully" });
    } else if (res == 404) {
      toast({
        title: "Error",
        description: "Form not found or user does not have permission to delete this form.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Error", description: "Something went wrong, please try again later", variant: "destructive" });
    }
    setOpen(false);
    router.refresh();
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"destructive"} size="icon" className=" mt-2 text-md gap-4 " disabled={loading}>
          {loading && <Loader2 className=" h-4 w-4 animate-spin" />}
          {!loading && <IoTrashBin />}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Form</DialogTitle>
          <DialogDescription>
            All the Submissions and Responses on this form will be deleted forever. 
            <br/>Are you sure you want to Delete this
            form?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => {}}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={deleteForm} disabled={loading}>
            {loading && <Loader2 className=" h-4 w-4 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteFormbtn;

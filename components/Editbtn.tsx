"use client";

import React from "react";
import { Button } from "./ui/button";
// import Link from "next/link";
import { UpdatePublish } from "@/actions/form";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useState } from 'react'
import { Loader2 } from "lucide-react"

function Editbtn({ formId }: { formId: string }) {
  const [loading, setLoading] = useState(false); // State to manage loading
  const router = useRouter();
  const pubform = async () => {
    setLoading(true);
    const res = await UpdatePublish(formId, false);
    // console.log(res);
    router.push(`/builder/${formId}`);
    setLoading(false);
  };

  return (
    // <Link href={`/builder/${formId}`}>
      <Button
        disabled={loading}
        variant="secondary"
        className="w-[200px] text-md gap-4 "
        onClick={() => {
          pubform();
        }}
      >
        {loading &&   <Loader2 className=" h-4 w-4 animate-spin" />}
        Edit
        <FaEdit/>
      </Button>
    // </Link>
  );
}

export default Editbtn;

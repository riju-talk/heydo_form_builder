"use client";
import React from "react";


function FormNotPublished() {
  return (
    //     <Card className="w-full mx-auto my-auto text-3xl p-10">
    //       <CardContent>
    //         <CardHeader>
    //           <CardTitle>Form not published</CardTitle>
    //         </CardHeader>
    //         <CardDescription>
    //           This form is not published yet. Please contact the Owner of the form to publish it.
    //         </CardDescription>
    //       </CardContent>
    //     </Card>
    <div className="flex justify-center w-full h-full items-center p-8">
      <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-red-500 rounded">
        <h1 className="text-3xl font-bold">Form not published</h1>
        <p className="text-muted-foreground">This form is not published yet. Please contact the Owner of the form to publish it.</p>
      </div>
    </div>
  );
}

export default FormNotPublished;

import { GetFormById, GetFormWithSubmissions } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import React, { ReactNode } from "react";
import { StatsCard } from "../../page";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { ElementsType, FormElementInstance } from "@/components/FormElements";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, formatDistance } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Form from "@/models/mongoForm";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";
// import { FaEdit } from "react-icons/fa";
import Editbtn from "@/components/Editbtn";

async function FormDetailPage({
  params,
}: {
  params: {
    id: String;
  };
}) {
  const { id } = params;
  const form = await GetFormById(String(id));
  if (!form) {
    throw new Error("form not found");
  }

  const { visits, submissions } = form;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    // <div className="w-full m-4 md:m-8 lg:m-10 xl:m-12 2xl:m-14">

    //   <div className="py-10 border-b border-muted">
    //     <div className="flex justify-between w-full">
    //       <h1 className="text-4xl font-bold truncate">{form.name}</h1>
    //       <div className="flex gap-4">
    //         {!form.published && (
    //           <Badge variant={"destructive"} className="">
    //             Draft
    //           </Badge>
    //         )}
    //         <Editbtn formId={form._id.toString()} />
    //         {form.published && <VisitBtn shareUrl={form.shareURL} />}
    //       </div>
    //     </div>
    //   </div>

    //   <div className="py-4 border-b border-muted w-full">
    //     <div className="container flex gap-2 items-center justify-between w-full">
    //       <FormLinkShare shareUrl={form.shareURL} />
    //     </div>
    //   </div>

    //   <div className="w-full pt-8 px-4 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ">
    //     <StatsCard
    //       title="Total visits"
    //       icon={<LuView className="text-cyan-400" />}
    //       helperText="All time form visits"
    //       value={visits.toLocaleString() || ""}
    //       loading={false}
    //       className="shadow-md shadow-cyan-400"
    //     />

    //     <StatsCard
    //       title="Total submissions"
    //       icon={<FaWpforms className="text-cyan-400" />}
    //       helperText="All time form submissions"
    //       value={submissions.toLocaleString() || ""}
    //       loading={false}
    //       className="shadow-md shadow-cyan-400"
    //     />

    //     <StatsCard
    //       title="Submission rate"
    //       icon={<HiCursorClick className="text-cyan-400" />}
    //       helperText="Visits that result in form submission"
    //       value={submissionRate.toLocaleString() + "%" || ""}
    //       loading={false}
    //       className="shadow-md shadow-cyan-400"
    //     />

    //     <StatsCard
    //       title="Bounce rate"
    //       icon={<TbArrowBounce className="text-cyan-400" />}
    //       helperText="Visits that leaves without interacting"
    //       value={bounceRate.toLocaleString() + "%" || ""}
    //       loading={false}
    //       className="shadow-md shadow-cyan-400"
    //     />
    //   </div>

    //   {/* <div className="container pt-10"><SubmissionsTable id={form._id.toString()} /></div> */}
    // </div>
    <>
      <div className="py-10 border-b border-muted">
        <div className="flex  container justify-between">
          <h1 className="text-4xl font-bold truncate">{form.name}</h1>
          {/* <div className="flex justify-between gap-4">
          <Editbtn formId= {form._id.toString()} />

        
          <VisitBtn shareUrl={form.shareURL} />
          </div> */}
          <div className="flex gap-4">
            {!form.published && (
              <Badge variant={"destructive"}  >
                Draft
              </Badge>
            )}
            <Editbtn formId={form._id.toString()} />
            {form.published && <VisitBtn shareUrl={form.shareURL} />}
          </div>
        </div>
      </div>
      <div className="py-4 border-b border-muted">
        <div className="container flex gap-2 items-center justify-between">
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>
      <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
        <StatsCard
          title="Total visits"
          icon={<LuView className="text-cyan-400" />}
          helperText="All time form visits"
          value={visits.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-cyan-400"
        />

        <StatsCard
          title="Total submissions"
          icon={<FaWpforms className="text-cyan-400" />}
          helperText="All time form submissions"
          value={submissions.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-cyan-400"
        />

        <StatsCard
          title="Submission rate"
          icon={<HiCursorClick className="text-cyan-400" />}
          helperText="Visits that result in form submission"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-cyan-400"
        />

        <StatsCard
          title="Bounce rate"
          icon={<TbArrowBounce className="text-cyan-400" />}
          helperText="Visits that leaves without interacting"
          value={bounceRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-cyan-400"
        />
      </div>

      <div className="container pt-10">{/* <SubmissionsTable id={form._id.toString()} /> */}</div>
    </>
  );
}

export default FormDetailPage;

type Row = { [key: string]: string } & {
  submittedAt: Date;
};

async function SubmissionsTable({ id }: { id: String }) {
  const form = await GetFormWithSubmissions(id);

  if (!form) {
    throw new Error("form not found");
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[];
  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = [];
  form.FormSubmissions.forEach((submission: Form) => {
    const content = JSON.parse(submission.content);
    rows.push({
      ...content,
      submittedAt: submission.createdAt,
    });
  });

  return (
    <>
      <h1 className="text-2xl font-bold my-4">Submissions</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">Submitted at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell key={column.id} type={column.type} value={row[column.id]} />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      if (!value) break;
      const date = new Date(value);
      node = <Badge variant={"outline"}>{format(date, "dd/MM/yyyy")}</Badge>;
      break;
    case "CheckboxField":
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
  }

  return <TableCell>{node}</TableCell>;
}


import { GetFormStats, GetForms } from "@/actions/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ReactNode, Suspense } from "react";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";
import { Separator } from "@/components/ui/separator";
import CreateFormBtn from "@/components/CreateFormBtn";
// import { Form } from "@prisma/client";
import Form  from "@/models/mongoForm";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import DuplicateFormbtn from "@/components/DuplicateFormbtn";
import DeleteFormbtn from "@/components/DeleteFormbtn";
// import Editbtn from "@/components/Editbtn";
// import { FaEdit } from "react-icons/fa";
// import { UpdatePublish } from "@/actions/form";

export default function Home() {
  return (
    <div className=" pt-4 w-full m-4 md:m-8 lg:m-10 xl:m-12 2xl:m-14">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="text-4xl font-bold col-span-2">Your forms</h2>
      <Separator className="my-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

function StatsCards(props: StatsCardProps) {
  const { data, loading } = props;

  return (
    <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total visits"
        icon={<LuView className="text-cyan-400" />}
        helperText="All time form visits"
        value={data?.visits.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-cyan-400"
      />

      <StatsCard
        title="Total submissions"
        icon={<FaWpforms className="text-cyan-400" />}
        helperText="All time form submissions"
        value={data?.submissions.toLocaleString() || ""}
        loading={loading}
        className="shadow-md shadow-cyan-400"
      />

      <StatsCard
        title="Submission rate"
        icon={<HiCursorClick className="text-cyan-400" />}
        helperText="Visits that result in form submission"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-cyan-400"
      />

      <StatsCard
        title="Bounce rate"
        icon={<TbArrowBounce className="text-cyan-400" />}
        helperText="Visits that leaves without interacting"
        value={data?.submissionRate.toLocaleString() + "%" || ""}
        loading={loading}
        className="shadow-md shadow-cyan-400"
      />
    </div>
  );
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-xs text-muted-foreground pt-1">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return <Skeleton className="border-2 border-primary-/20 h-[190px] w-full" />;
}

async function FormCards() {
  const forms = await GetForms();
  if(forms=== undefined) return (<div>loading</div>)
  return (
    <>

      {forms.map((form:any) => (
        <FormCard key={form._id.toString()} form={form} />
      ))}
    </>
  );
}



function FormCard({ form }: { form: Form }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between ">
          <span className="font-bold truncate">{form.name}</span>
          {form.published && <Badge>Published</Badge>}
          {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
        </CardTitle>
        <CardDescription className="flex items-center justify-between text-muted-foreground text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
          })}
          {form.published && (
            <span className="flex items-center gap-2">
              <LuView className="text-muted-foreground" />
              <span>{form.visits.toLocaleString()}</span>
              <FaWpforms className="text-muted-foreground" />
              <span>{form.submissions.toLocaleString()}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground flex flex-row justify-between gap-6">
        <span className="max-w-[200px] truncate ">

        {form.description || "No description"}
        </span>
          <DeleteFormbtn  formId={form._id.toString()}/>
      </CardContent>

        
      <CardFooter className="flex gap-2 flex-col">
       {/* <div className="flex flex-row gap-2"> */}

          <Button asChild className="w-full mt-2 text-md gap-4">
            <Link href={`/forms/${form._id.toString()}`}>
              View Form <BiRightArrowAlt />
            </Link>
          </Button>

          <DuplicateFormbtn formId={form._id.toString()} />
       {/* </div> */}
       {/* <div className="flex flex-row gap-2">

       <Editbtn formId={form._id.toString()} />
       </div>
         */}
      {/* <Button  asChild variant={"secondary"} className="w-full mt-2 text-md gap-8"  >
            <Link href={`/editor/${form._id.toString()}`}>
              Edit form <FaEdit />
            </Link>
          </Button> */}
        
         
      </CardFooter>
    </Card>
  );
}

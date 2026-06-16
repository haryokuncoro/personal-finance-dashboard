import { auth } from "@/auth";
import { redirect } from "next/navigation";

import  TransactionsReportPage  from "@/components/report-page";
import Navbar from "@/components/navbar";

export default async function ReportPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
    <Navbar />
    <div className="max-w-5xl mx-auto p-10">
      
      <TransactionsReportPage />
    </div>
    </>
  );
}
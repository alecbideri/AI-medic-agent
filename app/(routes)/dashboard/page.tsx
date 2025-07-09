import React from "react";
import { Button } from "@/components/ui/button";
import HistoryList from "@/app/_components/HistoryList";
import DoctorsAgenetList from "@/app/_components/DoctorsAgenetList";
import { PlusCircle } from "lucide-react";
import AddSessionModel from "@/app/_components/AddSessionModel";

const Page = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-2xl">My Dashboard</h2>
        <AddSessionModel />
      </div>
      <HistoryList />
      <DoctorsAgenetList />
    </div>
  );
};
export default Page;

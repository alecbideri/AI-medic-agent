import React from "react";
import { Button } from "@/components/ui/button";
import HistoryList from "@/app/_components/HistoryList";
import DoctorsAgenetList from "@/app/_components/DoctorsAgenetList";
import { PlusCircle } from "lucide-react";

const Page = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="font-bold text-2xl">My Dashboard</h2>
        <Button className="cursor-pointer">
          <PlusCircle /> Consult with Doctor
        </Button>
      </div>
      <HistoryList />
      <DoctorsAgenetList />
    </div>
  );
};
export default Page;

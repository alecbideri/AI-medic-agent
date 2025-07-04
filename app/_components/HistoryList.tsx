"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
  return (
    <div className="mt-10">
      {historyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 border border-dashed rounded-2xl py-4">
          <Image
            src={"/medical-assistance.png"}
            alt="a placeholder"
            width={150}
            height={150}
          />
          <h2 className="font-bold text-xl">No Recent Consultations</h2>
          <p className="text-sm md:text-base">
            It looks like you haven't consulted with any of our doctor
          </p>
          <Button className="cursor-pointer">Start a consultation</Button>
        </div>
      ) : (
        <div>List</div>
      )}
    </div>
  );
};
export default HistoryList;

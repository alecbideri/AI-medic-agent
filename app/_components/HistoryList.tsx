"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AddSessionModel from "@/app/_components/AddSessionModel";
import axios from "axios";
import HistoryTable from "@/app/_components/HistoryTable";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);

  useEffect(() => {
    GetHistory();
  }, []);

  const GetHistory = async () => {
    const result = await axios.get("/api/session-chat?sessionId=all");
    console.log(result.data);
    setHistoryList(result.data);
  };

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
          <AddSessionModel />
        </div>
      ) : (
        <div>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
};
export default HistoryList;

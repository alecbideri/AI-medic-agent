"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const Page = () => {
  const { sessionId } = useParams();

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(
        `/api/session-chat?sessionId=${sessionId}`,
      );
      console.log(result.data);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  return <div>Page</div>;
};
export default Page;

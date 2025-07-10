import React from "react";
import { PricingTable } from "@clerk/nextjs";

const Page = () => {
  return (
    <div className="px-5 md:px-15 lg:px-30 xl:px-60">
      <h2 className="font-bold text-2xl mb-8">Join the Subscription</h2>
      <PricingTable />
    </div>
  );
};
export default Page;

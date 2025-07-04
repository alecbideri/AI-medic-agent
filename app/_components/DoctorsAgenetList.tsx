import React from "react";
import { AIDoctorAgents } from "@/shared/list";
import DoctorAgent from "@/app/_components/DoctorAgent";

const DoctorsAgentList = () => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold">AI Specialists Doctor's we have</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5 ">
        {AIDoctorAgents.map((doctor, index) => (
          <div key={index}>
            <DoctorAgent doctorAgentPropList={doctor} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsAgentList;

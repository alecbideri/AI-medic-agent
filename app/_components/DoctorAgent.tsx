import React from "react";
import Image from "next/image";
import AddSessionModel from "@/app/_components/AddSessionModel";

export type doctorsAgentListProps = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId?: string;
};

type props = {
  doctorAgentPropList: doctorsAgentListProps;
};

const DoctorAgent = ({ doctorAgentPropList }: props) => {
  return (
    <div>
      <Image
        src={doctorAgentPropList.image}
        alt="doctor desc"
        width={200}
        height={300}
        className="w-full h-[250px] object-cover border-3 border-gray-500  rounded-xl "
      />
      <h2 className="font-bold mt-1">{doctorAgentPropList.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-500">
        {doctorAgentPropList.description}
      </p>
    </div>
  );
};
export default DoctorAgent;

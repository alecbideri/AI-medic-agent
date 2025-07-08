import React from "react";
import { doctorsAgentListProps } from "@/app/_components/DoctorAgent";
import Image from "next/image";

type props = {
  doctorAgentPropList: doctorsAgentListProps;
  setSelectedDoctor: any;
  selectedDoctor: doctorsAgentListProps | undefined;
};

const SuggestedDoctorCard = ({
  doctorAgentPropList,
  setSelectedDoctor,
  selectedDoctor,
}: props) => {
  return (
    <div
      className={`flex flex-col gap-1 items-center justify-between border rounded-xl shadow-md p-5 mt-3 hover:border-black cursor-pointer
       ${selectedDoctor?.id == doctorAgentPropList.id && "border-black"}`}
      onClick={() => setSelectedDoctor(doctorAgentPropList)}
    >
      <Image
        src={doctorAgentPropList.image || "/perfect_placeholder.png"}
        alt={doctorAgentPropList.specialist || "/A doctor to help"}
        width={70}
        height={70}
        className="rounded-full object-cover"
      />
      <div className="flex flex-col gap-1">
        <h2 className="font-bold tex-sm">{doctorAgentPropList.specialist}</h2>
        <p className="text-xs">{doctorAgentPropList.description}</p>
      </div>
    </div>
  );
};
export default SuggestedDoctorCard;

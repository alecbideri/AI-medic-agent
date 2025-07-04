import React from "react";
import Image from "next/image";
import { UserButton } from "@clerk/nextjs";

const AppHeader = () => {
  const menuOptions = [
    {
      id: 1,
      name: "Home",
      path: "/home",
    },
    {
      id: 2,
      name: "History",
      path: "/history",
    },
    {
      id: 3,
      name: "Pricing",
      path: "/pricing",
    },
    {
      id: 4,
      name: "Profile",
      path: "/profile",
    },
  ];

  return (
    <div className="flex items-center justify-between p-4 shadow px-10 md:px-15 lg:px-30 xl:px-60">
      <div className=" flex items-center gap-2">
        <Image
          src={"/medic_logo.svg"}
          alt="medic logo"
          width={50}
          height={50}
        />
        <h1 className="text-3xl text-blue-500 font-bold">Medic AI</h1>
      </div>

      {/*Menu options*/}

      <div className="hidden md:flex items-center gap-8">
        {menuOptions.map((option, index) => (
          <div key={index} className="hover:font-bold cursor-pointer">
            <h2>{option.name}</h2>
          </div>
        ))}
      </div>
      <UserButton />
    </div>
  );
};
export default AppHeader;

"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2, PlusCircle } from "lucide-react";
import axios from "axios";
import DoctorAgent, {
  doctorsAgentListProps,
} from "@/app/_components/DoctorAgent";
import SuggestedDoctorCard from "@/app/_components/SuggestedDoctorCard";
import { useRouter } from "next/navigation";

function AddSessionModel() {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] =
    useState<doctorsAgentListProps[]>();
  const [selectedDoctor, setSelectedDoctor] = useState<doctorsAgentListProps>();
  const router = useRouter();

  // start consultation

  const onStartConsultation = async () => {
    setLoading(true);

    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });

    console.log(result.data);

    if (result.data?.sessionId) {
      console.log(result.data?.sessionId);
      router.push("/dashboard/medical-agent/" + result.data?.sessionId);
    }
    setLoading(false);
  };

  const OnClickNext = async () => {
    setLoading(true);
    const result = await axios.post("/api/suggested-doctors", {
      notes: note,
    });

    console.log(result.data);
    setSuggestedDoctors(result.data);
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="w-full mt-2 cursor-pointer">
          <PlusCircle /> Start a consultation
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div>
                <h2>Add Symptoms or Any Other Details</h2>
                <Textarea
                  placeholder="Add Details here..."
                  className="mt-3 h-[150px]"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                <h2>Select the doctor</h2>
                <div className="grid grid-cols-3 gap-10">
                  {suggestedDoctors.map((doctor, index) => (
                    <SuggestedDoctorCard
                      doctorAgentPropList={doctor}
                      key={index}
                      setSelectedDoctor={() => setSelectedDoctor(doctor)}
                      selectedDoctor={selectedDoctor}
                    />
                  ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={"outline"} className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>
          {!suggestedDoctors ? (
            <Button
              disabled={!note || loading}
              className="cursor-pointer"
              onClick={() => OnClickNext()}
            >
              Next
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </Button>
          ) : (
            <Button
              disabled={loading || !selectedDoctor}
              onClick={() => onStartConsultation()}
            >
              Start Consultation
              {loading ? <Loader2 className="animate-spin" /> : <ArrowRight />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddSessionModel;

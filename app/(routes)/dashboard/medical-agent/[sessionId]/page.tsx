"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { doctorsAgentListProps } from "@/app/_components/DoctorAgent";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
type SessionDetail = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: doctorsAgentListProps;
  createdOn: string;
};

type messages = {
  role: string;
  text: string;
};

const Page = () => {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [LiveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(
        `/api/session-chat?sessionId=${sessionId}`,
      );
      console.log(result.data);
      setSessionDetail(result.data[0]);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const StartCall = () => {
    // Check if API key exists
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    if (!apiKey) {
      console.error("VAPI API key is missing!");
      return;
    }

    // Check if session detail is available
    if (!sessionDetail?.selectedDoctor) {
      console.error("Session detail or selected doctor is missing");
      return;
    }

    try {
      const vapi = new Vapi(apiKey);

      // Set the instance immediately after creating it
      setVapiInstance(vapi);

      const VapiAgentConfig = {
        name: "AI Medical Doctor Voice Agent",
        firstMessage:
          "Hi there! , I am your AI Medical Assistant. I am here to help you with any health issues.",
        transcriber: {
          provider: "assembly-ai",
          language: "en",
        },
        voice: {
          provider: "playht",
          voiceId: sessionDetail?.selectedDoctor?.voiceId,
        },
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: sessionDetail?.selectedDoctor?.agentPrompt,
            },
          ],
        },
      };

      console.log("Vapi Config:", VapiAgentConfig);

      // Add error event handler first
      vapi.on("error", (error) => {
        console.error("Vapi error:", error);
        setCallStarted(false);
      });

      // Set up all event handlers BEFORE starting the call
      vapi.on("call-start", () => {
        console.log("Call started");
        setCallStarted(true);
      });

      vapi.on("call-end", () => {
        setCallStarted(false);
        console.log("Call ended");
      });

      vapi.on("message", (message) => {
        try {
          if (message.type === "transcript") {
            const { role, transcriptType, transcript } = message;
            console.log(`${message.role}: ${message.transcript}`);

            if (transcriptType === "partial") {
              setLiveTranscript(transcript);
              setCurrentRole(role);
            } else {
              // final transcript
              setMessages((prev: any) => [
                ...prev,
                { role: role, text: transcript },
              ]);
              setLiveTranscript("");
              setCurrentRole(null);
            }
          }
        } catch (messageError) {
          console.error("Error processing message:", messageError);
        }
      });

      vapi.on("speech-start", () => {
        console.log("Assistant started speaking");
        setCurrentRole("assistant");
      });

      vapi.on("speech-end", () => {
        console.log("Assistant stopped speaking");
        setCurrentRole("user");
      });

      // Start the call after all event handlers are set up
      //@ts-ignore
      vapi.start(VapiAgentConfig);
    } catch (error) {
      console.error("Failed to initialize or start Vapi call:", error);
      setCallStarted(false);
      setVapiInstance(null);
    }
  };

  // End call

  const endCall = () => {
    if (!vapiInstance) return;

    vapiInstance.stop();

    // Remove listners (for memory management)
    vapiInstance.off("call-start");
    vapiInstance.off("call-end");
    vapiInstance.off("message");

    // reset call states

    setCallStarted(false);
    setVapiInstance(null);
  };

  return (
    <div className="p-5 border bg-secondary rounded-lg">
      <div className="flex justify-between">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4  rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"}`}
          />
          {callStarted ? "connected..." : "Not Connected"}
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>

      {sessionDetail && (
        <div className="flex items-center flex-col mt-10">
          <Image
            src={
              sessionDetail?.selectedDoctor?.image || "/perfect_placeholder.png"
            }
            alt={
              sessionDetail?.selectedDoctor?.specialist || "/A doctor to help"
            }
            width={80}
            height={80}
            className="h-[100px] w-[100px] object-cover rounded-full"
          />
          <h2 className="mt-2 text-lg">
            {sessionDetail?.selectedDoctor?.specialist}
          </h2>
          <p className="text-sm text-gray-500">AI Medical Voice Agent</p>

          <div className="mt-32 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-53 xl:px-72">
            {messages?.map((msg: messages, index) => {
              return (
                <h2 key={index} className="text-gray-400 p-2">
                  {msg.role}: {msg.text}
                </h2>
              );
            })}

            {LiveTranscript && LiveTranscript?.length > 0 && (
              <h2 className="text-lg">
                {currentRole}
                {LiveTranscript}{" "}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button className="mt-20 cursor-pointer" onClick={StartCall}>
              <PhoneCall />
              Start Call
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              className="mt-20 cursor-pointer"
              onClick={endCall}
            >
              <PhoneOff />
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export default Page;

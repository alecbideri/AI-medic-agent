"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { doctorsAgentListProps } from "@/app/_components/DoctorAgent";
import { Loader, Circle, Loader2, PhoneCall, PhoneOff } from "lucide-react";
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

type MedicalReport = {
  sessionId: string;
  agent: string;
  user: string;
  timestamp: string;
  chiefComplaint: string;
  summary: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medicationsMentioned: string[];
  recommendations: string[];
};

const Page = () => {
  const { sessionId } = useParams();
  const [sessionDetail, setSessionDetail] = useState<SessionDetail>();
  const [callStarted, setCallStarted] = useState(false);
  const [vapiInstance, setVapiInstance] = useState<any>();
  const [currentRole, setCurrentRole] = useState<string | null>();
  const [LiveTranscript, setLiveTranscript] = useState<string>();
  const [messages, setMessages] = useState<messages[]>([]);
  const [isStartingCall, setIsStartingCall] = useState(false);
  const [isEndingCall, setIsEndingCall] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<MedicalReport | null>(
    null,
  );
  const [reportError, setReportError] = useState<string | null>(null);

  useEffect(() => {
    sessionId && GetSessionDetails();
  }, [sessionId]);

  const GetSessionDetails = async () => {
    try {
      const result = await axios.get(
        `/api/session-chat?sessionId=${sessionId}`,
      );
      console.log("Session details:", result.data);
      setSessionDetail(result.data[0]);
    } catch (error) {
      console.error("Error fetching session details:", error);
    }
  };

  const StartCall = async () => {
    setIsStartingCall(true);

    // Check if API key exists
    const apiKey = process.env.NEXT_PUBLIC_VAPI_API_KEY;
    if (!apiKey) {
      console.error("VAPI API key is missing!");
      setIsStartingCall(false);
      return;
    }

    // Check if session detail is available
    if (!sessionDetail?.selectedDoctor) {
      console.error("Session detail or selected doctor is missing");
      setIsStartingCall(false);
      return;
    }

    try {
      const vapi = new Vapi(apiKey);
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

      // Add error event handler first
      vapi.on("error", (error) => {
        console.error("Vapi error:", error);
        setCallStarted(false);
        setIsStartingCall(false);
      });

      // Set up all event handlers BEFORE starting the call
      vapi.on("call-start", () => {
        console.log("Call started");
        setCallStarted(true);
        setIsStartingCall(false); // Stop loading when call actually starts
      });

      vapi.on("call-end", () => {
        setCallStarted(false);
        setIsStartingCall(false);
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
      setIsStartingCall(false);
    }
  };

  // End call
  const endCall = async () => {
    setIsEndingCall(true);

    if (!vapiInstance) {
      setIsEndingCall(false);
      return;
    }

    try {
      vapiInstance.stop();
      vapiInstance.off("call-start");
      vapiInstance.off("call-end");
      vapiInstance.off("message");
      vapiInstance.off("speech-start");
      vapiInstance.off("speech-end");
      vapiInstance.off("error");

      // Reset call states
      setCallStarted(false);
      setVapiInstance(null);

      setIsEndingCall(false);

      // Generate report after call ends
      if (messages.length > 0) {
        console.log("Messages before generating report:", messages);
        await GenerateReport();
      } else {
        console.log("No messages to generate report from");
      }
    } catch (error) {
      console.error("Error ending call:", error);
      setCallStarted(false);
      setVapiInstance(null);
      setIsEndingCall(false);
    }
  };

  // Generating report
  const GenerateReport = async () => {
    setIsGeneratingReport(true);
    setReportError(null);

    try {
      console.log("Generating report with data:", {
        messages,
        sessionDetail,
        sessionId,
      });

      const result = await axios.post("/api/medical-report", {
        messages: messages,
        sessionDetail: sessionDetail,
        sessionId: sessionId,
      });

      console.log("Report generation result:", result.data);
      setGeneratedReport(result.data);
      setIsGeneratingReport(false);

      // Also refresh session details to get updated report
      await GetSessionDetails();

      return result.data;
    } catch (error) {
      console.error("Error generating report:", error);
      setReportError(
        //@ts-ignore
        error.response?.data?.error || "Failed to generate report",
      );
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="p-5 border bg-secondary rounded-lg">
      <div className="flex justify-between">
        <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={`h-4 w-4 rounded-full ${callStarted ? "bg-green-500" : "bg-red-500"}`}
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
            {messages?.slice(-4).map((msg: messages, index) => {
              return (
                <h2 key={index} className="text-gray-400 p-2">
                  {msg.role}: {msg.text}
                </h2>
              );
            })}

            {LiveTranscript && LiveTranscript?.length > 0 && (
              <h2 className="text-lg">
                {currentRole}: {LiveTranscript}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button
              className="mt-20 cursor-pointer"
              onClick={StartCall}
              disabled={isStartingCall || isGeneratingReport}
            >
              {isStartingCall ? (
                <>
                  <Loader2 className="animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <PhoneCall />
                  Start Call
                </>
              )}
            </Button>
          ) : (
            <Button
              variant={"destructive"}
              className="mt-20 cursor-pointer"
              onClick={endCall}
              disabled={isEndingCall || isGeneratingReport}
            >
              {isEndingCall ? (
                <>
                  <Loader2 className="animate-spin" />
                  Ending...
                </>
              ) : (
                <>
                  <PhoneOff />
                  Disconnect
                </>
              )}
            </Button>
          )}

          {isGeneratingReport && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="animate-spin h-4 w-4" />
              Generating medical report...
            </div>
          )}

          {reportError && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-semibold">Error generating report:</p>
              <p className="text-sm">{reportError}</p>
            </div>
          )}

          {generatedReport && (
            <div className="mt-6 p-4 bg-green-100 border border-green-400 rounded-lg w-full max-w-2xl">
              <h3 className="font-bold text-green-800 mb-2">
                Medical Report Generated!
              </h3>
              <div className="text-sm text-green-700 space-y-1">
                <p>
                  <strong>Agent:</strong> {generatedReport.agent}
                </p>
                <p>
                  <strong>Chief Complaint:</strong>{" "}
                  {generatedReport.chiefComplaint}
                </p>
                <p>
                  <strong>Summary:</strong> {generatedReport.summary}
                </p>
                <p>
                  <strong>Symptoms:</strong>{" "}
                  {generatedReport.symptoms?.join(", ")}
                </p>
                <p>
                  <strong>Duration:</strong> {generatedReport.duration}
                </p>
                <p>
                  <strong>Severity:</strong> {generatedReport.severity}
                </p>
                <p>
                  <strong>Recommendations:</strong>
                </p>
                <ul className="list-disc list-inside ml-2">
                  {generatedReport.recommendations?.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Debug info */}
          {messages.length > 0 && (
            <div className="mt-4 p-3 bg-gray-100 border rounded-lg w-full max-w-2xl">
              <h4 className="font-semibold text-gray-800 mb-2">Debug Info:</h4>
              <p className="text-sm text-gray-600">
                Messages count: {messages.length}
              </p>
              <Button
                onClick={GenerateReport}
                disabled={isGeneratingReport}
                className="mt-2"
                size="sm"
              >
                {isGeneratingReport ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Generating...
                  </>
                ) : (
                  "Test Generate Report"
                )}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Page;

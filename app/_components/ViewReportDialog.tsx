import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetail } from "@/app/(routes)/dashboard/medical-agent/[sessionId]/page";
import { X, Stethoscope } from "lucide-react";
import moment from "moment";

type Props = {
  record: SessionDetail;
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

const ViewReportDialog = ({ record }: Props) => {
  // Parse the report JSON data
  const reportData: MedicalReport = record.report as unknown as MedicalReport;

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"link"} size={"sm"} className="cursor-pointer">
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <DialogTitle className="text-xl font-bold text-blue-600">
                Medical AI Voice Agent Report
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Session Info */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">
              Session Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Doctor:</span>
                <span className="ml-2 text-gray-600">
                  {record.selectedDoctor.specialist}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">User:</span>
                <span className="ml-2 text-gray-600">
                  {reportData?.user || "Anonymous"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Consulted On:</span>
                <span className="ml-2 text-gray-600">
                  {moment(record.createdOn).format("MMMM Do YYYY, h:mm a")}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Agent:</span>
                <span className="ml-2 text-gray-600">
                  {reportData?.agent ||
                    `${record.selectedDoctor.specialist} AI`}
                </span>
              </div>
            </div>
          </div>

          {/* Chief Complaint */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">
              Chief Complaint
            </h3>
            <p className="text-gray-700">
              {reportData?.chiefComplaint ||
                record.notes ||
                "No chief complaint recorded."}
            </p>
          </div>

          {/* Summary */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">
              Summary
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {reportData?.summary || "No summary available."}
            </p>
          </div>

          {/* Symptoms */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">
              Symptoms
            </h3>
            {reportData?.symptoms && reportData.symptoms.length > 0 ? (
              <ul className="space-y-1">
                {reportData.symptoms.map((symptom, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="text-gray-700">{symptom}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No symptoms recorded.</p>
            )}
          </div>

          {/* Duration & Severity */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">
              Duration & Severity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="ml-2 text-gray-600">
                  {reportData?.duration || "Not specified"}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Severity:</span>
                <span className="ml-2 text-gray-600">
                  {reportData?.severity || "Not specified"}
                </span>
              </div>
            </div>
          </div>

          {/* Medications Mentioned */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">
              Medications Mentioned
            </h3>
            {reportData?.medicationsMentioned &&
            reportData.medicationsMentioned.length > 0 ? (
              <ul className="space-y-1">
                {reportData.medicationsMentioned.map((medication, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="text-gray-700">{medication}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No medications mentioned.</p>
            )}
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3 border-b-2 border-blue-200 pb-1">
              Recommendations
            </h3>
            {reportData?.recommendations &&
            reportData.recommendations.length > 0 ? (
              <ul className="space-y-1">
                {reportData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recommendations provided.</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <p className="text-sm text-blue-800 text-center">
              This report was generated by an AI Medical Assistant for
              informational purposes only.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;

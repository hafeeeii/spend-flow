import React from "react";
import { X, Clock, FileText, CheckCircle2, XCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PurchaseRequest } from "../types"

interface RequestDrawerProps {
  request: PurchaseRequest | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
}

export function RequestDrawer({
  request,
  onClose,
  onApprove,
  onReject,
}: RequestDrawerProps) {
  if (!request) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xs z-40 transition-all animate-fade-in"
      />
      <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] bg-white shadow-2xl z-50 transform translate-x-0 transition-transform duration-200 ease-in-out border-l border-slate-100 flex flex-col h-full">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Request Details
            </span>
            <h2 className="text-base font-extrabold text-slate-900 mt-2">
              {request.id}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title & Requester */}
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-955 leading-snug">
              {request.title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              {request.description}
            </p>

            <div className="flex items-center space-x-3 p-3 bg-slate-50/50 border border-slate-100/50 rounded-xl">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={request.requester.avatar}
                  alt={request.requester.name}
                />
                <AvatarFallback className="text-xs font-bold">
                  {request.requester.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-extrabold text-slate-800">
                  {request.requester.name}
                </p>
                <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                  {request.requester.role} • {request.requester.department}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Metrics */}
          <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4">
            <div>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Requested Amount
              </span>
              <span className="text-lg font-black text-slate-950 mt-1 block">
                $
                {request.amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div>
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Budget Category
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1.5 block">
                {request.budgetCategory}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Vendor
              </span>
              <span className="text-xs font-bold text-slate-800 mt-1.5 block">
                {request.vendor}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                Current Stage
              </span>
              <span className="text-xs font-bold text-indigo-600 mt-1.5 block flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{request.currentStage}</span>
              </span>
            </div>
          </div>

          {/* Workflow approval Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Approval Workflow Path
            </h4>
            <div className="space-y-4 relative pl-4 border-l border-slate-100 ml-2">
              {request.timeline.map((step, idx) => {
                const isCompleted = step.status === "completed";
                const isActive = step.status === "active";
                const isRejected = step.status === "rejected";
                return (
                  <div key={idx} className="relative">
                    {/* Dot indicator */}
                    <span
                      className={`absolute -left-[20.5px] top-1.5 w-3 h-3 rounded-full border-2 ${
                        isCompleted
                          ? "bg-emerald-500 border-white shadow-sm"
                          : isActive
                            ? "bg-indigo-600 border-white ring-2 ring-indigo-100"
                            : isRejected
                              ? "bg-rose-500 border-white"
                              : "bg-white border-slate-200"
                      }`}
                    />
                    <div>
                      <p
                        className={`text-xs font-bold ${isActive ? "text-indigo-600" : "text-slate-800"}`}
                      >
                        {step.stage}
                      </p>
                      <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                        {step.actor}{" "}
                        {step.timestamp &&
                          `• ${new Date(step.timestamp).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Attachments Section */}
          {request.attachments.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Attachments
              </h4>
              {request.attachments.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold"
                >
                  <div className="flex items-center space-x-2 text-slate-700">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>{file.name}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-semibold">
                    {file.size}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Comments Section */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Discussion logs
            </h4>
            {request.comments.length > 0 ? (
              <div className="space-y-3">
                {request.comments.map((comm, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50/50 border border-slate-100/50 rounded-xl space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={comm.avatar} alt={comm.author} />
                        <AvatarFallback className="text-[9px]">
                          {comm.author.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-800">
                          {comm.author}
                        </span>
                        <span className="text-[8px] text-slate-400 font-semibold ml-2">
                          {new Date(comm.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-semibold">
                      {comm.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 font-medium">
                No comments or logs added yet.
              </p>
            )}
          </div>
        </div>

        {/* Actions Footer - Only active if status is pending and step is active */}
        {request.status === "pending" && (
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex space-x-3">
            <button
              onClick={() => onApprove(request.id)}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-extrabold transition shadow-xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Approve Request</span>
            </button>
            <button
              onClick={() => {
                const reason = prompt("Please provide a rejection reason:");
                if (reason) onReject(request.id, reason);
              }}
              className="py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-rose-600 hover:border-slate-300 rounded-lg text-xs font-extrabold transition shadow-2xs flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <XCircle className="h-4 w-4" />
              <span>Reject</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

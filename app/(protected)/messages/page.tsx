"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Send, Phone, Video, CheckCheck,
  ShieldCheck, FileText, Sparkles,
} from "lucide-react";

type Msg = {
  id: string;
  from: "doctor" | "patient";
  text: string;
  time: string;
  read: boolean;
};

const INITIAL_MESSAGES: Msg[] = [
  {
    id: "m1",
    from: "patient",
    text: "Good morning Dr. Meera. I've finished today's knee flexion workout with 10 completed reps.",
    time: "09:24 AM",
    read: true,
  },
  {
    id: "m2",
    from: "doctor",
    text: "Excellent work Arjun. I saw your range reached 82° today on your dashboard. How did the joint feel during the last set?",
    time: "09:35 AM",
    read: true,
  },
  {
    id: "m3",
    from: "patient",
    text: "Mild tightness around the incision, but pain stayed around 3/10. Swelling is down from yesterday.",
    time: "09:38 AM",
    read: true,
  },
  {
    id: "m4",
    from: "doctor",
    text: "That is completely expected for Week 3. Please ice for 15 minutes and keep the leg elevated. You are on track to begin light resistance next week.",
    time: "09:42 AM",
    read: true,
  },
];

const PATIENT_QUICK_QUESTIONS = [
  "Can I increase my target angle to 90°?",
  "Is mild tightness after exercise normal?",
  "Should I ice before or after my session?",
  "Request prescription refill for anti-inflammatory",
];

export default function PatientMessagesPage() {
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("recoverx-messages-p1");
        if (saved) return JSON.parse(saved);
      } catch { /* ignore */ }
    }
    return INITIAL_MESSAGES;
  });

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [consultBooked, setConsultBooked] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("recoverx-messages-p1", JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const newMsg: Msg = {
      id: `m-${Date.now()}`,
      from: "patient",
      text,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      read: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate care team physician acknowledgment if running locally
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const doctorReply: Msg = {
        id: `m-doc-${Date.now()}`,
        from: "doctor",
        text: getPhysicianResponse(text),
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        read: true,
      };
      setMessages((prev) => [...prev, doctorReply]);
    }, 1800);
  };

  function getPhysicianResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes("angle") || q.includes("range")) {
      return "Your ROM progress looks strong. Let's aim for 85°–90° on your next session if pain remains below 4/10. Ease into the final degrees slowly.";
    }
    if (q.includes("tightness") || q.includes("swelling") || q.includes("ice")) {
      return "Mild post-exercise stiffness is typical. Apply ice wrapped in a thin towel for 15 minutes, elevate above heart level, and do 10 gentle ankle pumps.";
    }
    if (q.includes("prescription") || q.includes("medicine")) {
      return "I have reviewed your medication chart. Your prescription for Celecoxib 100mg has been forwarded to the clinic pharmacy.";
    }
    return "Thank you for the update. I have reviewed your latest session data and form metrics. Keep up the consistent cadence, and message me if your pain exceeds 5/10.";
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-100px)] min-h-[580px] pb-6">
      {/* Header Bar */}
      <div className="card p-4 mb-4 flex flex-wrap items-center justify-between gap-4 border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              MK
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-[var(--text-1)]">Dr. Meera Kapoor</h2>
              <span className="badge badge-green text-[11px] py-0.5">Primary Orthopaedic Care</span>
            </div>
            <p className="text-xs text-[var(--text-3)]">
              Apollo Orthopaedic Centre · Supervising Physician for Arjun Sharma
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowConsultModal(true)}
            className="btn-ghost text-xs px-3.5 py-2 inline-flex items-center gap-1.5 border border-slate-300 dark:border-slate-700"
          >
            <Video className="w-4 h-4 text-sky-600" />
            Schedule Telehealth
          </button>
          <a
            href="tel:+919876543210"
            className="btn-ghost text-xs px-3.5 py-2 inline-flex items-center gap-1.5 border border-slate-300 dark:border-slate-700"
          >
            <Phone className="w-4 h-4 text-emerald-600" />
            Call Clinic
          </a>
        </div>
      </div>

      {/* Main Chat Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 min-h-0">
        {/* Messages Pane */}
        <div className="card flex flex-col overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--bg-card)]">
          {/* Message History */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            <div className="text-center my-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--text-3)] px-3 py-1 rounded-full bg-[var(--bg-subtle)] border border-[var(--border)]">
                End-to-End Encrypted Telemedicine Channel
              </span>
            </div>

            {messages.map((m) => {
              const isPatient = m.from === "patient";
              return (
                <div
                  key={m.id}
                  className={`flex ${isPatient ? "justify-end" : "justify-start"} gap-2.5 items-end`}
                >
                  {!isPatient && (
                    <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mb-1">
                      Dr
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] md:max-w-[70%] rounded-2xl p-4 shadow-sm ${
                      isPatient
                        ? "bg-gradient-to-r from-sky-600 to-sky-700 text-white rounded-br-xs"
                        : "bg-slate-100 dark:bg-slate-800 text-[var(--text-1)] border border-[var(--border)] rounded-bl-xs"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <div
                      className={`text-[10px] mt-2 flex items-center justify-end gap-1.5 ${
                        isPatient ? "text-sky-200" : "text-[var(--text-3)]"
                      }`}
                    >
                      <span>{m.time}</span>
                      {isPatient && <CheckCheck className="w-3.5 h-3.5 text-sky-200" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold">
                  Dr
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-full border border-[var(--border)] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Questions Suggestions */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--bg-subtle)] overflow-x-auto flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[var(--text-3)] uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-500" /> Quick:
            </span>
            {PATIENT_QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-[var(--text-2)] hover:border-sky-500 hover:text-sky-500 whitespace-nowrap transition-all shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3.5 border-t border-[var(--border)] flex items-center gap-2 bg-[var(--bg-card)]"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message to Dr. Meera..."
              className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] text-[var(--text-1)] rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--primary)] transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="btn-primary rounded-full p-2.5 px-4 inline-flex items-center gap-1.5 disabled:opacity-50 text-sm shadow-md"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Clinical Sidebar / Care Team Card */}
        <div className="hidden lg:flex flex-col gap-4">
          <div className="card p-5 border border-[var(--border)]">
            <div className="flex items-center gap-2.5 mb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <h3 className="font-display font-bold text-sm text-[var(--text-1)]">Care Team Summary</h3>
            </div>
            <div className="space-y-3 text-xs text-[var(--text-2)]">
              <div>
                <span className="text-[var(--text-3)] block text-[10px] uppercase tracking-wider font-semibold">
                  Surgical Protocol
                </span>
                <span className="font-medium text-[var(--text-1)]">Total Knee Replacement (Week 3)</span>
              </div>
              <div>
                <span className="text-[var(--text-3)] block text-[10px] uppercase tracking-wider font-semibold">
                  Active Goal
                </span>
                <span className="font-medium text-[var(--text-1)]">Reach 90° Flexion by Week 4</span>
              </div>
              <div>
                <span className="text-[var(--text-3)] block text-[10px] uppercase tracking-wider font-semibold">
                  Next Follow-up
                </span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">June 2, 2026 · In-clinic</span>
              </div>
            </div>
          </div>

          <div className="card p-5 border border-[var(--border)] bg-gradient-to-br from-sky-500/5 to-emerald-500/5">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-sky-500" />
              <h4 className="font-display font-semibold text-xs text-[var(--text-1)]">Physician Notes</h4>
            </div>
            <p className="text-xs text-[var(--text-2)] leading-relaxed italic">
              &quot;Patient shows good adherence and minimal swelling. Recommend continuing heel slides and quad sets twice daily.&quot;
            </p>
            <div className="mt-4 pt-3 border-t border-[var(--border)] flex justify-between items-center text-[11px]">
              <span className="text-[var(--text-3)]">Updated 2d ago</span>
              <Link href="/reports" className="text-sky-600 font-semibold hover:underline">
                View Full Plan →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Telehealth Modal */}
      {showConsultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="card max-w-md w-full p-6 text-center border border-[var(--border)]">
            <div className="w-14 h-14 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center mx-auto mb-4">
              <Video className="w-7 h-7" />
            </div>

            <h3 className="font-display font-bold text-xl text-[var(--text-1)] mb-2">
              Schedule Telehealth Video Visit
            </h3>
            <p className="text-xs text-[var(--text-2)] mb-6">
              Connect directly with Dr. Meera Kapoor for a 15-minute rehabilitation video consultation.
            </p>

            {consultBooked ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-4">
                ✓ Consultation request confirmed for Tomorrow at 10:30 AM!
              </div>
            ) : (
              <div className="space-y-3 mb-6 text-left text-xs">
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] flex items-center justify-between">
                  <span>Available Slot: Tomorrow, 10:30 AM</span>
                  <span className="badge badge-green text-[10px]">Confirmed Open</span>
                </div>
                <div className="p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-subtle)] flex items-center justify-between">
                  <span>Platform: RecoverX Secure HD Video</span>
                  <span className="text-[var(--text-3)]">WebRTC TLS</span>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              {!consultBooked ? (
                <button
                  onClick={() => setConsultBooked(true)}
                  className="btn-primary flex-1 py-2.5 text-sm"
                >
                  Confirm Video Visit
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowConsultModal(false);
                    setConsultBooked(false);
                  }}
                  className="btn-primary flex-1 py-2.5 text-sm"
                >
                  Done
                </button>
              )}
              <button
                onClick={() => {
                  setShowConsultModal(false);
                  setConsultBooked(false);
                }}
                className="btn-ghost px-4 py-2.5 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assistantQuestions } from "../data/reports";

const navItems = [
  ["Dashboard", "/dashboard", "D"],
  ["Real-time Monitoring", "/real-time", "M"],
  ["Report Centre", "/reports", "R"],
  ["Settings", "/settings", "S"],
];

export default function AppShell({ children, toast }) {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-slate-200 bg-white px-4 py-5">
        <div className="flex items-center gap-3 px-2">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-violet-600 to-blue-500 text-sm font-black text-white">
            CC
          </div>
          <div>
            <p className="font-semibold text-slate-950">CloudCore AI Tower</p>
            <p className="text-xs text-slate-500">Monitoring PoC</p>
          </div>
        </div>
        <nav className="mt-8 space-y-2">
          {navItems.map(([label, href, icon]) => (
            <NavLink
              key={href}
              to={href}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                  isActive ? "bg-violet-50 text-violet-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`
              }
            >
              <span className="grid h-7 w-7 place-items-center rounded-md border border-slate-200 bg-white text-xs">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-5 left-4 right-4 rounded-lg border border-blue-100 bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">Demo mode</p>
          <p className="mt-1 text-xs leading-5 text-blue-700">AI outputs are simulated and reviewed by humans.</p>
        </div>
      </aside>
      <div className="min-w-0 pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-end border-b border-slate-200 bg-white/90 px-8 backdrop-blur">
          <div className="flex min-w-0 items-center gap-4">
            <button
              aria-label="Open high-risk alert report"
              className="relative grid h-10 w-10 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              onClick={() => navigate("/reports/high-risk-escalation")}
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M18 9C18 6.23858 15.7614 4 13 4H11C8.23858 4 6 6.23858 6 9V13.7639C6 14.5215 5.72888 15.254 5.23534 15.8293L4.5 16.6875C4.21913 17.0152 4.45217 17.5 4.88378 17.5H19.1162C19.5478 17.5 19.7809 17.0152 19.5 16.6875L18.7647 15.8293C18.2711 15.254 18 14.5215 18 13.7639V9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M10 20H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-950">Team 3</p>
              <p className="text-xs text-slate-500">Network Admin</p>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-slate-900 text-sm font-bold text-white">T3</div>
          </div>
        </header>
        <main className="px-8 py-7">{children}</main>
      </div>
      <button
        className="fixed bottom-6 right-6 z-30 rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-blue-500/25"
        onClick={() => setAssistantOpen(true)}
      >
        Ask AI Assistant
      </button>
      {assistantOpen && <AssistantPanel onClose={() => setAssistantOpen(false)} />}
      {toast && <div className="fixed bottom-24 right-6 z-40 rounded-lg border border-emerald-200 bg-white px-4 py-3 text-sm font-semibold text-emerald-700 shadow-panel">{toast}</div>}
    </div>
  );
}

function AssistantPanel({ onClose }) {
  const bottomRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      from: "assistant",
      text: "Hi, I’m the CloudCore AI Assistant. I can help operations staff request a targeted network check based on available monitoring data. Please choose one of the suggested questions below to start a demo check.",
      quickReplies: true,
    },
  ]);
  const [custom, setCustom] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const chooseQuestion = (question) => {
    setMessages((current) => [
      ...current,
      { from: "user", text: question.label },
      { from: "assistant", text: `${question.recommendationText} Would you like to start this check?`, actions: true },
    ]);
  };

  const addAssistantMessage = (text) => setMessages((current) => [...current, { from: "assistant", text }]);
  const submitCustom = () => {
    const userText = custom.trim() || "Custom investigation request";
    setCustom("");
    setMessages((current) => [
      ...current,
      { from: "user", text: userText },
      {
        from: "assistant",
        text: "This prototype is currently running in demo mode. Free-text investigation is not available in this version. Please select one of the suggested questions above to continue the demo.",
        quickReplies: true,
      },
    ]);
  };

  return (
    <aside className="fixed inset-y-0 right-0 z-40 flex w-[440px] flex-col border-l border-slate-200 bg-white shadow-2xl">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-950">AI Assistant</h2>
            <p className="mt-1 text-sm text-slate-500">Manual AI-Assisted Network Check</p>
          </div>
          <button className="rounded-md px-3 py-1 text-sm font-semibold text-slate-500 hover:bg-slate-100" onClick={onClose}>Close</button>
        </div>
        <p className="mt-4 rounded-lg bg-violet-50 p-3 text-xs leading-5 text-violet-700">
          Demo mode: Select a suggested question to simulate an AI-assisted network investigation.
        </p>
      </div>
      <div className="flex-1 space-y-3 overflow-auto p-5">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.from === "assistant" ? "justify-start" : "justify-end"}`}>
            <div
              className={`max-w-[88%] rounded-lg p-3 text-sm leading-6 ${
                message.from === "assistant" ? "bg-slate-100 text-slate-700" : "bg-blue-50 text-blue-800"
              }`}
            >
              <p className="whitespace-pre-line">{message.text}</p>
              {message.quickReplies && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {assistantQuestions.map((question) => (
                    <button
                      key={question.label}
                      className="rounded-full border border-violet-200 bg-white px-3 py-1.5 text-left text-xs font-semibold text-violet-700 transition hover:border-violet-400 hover:bg-violet-50"
                      onClick={() => chooseQuestion(question)}
                    >
                      {question.label.replace(/\.$/, "")}
                    </button>
                  ))}
                </div>
              )}
              {message.actions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    className="rounded-lg bg-gradient-to-r from-violet-600 to-blue-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
                    onClick={() =>
                      addAssistantMessage(
                        "Check started. The AI system is analysing the selected monitoring data.\nEstimated completion time: 1 hour.\nOnce completed, a report will be sent to your registered email address and added to the Report Centre.\nStatus: In Progress.",
                      )
                    }
                  >
                    Start Check
                  </button>
                  <button
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    onClick={() => addAssistantMessage("The check has been cancelled. You can select another suggested question when ready.")}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="border-t border-slate-200 p-5">
        <div className="flex gap-2">
          <input
            className="input"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                submitCustom();
              }
            }}
            placeholder="Type a custom request"
          />
          <button
            className="btn-secondary"
            onClick={submitCustom}
          >
            Send
          </button>
        </div>
      </div>
    </aside>
  );
}

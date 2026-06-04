import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import "./styles.css";
import { dashboardMetrics, monitoringInputs, networkMetrics } from "./data/dashboard";
import { recipients, reports } from "./data/reports";
import AppShell from "./components/AppShell";
import Badge from "./components/Badge";
import Modal from "./components/Modal";

const operatorName = "Team 3";

function timestamp() {
  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

function App() {
  const [logsBySlug, setLogsBySlug] = useState(() =>
    Object.fromEntries(reports.map((report) => [report.slug, report.initialLogs])),
  );
  const [toast, setToast] = useState("");
  const [sendReport, setSendReport] = useState(null);

  const addLog = (slug, entry) => {
    setLogsBySlug((current) => ({
      ...current,
      [slug]: [...(current[slug] || []), entry],
    }));
    setToast(`${entry.status} action logged for ${reports.find((item) => item.slug === slug)?.shortTitle}.`);
    window.setTimeout(() => setToast(""), 2600);
  };

  const highRisk = reports.find((report) => report.slug === "high-risk-escalation");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <AppShell toast={toast}>
              <DashboardPage />
            </AppShell>
          }
        />
        <Route
          path="/real-time"
          element={
            <AppShell toast={toast}>
              <RealtimePage onSend={() => setSendReport(highRisk)} />
            </AppShell>
          }
        />
        <Route
          path="/reports"
          element={
            <AppShell toast={toast}>
              <ReportCentrePage />
            </AppShell>
          }
        />
        <Route
          path="/reports/:slug"
          element={
            <AppShell toast={toast}>
              <ReportDetailPage logsBySlug={logsBySlug} addLog={addLog} />
            </AppShell>
          }
        />
        <Route
          path="/action-log"
          element={
            <AppShell toast={toast}>
              <ActionLogPage logsBySlug={logsBySlug} />
            </AppShell>
          }
        />
        <Route
          path="/settings"
          element={
            <AppShell toast={toast}>
              <SettingsPage />
            </AppShell>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {sendReport && (
        <SendReportModal
          report={sendReport}
          onCancel={() => setSendReport(null)}
          onConfirm={(entry) => {
            addLog(sendReport.slug, entry);
            setSendReport(null);
          }}
        />
      )}
    </BrowserRouter>
  );
}

function LoginPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="grid h-[52px] w-[52px] place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-lg shadow-blue-500/25">
            <svg aria-hidden="true" className="h-7 w-7" viewBox="0 0 28 28" fill="none">
              <path d="M14 7V13M14 13H7V20M14 13H21V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11.5 4.5H16.5V9.5H11.5V4.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M4.5 18.5H9.5V23.5H4.5V18.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M18.5 18.5H23.5V23.5H18.5V18.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="mt-4 text-[25px] font-bold leading-tight text-slate-950">CloudCore AI Tower</h1>
          <p className="mt-2 max-w-[460px] text-[13px] leading-5 text-slate-600">
            AI-Assisted Network Traffic Anomaly Detection and Predictive Maintenance
          </p>
        </div>
        <form
          className="w-full max-w-[372px] rounded-[14px] border border-slate-200 bg-white px-[26px] py-[27px] shadow-[0_18px_42px_rgba(15,23,42,0.14)]"
          onSubmit={(event) => {
            event.preventDefault();
            navigate("/dashboard");
          }}
        >
          <div className="text-center">
            <h2 className="text-[18px] font-bold leading-6 text-slate-950">Welcome Back</h2>
            <p className="mt-1.5 text-[13px] text-slate-600">Sign in to access your dashboard</p>
          </div>
          <label className="mt-6 block text-[12px] font-semibold text-slate-950">
            Username
            <span className="mt-2 flex h-[42px] items-center gap-3 rounded-[11px] border border-slate-200 bg-white px-3 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
              <svg aria-hidden="true" className="h-[18px] w-[18px] text-slate-500" viewBox="0 0 24 24" fill="none">
                <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.8" />
                <path d="M5.5 20C5.5 16.9624 8.41015 14.5 12 14.5C15.5899 14.5 18.5 16.9624 18.5 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <input className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-slate-950 outline-none" defaultValue="Team 3" />
            </span>
          </label>
          <label className="mt-4 block text-[12px] font-semibold text-slate-950">
            Password
            <span className="mt-2 flex h-[42px] items-center gap-3 rounded-[11px] border border-slate-200 bg-white px-3 transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-100">
              <svg aria-hidden="true" className="h-[18px] w-[18px] text-slate-500" viewBox="0 0 24 24" fill="none">
                <path d="M7 10V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M6 10H18C18.5523 10 19 10.4477 19 11V20C19 20.5523 18.5523 21 18 21H6C5.44772 21 5 20.5523 5 20V11C5 10.4477 5.44772 10 6 10Z" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              <input className="h-full min-w-0 flex-1 border-0 bg-transparent text-sm font-medium text-slate-950 outline-none placeholder:text-slate-500" type="password" placeholder="Enter password (optional)" />
            </span>
          </label>
          <button className="mt-4 h-[42px] w-full rounded-[10px] bg-gradient-to-r from-violet-600 to-blue-500 px-5 text-sm font-bold text-white shadow-lg shadow-blue-500/20">
            Enter Dashboard
          </button>
          <div className="mt-5 rounded-[10px] border border-violet-100 bg-violet-50/70 px-4 py-3 text-center text-[11px] leading-5 text-slate-600">
            <span className="font-bold text-violet-600">PoC Demo:</span> This is a static prototype. No real authentication is performed.
          </div>
        </form>
        <p className="mt-5 text-center text-[11px] text-slate-500">
          AI detects, explains, and recommends. Human reviewers decide.
        </p>
      </section>
    </main>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const latestCards = [
    {
      title: "Latest Anomaly Detection Report",
      body: "High-risk Region A spike",
      risk: "L5",
      route: "/reports/high-risk-escalation",
    },
    {
      title: "Latest Routine Health Report",
      body: "Weekly network health complete",
      risk: "Low",
      route: "/reports/routine-weekly-monitoring",
    },
    {
      title: "Latest Manual AI-Triggered Report",
      body: "Perth latency review resolved",
      risk: "Low",
      route: "/reports/on-demand-perth-review",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Main Dashboard"
        title="Network operations overview"
        description="Current AI-assisted monitoring state for traffic, latency, packet loss, and reviewable reports."
      />
      <div className="card">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="section-title">Live anomaly trend</h3>
            <p className="section-subtitle">Purple-blue monitoring signal, static demo data</p>
          </div>
          <Badge label="AI watching baseline drift" tone="blue" />
        </div>
        <div className="trend">
          {[26, 34, 31, 45, 43, 60, 56, 73, 68, 82, 76, 90].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {dashboardMetrics.map((metric) => (
            <button
              key={metric.label}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-violet-200 hover:bg-white"
              onClick={() => navigate(metric.clickTarget)}
            >
              <p className="truncate text-sm font-medium text-slate-500">{metric.label}</p>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
                <span className="break-words text-2xl font-semibold text-slate-950">{metric.value}</span>
                <Badge label={metric.status} tone={metric.tone} />
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="section-title">Newest report</h3>
            <p className="section-subtitle">Quick access to the latest AI-generated report summaries.</p>
          </div>
          <Badge label="3 reports" tone="violet" />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {latestCards.map((card) => (
            <button
              key={card.title}
              className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white"
              onClick={() => navigate(card.route)}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h4 className="break-words font-semibold text-slate-950">{card.title}</h4>
                  <p className="mt-2 break-words text-sm text-slate-500">{card.body}</p>
                </div>
                <Badge label={card.risk} tone={card.risk === "L5" ? "red" : "green"} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RealtimePage({ onSend }) {
  const navigate = useNavigate();
  const detectionResults = [
    {
      title: "False Positive Anomaly",
      issue: "Traffic spike detected during scheduled infrastructure maintenance.",
      risk: "Level 3 / Medium",
      riskTone: "amber",
      confidence: "72%",
      explanation:
        "Network traffic volume increased by 245% above historical baseline. Outbound traffic and connection activity were elevated across multiple monitored devices. Human review later linked the activity to scheduled maintenance.",
      recommendedAction: "Record as false positive with documented reasoning. No escalation required.",
      route: "/reports/false-positive-anomaly",
      reviewStatus: "Human review completed / no escalation required",
    },
    {
      title: "Low Confidence Anomaly",
      issue: "Temporary outbound traffic increase with incomplete monitoring records.",
      risk: "Level 3 / Medium",
      riskTone: "amber",
      confidence: "42%",
      explanation:
        "Outbound network traffic and connection activity increased, but some monitoring records were unavailable and indicators were inconsistent. The AI cannot confidently determine whether the activity is a genuine anomaly or normal variation.",
      recommendedAction: "Additional log review and operational investigation are required.",
      route: "/reports/low-confidence-anomaly",
      reviewStatus: "Investigation required",
    },
    {
      title: "High-Risk Escalation",
      issue: "Severe anomalous traffic detected across core network infrastructure.",
      risk: "Level 5 / High",
      riskTone: "red",
      confidence: "91%",
      explanation:
        "Outbound data volume exceeded 800% above historical baseline. Unusual external IP connection patterns were detected and partially matched known data exfiltration signatures.",
      recommendedAction:
        "Mandatory escalation to the Operations Manager and Security Team is required. No operational action should be taken without secondary review.",
      route: "/reports/high-risk-escalation",
      reviewStatus: "Mandatory human review required",
    },
  ];
  const [activeDetectionIndex, setActiveDetectionIndex] = useState(2);
  const activeDetection = detectionResults[activeDetectionIndex];
  const goToDetection = (direction) => {
    setActiveDetectionIndex((current) => (current + direction + detectionResults.length) % detectionResults.length);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Real-time AI Monitoring"
        title="Region A anomaly detection"
        description="AI compares current network activity with historical baseline behaviour and flags review decisions."
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {monitoringInputs.map((item) => (
          <div key={item.title} className="card min-w-0">
            <p className="break-words text-sm font-semibold text-slate-950">{item.title}</p>
            <p className="mt-3 break-words text-sm text-slate-500">{item.detail}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="section-title">Live Anomaly Trend</h3>
            <p className="section-subtitle">
              AI is comparing current network traffic behaviour with historical baseline patterns.
            </p>
          </div>
          <Badge label="Static mock trend" tone="violet" />
        </div>
        <div className="trend">
          {[28, 33, 30, 44, 38, 52, 48, 67, 58, 77, 72, 88].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="section-title">Live Network Metrics</h3>
            <p className="section-subtitle">Current network signals compared against historical baseline values.</p>
          </div>
          <Badge label="Baseline comparison" tone="blue" />
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {networkMetrics.map((metric) => (
            <div key={metric.label} className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <span className="break-words font-semibold text-slate-900">{metric.label}</span>
                <Badge label={metric.status} tone={metric.tone} />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p className="break-words text-slate-600">
                  <span className="font-semibold text-slate-950">Current:</span> {metric.current}
                </p>
                <p className="break-words text-slate-500">
                  <span className="font-semibold text-slate-700">Baseline:</span>{" "}
                  {metric.label === "Traffic Volume" ? "950K requests/hour" : metric.baseline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card border-violet-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet-600">AI Detection Result</p>
            <h3 className="mt-2 break-words text-2xl font-semibold text-slate-950">{activeDetection.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn-secondary" onClick={() => goToDetection(-1)}>Previous</button>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {activeDetectionIndex + 1} of {detectionResults.length}
            </span>
            <button className="btn-secondary" onClick={() => goToDetection(1)}>Next</button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-1">
            {[
              ["Detected Issue", activeDetection.issue],
              ["Risk Level", activeDetection.risk],
              ["Confidence", activeDetection.confidence],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</p>
                <p className="mt-1 break-words text-sm font-medium text-slate-800">{value}</p>
              </div>
            ))}
          </div>
          <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h4 className="font-semibold text-slate-950">AI Explanation</h4>
              <Badge label={activeDetection.risk} tone={activeDetection.riskTone} />
            </div>
            <p className="mt-3 break-words text-sm leading-6 text-slate-600">{activeDetection.explanation}</p>
            <h4 className="mt-5 font-semibold text-slate-950">Recommended Action</h4>
            <p className="mt-2 break-words text-sm leading-6 text-slate-600">{activeDetection.recommendedAction}</p>
            <button className="btn-primary mt-5" onClick={() => navigate(activeDetection.route)}>
              View Report Detail
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

function ReportCentrePage() {
  const navigate = useNavigate();
  const latestCards = [
    {
      title: "Latest Anomaly Detection Report",
      body: "High-risk Region A spike",
      risk: "L5",
      route: "/reports/high-risk-escalation",
    },
    {
      title: "Latest Routine Health Report",
      body: "Weekly network health complete",
      risk: "Low",
      route: "/reports/routine-weekly-monitoring",
    },
    {
      title: "Latest Manual AI-Triggered Report",
      body: "Perth latency review resolved",
      risk: "Low",
      route: "/reports/on-demand-perth-review",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Report Centre"
        title="AI-generated report index"
        description="Five static report records for review, decision logging, and demo sharing flows."
      />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {latestCards.map((card) => (
          <button
            key={card.title}
            className="card min-w-0 text-left transition hover:-translate-y-0.5 hover:border-blue-200"
            onClick={() => navigate(card.route)}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="break-words font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-2 break-words text-sm text-slate-500">{card.body}</p>
              </div>
              <Badge label={card.risk} tone={card.risk === "L5" ? "red" : "green"} />
            </div>
          </button>
        ))}
      </div>
      <div className="card overflow-hidden p-0">
        <div className="border-b border-slate-200 px-5 py-4">
          <h3 className="section-title">All reports</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table min-w-[1040px]">
            <thead>
              <tr>
                {["Report", "Type", "Time", "Risk", "AI Finding", "Recommended Action", "Reviewer", "Action"].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.slug}>
                  <td className="max-w-[180px] break-words font-semibold text-slate-950">{report.shortTitle}</td>
                  <td><Badge label={report.type} tone={report.typeTone} /></td>
                  <td className="whitespace-nowrap">{report.time}</td>
                  <td><Badge label={report.risk} tone={report.riskTone} /></td>
                  <td className="max-w-[220px] break-words">{report.aiFinding}</td>
                  <td className="max-w-[220px] break-words">{report.recommendedActionShort}</td>
                  <td className="max-w-[160px] break-words">{report.reviewer}</td>
                  <td className="whitespace-nowrap"><button className="table-action" onClick={() => navigate(`/reports/${report.slug}`)}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportDetailPage({ logsBySlug, addLog }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const report = reports.find((item) => item.slug === slug);
  const [editOpen, setEditOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);

  if (!report) return <Navigate to="/reports" replace />;
  const logs = logsBySlug[report.slug] || [];

  return (
    <div className="space-y-6">
      <div className={`rounded-lg p-6 text-white ${report.headerClass}`}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/75">AI Generated Report</p>
            <h1 className="mt-2 text-3xl font-semibold">{report.title}</h1>
          </div>
          <button className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold hover:bg-white/25" onClick={() => navigate("/reports")}>
            Back
          </button>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {report.badges.map((badge) => (
            <span key={badge} className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{badge}</span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-[0.95fr_1.05fr] gap-5">
        <ReportBlock title="Metadata" items={report.metadata} />
        <ReportBlock title={report.dataTitle} items={report.detectedData} />
      </div>
      <div className="grid grid-cols-[1.15fr_0.85fr] gap-5">
        <div className="card">
          <h3 className="section-title">AI analysis summary</h3>
          <p className="mt-3 leading-7 text-slate-600">{report.aiSummary}</p>
          {report.explanation && (
            <>
              <h4 className="mt-5 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">{report.explanationTitle}</h4>
              <p className="mt-2 leading-7 text-slate-600">{report.explanation}</p>
            </>
          )}
        </div>
        <div className="card">
          <h3 className="section-title">Recommended action</h3>
          <p className="mt-3 leading-7 text-slate-600">{report.recommendedAction}</p>
          <div className="mt-6 flex gap-3">
            <button
              className="btn-primary"
              onClick={() => addLog(report.slug, { status: "Accepted", operatorName, dateTime: timestamp(), actionDetail: "Report accepted by human reviewer." })}
            >
              Accept
            </button>
            <button className="btn-secondary" onClick={() => setEditOpen(true)}>Edit</button>
            <button className="btn-secondary" onClick={() => setSendOpen(true)}>Send</button>
          </div>
        </div>
      </div>
      <ActionLog logs={logs} />
      {editOpen && (
        <EditReportModal
          onCancel={() => setEditOpen(false)}
          onConfirm={(note) => {
            addLog(report.slug, { status: "Edited", operatorName, dateTime: timestamp(), actionDetail: note || "Report edited by human reviewer." });
            setEditOpen(false);
          }}
        />
      )}
      {sendOpen && (
        <SendReportModal
          report={report}
          onCancel={() => setSendOpen(false)}
          onConfirm={(entry) => {
            addLog(report.slug, entry);
            setSendOpen(false);
          }}
        />
      )}
    </div>
  );
}

function EditReportModal({ onCancel, onConfirm }) {
  const [note, setNote] = useState("");
  return (
    <Modal title="Edit Report Review" onClose={onCancel}>
      <label className="block text-sm font-semibold text-slate-700">
        Edit note / reason
        <textarea className="mt-2 input min-h-32 resize-none" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add the human reviewer decision note..." />
      </label>
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" onClick={() => onConfirm(note)}>Save Edit</button>
      </div>
    </Modal>
  );
}

function SendReportModal({ report, onCancel, onConfirm }) {
  const [selected, setSelected] = useState(["alex", "priya"]);
  const [message, setMessage] = useState("");

  const toggle = (id) => {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const selectedRecipients = recipients.filter((recipient) => selected.includes(recipient.id));

  return (
    <Modal title="Send Report to Reviewers" onClose={onCancel}>
      <p className="text-sm text-slate-500">{report.shortTitle} will be shared in demo mode only. No email is sent.</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        {recipients.map((recipient) => (
          <label key={recipient.id} className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-3 text-sm">
            <input type="checkbox" checked={selected.includes(recipient.id)} onChange={() => toggle(recipient.id)} />
            <span><strong className="block text-slate-900">{recipient.name}</strong><span className="text-slate-500">{recipient.role}</span></span>
          </label>
        ))}
      </div>
      <textarea className="mt-4 input min-h-28 resize-none" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Please review this AI-generated report and advise on the next operational action." />
      <div className="mt-6 flex justify-end gap-3">
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button
          className="btn-primary"
          onClick={() =>
            onConfirm({
              status: "Sent",
              operatorName,
              dateTime: timestamp(),
              actionDetail: `Sent to ${selectedRecipients.map((item) => `${item.name} - ${item.role}`).join(", ") || "no recipients selected"}.`,
              message: message || "Please review this AI-generated report and advise on the next operational action.",
            })
          }
        >
          Confirm Send
        </button>
      </div>
    </Modal>
  );
}

function ActionLog({ logs }) {
  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="section-title">Action Log</h3>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            {["Report Status", "Operator Name", "Date & Time", "Action Detail", "Message"].map((header) => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {logs.map((log, index) => (
            <tr key={`${log.dateTime}-${index}`}>
              <td><Badge label={log.status} tone={log.status === "Accepted" ? "green" : log.status === "Edited" ? "amber" : "blue"} /></td>
              <td>{log.operatorName}</td>
              <td>{log.dateTime}</td>
              <td>{log.actionDetail}</td>
              <td>{log.message || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionLogPage({ logsBySlug }) {
  const allLogs = reports.flatMap((report) => (logsBySlug[report.slug] || []).map((log) => ({ ...log, report: report.shortTitle })));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Action Log"
        title="Human review and sharing history"
        description="Local demo log entries created by Accept, Edit, and Send actions across all reports."
      />
      <div className="card overflow-hidden p-0">
        <table className="data-table">
          <thead>
            <tr>
              {["Report", "Report Status", "Operator Name", "Date & Time", "Action Detail", "Message"].map((header) => <th key={header}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {allLogs.map((log, index) => (
              <tr key={`${log.report}-${log.dateTime}-${index}`}>
                <td className="font-semibold text-slate-950">{log.report}</td>
                <td><Badge label={log.status} tone={log.status === "Accepted" ? "green" : log.status === "Edited" ? "amber" : "blue"} /></td>
                <td>{log.operatorName}</td>
                <td>{log.dateTime}</td>
                <td>{log.actionDetail}</td>
                <td>{log.message || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReportBlock({ title, items }) {
  return (
    <div className="card">
      <h3 className="section-title">{title}</h3>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {items.map(([label, value]) => <Info key={label} label={label} value={value} />)}
      </dl>
    </div>
  );
}

function ReportPreviewTable() {
  const navigate = useNavigate();
  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-slate-200 px-5 py-4">
        <h3 className="section-title">Recent Report Preview</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table min-w-[1040px]">
          <thead>
            <tr>
              {["Report", "Type", "Time", "Risk", "AI Finding", "Recommended Action", "Reviewer", "Action"].map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.slice(0, 5).map((report) => (
              <tr key={report.slug}>
                <td className="max-w-[180px] break-words font-semibold text-slate-950">{report.shortTitle}</td>
                <td><Badge label={report.type} tone={report.typeTone} /></td>
                <td className="whitespace-nowrap">{report.time}</td>
                <td><Badge label={report.risk} tone={report.riskTone} /></td>
                <td className="max-w-[220px] break-words">{report.aiFinding}</td>
                <td className="max-w-[220px] break-words">{report.recommendedActionShort}</td>
                <td className="max-w-[160px] break-words">{report.reviewer}</td>
                <td><button className="table-action" onClick={() => navigate(`/reports/${report.slug}`)}>View</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [avatarVariant, setAvatarVariant] = useState(0);
  const [passwordMessage, setPasswordMessage] = useState("");
  const avatarGradients = [
    "from-violet-600 to-blue-500",
    "from-fuchsia-500 to-sky-500",
    "from-indigo-600 to-cyan-500",
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        description="Manage static profile and security preferences for the CloudCore AI Tower demo workspace."
      />
      <div className="card max-w-5xl">
        <h2 className="text-2xl font-semibold text-slate-950">Profile Settings</h2>
        <div className="mt-7 flex items-center gap-8">
          <div className={`grid h-28 w-28 place-items-center rounded-3xl bg-gradient-to-br ${avatarGradients[avatarVariant]} text-white shadow-lg shadow-blue-500/20`}>
            <svg aria-hidden="true" className="h-14 w-14" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" stroke="currentColor" strokeWidth="1.8" />
              <path d="M5.5 20C5.5 16.9624 8.41015 14.5 12 14.5C15.5899 14.5 18.5 16.9624 18.5 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <button
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-violet-300 hover:bg-violet-50"
              onClick={() => setAvatarVariant((current) => (current + 1) % avatarGradients.length)}
            >
              Change Avatar
            </button>
            <p className="mt-3 text-sm text-slate-500">JPG, PNG or GIF. Max 2MB.</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6">
          <label className="block text-sm font-semibold text-slate-950">
            Team Name
            <input className="mt-2 input cursor-not-allowed bg-slate-50 text-slate-700" value="Team 3" disabled readOnly />
          </label>
          <label className="block text-sm font-semibold text-slate-950">
            Role
            <input className="mt-2 input cursor-not-allowed bg-slate-50 text-slate-700" value="Network Admin" disabled readOnly />
          </label>
          <label className="col-span-2 block text-sm font-semibold text-slate-950">
            Email
            <span className="mt-2 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 text-slate-700">
              <svg aria-hidden="true" className="h-5 w-5 text-slate-500" viewBox="0 0 24 24" fill="none">
                <path d="M4 6.5H20V18.5H4V6.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                <path d="M5 7.5L12 13L19 7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input className="h-[46px] min-w-0 flex-1 cursor-not-allowed border-0 bg-transparent text-sm font-medium text-slate-700 outline-none" value="team3@cloudcore.ai" disabled readOnly />
            </span>
          </label>
        </div>
        <p className="mt-5 rounded-lg border border-violet-100 bg-violet-50 px-4 py-3 text-sm font-medium text-violet-700">
          To change team name, role, or email, please contact your system administrator.
        </p>
      </div>
      <div className="card max-w-5xl">
        <h2 className="text-2xl font-semibold text-slate-950">Security Settings</h2>
        <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
          <h3 className="section-title">Change Password</h3>
          <div className="mt-5 grid grid-cols-3 gap-5">
            <label className="block text-sm font-semibold text-slate-950">
              Current Password
              <input className="mt-2 input" type="password" placeholder="Current password" />
            </label>
            <label className="block text-sm font-semibold text-slate-950">
              New Password
              <input className="mt-2 input" type="password" placeholder="New password" />
            </label>
            <label className="block text-sm font-semibold text-slate-950">
              Confirm New Password
              <input className="mt-2 input" type="password" placeholder="Confirm password" />
            </label>
          </div>
          <div className="mt-5 flex items-center gap-4">
            <button
              className="btn-primary"
              onClick={() => setPasswordMessage("Password change request submitted for demo purposes.")}
            >
              Change Password
            </button>
            {passwordMessage && <p className="text-sm font-semibold text-emerald-700">{passwordMessage}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function PageHeader({ eyebrow, title, description }) {
  return (
    <header>
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-violet-600">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-semibold text-slate-950">{title}</h1>
      <p className="mt-2 text-slate-500">{description}</p>
    </header>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <dt className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-800">{value}</dd>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

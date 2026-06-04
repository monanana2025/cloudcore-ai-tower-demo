export const dashboardMetrics = [
  { label: "Overall Network Status", value: "Degraded", status: "Review", tone: "amber", clickTarget: "/real-time" },
  { label: "Active Alerts", value: "3", status: "Active", tone: "red", clickTarget: "/real-time" },
  { label: "Average Latency", value: "245 ms", status: "Elevated", tone: "orange", clickTarget: "/real-time" },
  { label: "Packet Loss", value: "4.8%", status: "High", tone: "red", clickTarget: "/real-time" },
];

export const monitoringInputs = [
  { title: "Network Traffic Alerts", detail: "Traffic spike alert" },
  { title: "Authentication Logs", detail: "Multiple failed logins" },
  { title: "Firewall Logs", detail: "Blocked external request" },
  { title: "Historical Baseline", detail: "Previous abnormal traffic pattern" },
];

export const networkMetrics = [
  { label: "Traffic Volume", current: "1.8M requests/hour", baseline: "950K", status: "Abnormal", tone: "red" },
  { label: "Latency", current: "245 ms", baseline: "185 ms", status: "Elevated", tone: "orange" },
  { label: "Packet Loss", current: "4.8%", baseline: "1.2%", status: "High", tone: "red" },
  { label: "Error Rate", current: "3.2%", baseline: "0.9%", status: "High", tone: "red" },
];

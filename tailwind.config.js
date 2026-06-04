export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cloud: {
          ink: "#111827",
          muted: "#64748b",
          line: "#e5e7eb",
          panel: "#f8fafc",
          violet: "#6d5dfc",
          blue: "#1688f0",
        },
      },
      boxShadow: {
        panel: "0 18px 50px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

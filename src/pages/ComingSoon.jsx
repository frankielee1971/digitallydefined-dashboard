export default function ComingSoon() {
  return (
    <main
      style={{
        backgroundColor: "#FFFCF9",
        minHeight: "100vh",
        padding: "80px 24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      {/* HEADER */}
      <h1
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "48px",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "#000",
          textAlign: "center",
          marginBottom: "16px",
          letterSpacing: "-0.5px",
        }}
      >
        Coming Soon
      </h1>

      {/* SUBHEAD */}
      <p
        style={{
          fontFamily: "DM Sans, sans-serif",
          fontSize: "20px",
          color: "#2E2E2E",
          textAlign: "center",
          maxWidth: "640px",
          marginBottom: "48px",
          lineHeight: "1.4",
        }}
      >
        The next evolution of the DigitallyDefined OS is almost here.  
        Your Command Center. Your data. Your power.
      </p>

      {/* SCREENSHOT */}
      <img
        src="/coming-soon.png"
        alt="DigitallyDefined Dashboard Preview"
        style={{
          width: "100%",
          maxWidth: "900px",
          border: "2px solid #000",
          display: "block",
        }}
      />

      {/* CTA */}
      <button
        style={{
          marginTop: "48px",
          padding: "16px 32px",
          backgroundColor: "#000",
          color: "#FFF",
          border: "none",
          fontFamily: "Inter, sans-serif",
          fontSize: "16px",
          textTransform: "uppercase",
          cursor: "pointer",
          letterSpacing: "0.5px",
        }}
      >
        Join the Waitlist
      </button>
    </main>
  );
}


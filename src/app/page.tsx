import { FUNDS, INITIAL_COMPANIES } from "../data/mockData";
import { PortfolioManager } from "../components/portfolio/PortfolioManager";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      {/* App header */}
      <header
        style={{
          backgroundColor: "#1e3a5f",
          padding: "0 32px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {/* Logo wordmark */}
          <span
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: "-0.02em",
            }}
          >
            unwritten
          </span>

          {/* Nav tabs */}
          <nav style={{ display: "flex", gap: 4 }}>
            {["Portfolio Manager"].map((item, i) => (
              <span
                key={item}
                style={{
                  color: i === 0 ? "#fff" : "rgba(255,255,255,0.55)",
                  fontSize: 13,
                  fontWeight: i === 0 ? 600 : 400,
                  padding: "6px 12px",
                  borderRadius: 6,
                  backgroundColor:
                    i === 0 ? "rgba(255,255,255,0.12)" : "transparent",
                  cursor: "pointer",
                  transition: "background-color 0.15s",
                }}
              >
                {item}
              </span>
            ))}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.02em",
              }}
            >
              Portfolio Manager
            </h1>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 13,
                color: "#64748b",
              }}
            >
              {FUNDS.length} funds · {INITIAL_COMPANIES.length} companies
            </p>
          </div>
        </div>

        <PortfolioManager initialCompanies={INITIAL_COMPANIES} funds={FUNDS} />
      </div>
    </main>
  );
}

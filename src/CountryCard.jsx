import React from "react";

/*
  CountryCard - small presentational component for makeCommands -> pushComponent
  Expects `country` object from https://restcountries.com/v3.1 responses.
*/
export default function CountryCard({ country }) {
  if (!country) return null;

  const name = country.name?.common || "Unknown";
  const official = country.name?.official || "";
  const cca2 = country.cca2 || "";
  const region = country.region || "";
  const subregion = country.subregion || "";
  const capital = (country.capital && country.capital[0]) || "—";
  const population = country.population ? country.population.toLocaleString() : "—";
  const currencies = country.currencies ? Object.values(country.currencies).map(c => c.name).join(", ") : "—";
  const languages = country.languages ? Object.values(country.languages).join(", ") : "—";
  const flagSvg = country.flags?.svg || country.flags?.png || "";
  const flagEmoji = country.flag || "";

  const regionText = subregion ? `${region} — ${subregion}` : region;

  return (
    <div style={{
      display: "flex",
      gap: "clamp(12px, 3vw, 18px)",
      alignItems: "flex-start",
      maxWidth: 800,
      flexDirection: "row",
      "@media (max-width: 480px)": {
        flexDirection: "column",
        gap: 12
      }
    }}>
      <div style={{
        width: "clamp(120px, 30vw, 220px)",
        minWidth: "120px",
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        background: "#fff",
        padding: "clamp(4px, 1vw, 8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {flagSvg ? (
          <img src={flagSvg} alt={`${name} flag`} style={{ width: "100%", height: "auto", display: "block" }} />
        ) : (
          <div style={{
            fontSize: "clamp(32px, 8vw, 64px)",
            padding: "clamp(8px, 2vw, 18px)"
          }}>{flagEmoji || cca2}</div>
        )}
      </div>

      <div style={{ flex: 1, color: "var(--fg)", minWidth: 0 }}>
        <h3 style={{
          margin: "0 0 6px 0",
          fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
          wordBreak: "break-word"
        }}>
          {name} {official ? <small style={{ color: "var(--muted)", fontWeight: 400 }}>({official})</small> : null}
        </h3>
        <div style={{
          display: "grid",
          gridTemplateColumns: "minmax(60px, auto) 1fr",
          gap: "clamp(4px, 1vw, 6px) clamp(8px, 2vw, 12px)",
          alignItems: "start",
          marginTop: 8,
          fontSize: "clamp(0.85rem, 2vw, 1rem)"
        }}>
          <div style={{ color: "var(--muted)" }}>Code</div><div style={{ wordBreak: "break-word" }}>{cca2}</div>
          <div style={{ color: "var(--muted)" }}>Region</div><div style={{ wordBreak: "break-word" }}>{regionText || "—"}</div>
          <div style={{ color: "var(--muted)" }}>Capital</div><div style={{ wordBreak: "break-word" }}>{capital}</div>
          <div style={{ color: "var(--muted)" }}>Population</div><div style={{ wordBreak: "break-word" }}>{population}</div>
          <div style={{ color: "var(--muted)" }}>Currency</div><div style={{ wordBreak: "break-word" }}>{currencies}</div>
          <div style={{ color: "var(--muted)" }}>Languages</div><div style={{ wordBreak: "break-word" }}>{languages}</div>
        </div>
      </div>
    </div>
  );
}

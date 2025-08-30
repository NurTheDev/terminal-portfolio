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
    <div style={{ display: "flex", gap: 18, alignItems: "flex-start", maxWidth: 800 }}>
      <div style={{
        minWidth: 220,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0,0,0,0.25)",
        background: "#fff",
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {flagSvg ? (
          <img src={flagSvg} alt={`${name} flag`} style={{ width: "100%", height: "auto", display: "block" }} />
        ) : (
          <div style={{
            fontSize: 64,
            padding: 18
          }}>{flagEmoji || cca2}</div>
        )}
      </div>

      <div style={{ flex: 1, color: "var(--fg)" }}>
        <h3 style={{ margin: "0 0 6px 0" }}>
          {name} {official ? <small style={{ color: "var(--muted)", fontWeight: 400 }}>({official})</small> : null}
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "6px 12px", alignItems: "start", marginTop: 8 }}>
          <div style={{ color: "var(--muted)" }}>Code</div><div>{cca2}</div>
          <div style={{ color: "var(--muted)" }}>Region</div><div>{regionText || "—"}</div>
          <div style={{ color: "var(--muted)" }}>Capital</div><div>{capital}</div>
          <div style={{ color: "var(--muted)" }}>Population</div><div>{population}</div>
          <div style={{ color: "var(--muted)" }}>Currency</div><div>{currencies}</div>
          <div style={{ color: "var(--muted)" }}>Languages</div><div>{languages}</div>
        </div>
      </div>
    </div>
  );
}

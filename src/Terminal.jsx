import React from "react";
import { useEffect, useRef, useState } from "react";
import { THEMES, THEME_NAMES } from "./themes";

/*
  Terminal Portfolio - Nur Islam
   - Real terminal look
   - About, Contact, Projects updated with real info
   - Help grid, suggestions, history navigation
*/

const ASCII_LOGO = ` ██████   █████                         █████         ████
▒▒██████ ▒▒███                         ▒▒███         ▒▒███
 ▒███▒███ ▒███  █████ ████ ████████     ▒███   █████  ▒███   ██████   █████████████
 ▒███▒▒███▒███ ▒▒███ ▒███ ▒▒███▒▒███    ▒███  ███▒▒   ▒███  ▒▒▒▒▒███ ▒▒███▒▒███▒▒███
 ▒███ ▒▒██████  ▒███ ▒███  ▒███ ▒▒▒     ▒███ ▒▒█████  ▒███   ███████  ▒███ ▒███ ▒███
 ▒███  ▒▒█████  ▒███ ▒███  ▒███         ▒███  ▒▒▒▒███ ▒███  ███▒▒███  ▒███ ▒███ ▒███
 █████  ▒▒█████ ▒▒████████ █████        █████ ██████  █████▒▒████████ █████▒███ █████
▒▒▒▒▒    ▒▒▒▒▒   ▒▒▒▒▒▒▒▒ ▒▒▒▒▒        ▒▒▒▒▒ ▒▒▒▒▒▒  ▒▒▒▒▒  ▒▒▒▒▒▒▒▒ ▒▒▒▒▒ ▒▒▒ ▒▒▒▒▒
`;

const COMMAND_NAMES = [
  "nurislam","about","age","antonym","ascii","asciiqr","base64","calendar","capitalize","clear","coin",
  "commands","contact","countdays","country","curl","date","define","dice","dns","dnslookup","echo","emoji",
  "geo","github","hash","help","history","ip","json","lowercase","matrix","ping","projects",
  "qr","quote","remind","reset","reverse","rps","set","shorten","shutdown","social","stock",
  "stopwatch","synonym","sysinfo","theme","time","timer","translate","ttt","uppercase","uptime",
  "username","uuid","weather","whoami"
];

// Turn COMMAND_NAMES into command implementations (stubs)
const makeCommands = (applyThemeFn) => {
  const base = {
    help: {
      description: "Show available commands in a grid menu",
      fn: () => "",
    },
    "?": {
      description: "Alias for help",
      fn: () => "",
    },
    about: {
      description: "Short about text",
      fn: () => `👋 Hey there! I’m MD. Nur Islam
💻 Full Stack Web Developer | MERN Stack Enthusiast
📍 Based in Dhaka, Bangladesh

🚀 Passionate about:
   • Building interactive web apps & games 🎮
   • Exploring cybersecurity 🔐
   • Constant self-improvement 📚

⚡ Skills:
   JavaScript | React | Node.js | Express | MongoDB
   TailwindCSS | Firebase | Git & GitHub

🎯 Goals:
   → Craft a jaw-dropping developer portfolio 💥
   → Master MERN & C++
   → Become an expert in Web Development 🛡️

🌟 Fun Facts:
   • I feel proud when my code runs perfectly ✅
   • Books & stories inspire me to dream big 📖✨
   • Introvert but working hard to grow & connect 🤝
   • Always up for a challenge & learning new things 🚀

📫 Let’s connect & create something amazing together!
   Email: nur756.islam@gmail.com
   LinkedIn: linkedin.com/in/nurthedev
   GitHub: github.com/nurthedev`,
    },
    contact: {
      description: "Contact info",
      fn: () => `📧 Email: nur756.islam@gmail.com
🔗 LinkedIn: linkedin.com/in/nurthedev
💻 GitHub: github.com/nurthedev`,
    },
    projects: {
      description: "List projects",
      fn: () => `🚀 Projects:
   • Exclusive E-commerce Website – React, Redux, Firebase, TailwindCSS
   • BD Screens – Video Streaming Site – React, TailwindCSS, Firebase Auth
   • Browse Pet – Pet Services Landing Page – React, Vite, TailwindCSS`,
    },
    clear: {
      description: "Clear the terminal",
      fn: () => ({ clear: true }),
    },
    echo: {
      description: "Echo back text",
      fn: (args) => args.join(" "),
    },
    theme: {
      description: "List available themes",
      fn: () => THEME_NAMES.join("\n"),
    },
    set: {
      description: "Set settings (e.g. set theme <name>)",
      fn: (args) => {
        if (args[0] === "theme") {
          const t = args[1];
          if (!t) return "Usage: set theme <name>";
          if (!THEME_NAMES.includes(t)) return `Unknown theme '${t}'. Use 'theme' to list.`;
          applyThemeFn(t);
          return `Theme changed to '${t}'`;
        }
        return `Unknown set target: ${args[0] || ""}`;
      },
    },
    whoami: {
      description: "Show current user",
      fn: () => "nur@nurislam",
    },
    username: {
      description: "Show username",
      fn: () => "nur",
    },
    history: {
      description: "Show command history (session)",
      fn: (args, ctx) => (ctx.history && ctx.history.length ? ctx.history.join("\n") : "No history yet."),
    },
  };

  // Add stubs for every command name that doesn't exist yet
  for (const name of COMMAND_NAMES) {
    if (base[name]) continue;
    base[name] = {
      description: "Utility command (stub)",
      fn: () => `Command '${name}' is available — this is a stub. Replace with real output as needed.`,
    };
  }
  return base;
};

function useClock() {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Terminal() {
  const [lines, setLines] = useState([
    { type: "ascii", text: ASCII_LOGO },
    { type: "info", text: "Welcome to Nur Islam's Terminal Portfolio. Type 'help' or '?' for commands." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(null);
  const [themeName, setThemeName] = useState(() => localStorage.getItem("tp:theme") || "default");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestIndex, setSuggestIndex] = useState(0);

  const inputRef = useRef();
  const scrollRef = useRef();
  const clock = useClock();

  const commandsRef = useRef();
  useEffect(() => {
    commandsRef.current = makeCommands((t) => applyTheme(t, true));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [lines]);

  useEffect(() => {
    const raw = input;
    const cur = raw.trim();
    if (!cur) {
      setSuggestions([]);
      setSuggestIndex(0);
      return;
    }
    const keys = Object.keys(commandsRef.current || {});
    const token = cur.split(/\s+/)[0].toLowerCase();
    const cmdMatches = keys.filter(k => k.startsWith(token));
    const themeMatches = THEME_NAMES.filter(t => t.startsWith(token));
    const combined = [...new Set([...cmdMatches, ...themeMatches])];
    setSuggestions(combined.slice(0, 80));
    setSuggestIndex(0);
  }, [input]);

  useEffect(() => {
    applyTheme(themeName, false);
  }, []);

  function applyTheme(name, persist = true) {
    const t = THEMES[name] || THEMES.default;
    const el = document.querySelector(".page");
    if (el) {
      el.style.setProperty("--bg", t.bg);
      el.style.setProperty("--fg", t.fg);
      el.style.setProperty("--accent", t.accent);
      el.style.setProperty("--muted", t.muted);
    }
    setThemeName(t.name);
    if (persist) localStorage.setItem("tp:theme", t.name);
  }

  function writeOutput(text, opts = {}) {
    setLines((l) => [...l, { type: "output", text, ...opts }]);
  }

  function handleCommand(raw) {
    const parts = raw.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return;
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    setHistory((h) => [...h, raw]);
    setHistIndex(null);

    const commands = commandsRef.current || {};
    if (commands[cmd]) {
      try {
        const result = commands[cmd].fn(args, { commands, history });
        if (result && result.clear) {
          setLines([]);
          return;
        }
        if (cmd === "help" || cmd === "?") {
          showHelpGrid();
          return;
        }
        if (typeof result === "string") {
          writeOutput(result);
        } else {
          writeOutput(String(result));
        }
      } catch (err) {
        writeOutput("Command error: " + String(err));
      }
    } else {
      writeOutput(`command not found: ${cmd}\nType 'help' to see available commands.`);
    }
  }

  function showHelpGrid() {
    const names = Object.keys(commandsRef.current).sort();
    setLines((prev) => [
      ...prev,
      { type: "help-title", text: "💡  Terminal Help Menu:" },
      { type: "help-grid", items: names },
      { type: "help-tip", text: "Tip: Use help <command> to see command details. Use Tab for auto-completion and ↑/↓ to navigate history." },
    ]);
  }

  function acceptSuggestion(index = 0) {
    if (!suggestions.length) return;
    const s = suggestions[index];
    setInput(s + (THEME_NAMES.includes(s) ? "" : " "));
    setSuggestions([]);
  }

  function onKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length) {
        const sel = suggestions[suggestIndex] ?? suggestions[0];
        const token = input.trim().split(/\s+/)[0];
        if (token === sel) {
          setLines((l) => [...l, { type: "command", text: `nur@nurislam:~$ ${input}` }]);
          handleCommand(input);
          setInput("");
          setSuggestions([]);
          return;
        }
        acceptSuggestion(suggestIndex);
        return;
      }
      setLines((l) => [...l, { type: "command", text: `nur@nurislam:~$ ${input}` }]);
      handleCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      if (suggestions.length) {
        e.preventDefault();
        setSuggestIndex(prev => Math.max(0, prev - 1));
        return;
      }
      e.preventDefault();
      if (history.length === 0) return;
      const idx = histIndex === null ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(idx);
      setInput(history[idx]);
    } else if (e.key === "ArrowDown") {
      if (suggestions.length) {
        e.preventDefault();
        setSuggestIndex(prev => Math.min(suggestions.length - 1, prev + 1));
        return;
      }
      e.preventDefault();
      if (history.length === 0) return;
      if (histIndex === null) {
        setInput("");
      } else {
        const idx = Math.min(history.length - 1, histIndex + 1);
        setHistIndex(idx === history.length ? null : idx);
        setInput(idx === history.length ? "" : history[idx]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length === 1) {
        acceptSuggestion(0);
      } else if (suggestions.length > 1) {
        acceptSuggestion(suggestIndex);
      }
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  }

  function renderHelpGrid(items) {
    return (
      <div className="help-grid-wrap" key={"help-grid-" + items.length}>
        <div className="help-grid-columns" role="list">
          {items.map((name) => (
            <div className="help-item" key={name}>
              {name}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="terminal-shell" onClick={() => inputRef.current?.focus()}>
      <div className="topbar">
        <div className="left">N/A</div>
        <div className="center">https://nurthedev.vercel.app</div>
        <div className="right">{clock.toDateString()} {clock.toLocaleTimeString()}</div>
      </div>

      <div className="terminal">
        {lines.map((l, i) => {
          if (l.type === "ascii") {
            return <pre key={i} className="ascii">{l.text}</pre>;
          }
          if (l.type === "info") {
            return <div key={i} className="info">{l.text}</div>;
          }
          if (l.type === "command") {
            return (
              <div key={i} className="line">
                <span className="prompt">nur@nurislam:~$</span>{" "}
                <span className="cmd">{l.text.replace(/^nur@nurislam:~\$\s*/, "")}</span>
              </div>
            );
          }
          if (l.type === "help-title") {
            return <div key={i} className="help-title">{l.text}</div>;
          }
          if (l.type === "help-grid") {
            return <div key={i} className="line">{renderHelpGrid(l.items)}</div>;
          }
          if (l.type === "help-tip") {
            return <div key={i} className="help-tip">{l.text}</div>;
          }
          return (
            <div key={i} className="line">
              <pre className="output-pre">{l.text}</pre>
            </div>
          );
        })}

        <div className="input-row" aria-live="polite">
          <span className="prompt">nur@nurislam:~$</span>
          <div className="input-wrap">
            <input
              ref={inputRef}
              value={input}
              onKeyDown={onKeyDown}
              onChange={(e) => setInput(e.target.value)}
              className="terminal-input"
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              aria-label="Terminal input"
            />

            {suggestions.length > 0 && (
              <div className="suggest-panel" role="listbox" aria-label="Suggestions">
                <div className="suggest-count">{suggestions.length} options</div>
                <div className="suggest-grid">
                  {suggestions.map((s, idx) => (
                    <button
                      key={s}
                      type="button"
                      className={"suggest-pill " + (idx === suggestIndex ? "selected" : "")}
                      onMouseDown={(ev) => { ev.preventDefault(); acceptSuggestion(idx); }}
                      onMouseEnter={() => setSuggestIndex(idx)}
                    >
                      <span className="pill-text">{s}</span>
                      <span className="pill-tag">{THEME_NAMES.includes(s) ? "theme" : "cmd"}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div ref={scrollRef} style={{ height: 8 }} />
      </div>
    </div>
  );
}

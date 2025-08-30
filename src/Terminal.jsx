import { useEffect, useRef, useState } from "react";
import CountryCard from "./CountryCard";
import GithubCard from "./GithubCard";
import { THEMES, THEME_NAMES } from "./themes";

const ASCII_LOGO = ` ██████   █████                         █████         ████
▒▒██████ ▒▒███                         ▒▒███         ▒▒███
 ▒███▒███ ▒███  █████ ████ ████████     ▒███   █████  ▒███   ██████   █████████████
 ▒███▒▒███▒███ ▒▒███ ▒███ ▒▒███▒▒███    ▒███  ███▒▒   ▒███  ▒▒▒▒▒███ ▒▒███▒▒███▒▒███
 ▒███ ▒▒██████  ▒███ ▒███  ▒███ ▒▒▒     ▒███ ▒▒█████  ▒███   ███████  ▒███ ▒███ ▒███
 ▒███  ▒▒█████  ▒███ ▒███  ▒███         ▒███  ▒▒▒▒███ ▒███  ███▒▒███  ▒███ ▒███ ▒███
 █████  ▒▒█████ ▒▒████████ █████        █████ ██████  █████▒▒████████ █████▒███ █████
▒▒▒▒▒    ▒▒▒▒▒   ▒▒▒▒▒▒▒▒ ▒▒▒▒▒        ▒▒▒▒▒ ▒▒▒▒▒▒  ▒▒▒▒▒  ▒▒▒▒▒▒▒▒ ▒▒▒▒▒ ▒▒▒ ▒▒▒▒▒
`;

/* Developer info class as you provided */
class DEVELOPER_INFO {
    constructor() {
        this.name = "Nur Islam";
        this.title = "Full Stack Developer";
        this.email = "nur756.islam@gmail.com";
        this.phone = "+8801957282954";
        this.location = ["Dhaka, Bangladesh", "Remote - Available Worldwide"];
        this.available = true;
        this.experience = "constantly.levelingUp(📦 personalProjects)";
        this.pronouns = "He/Him";
        this.hobbies = "Coding, Traveling, Gaming";
        this.favouriteTimepass = "Doing Nothing";
        this.linkedIn = "linkedin.com/in/nurthedev";
        this.github = "github.com/nurthedev";
        this.os = "Arch Linux x86_64";
        this.uptimeLabel = "Uptime"; // we will compute value dynamically
        this.expertise = "JavaScript, Node.js, Express, React, MongoDB";
    }
}

/* Command names */
const COMMAND_NAMES = [
    "nurislam","about","age","antonym","ascii","asciiqr","base64","calendar","capitalize","clear","coin",
    "commands","contact","countdays","country","curl","date","define","dice","dns","dnslookup","echo","emoji",
    "geo","github","hash","help","history","ip","json","lowercase","matrix","ping","projects",
    "qr","quote","remind","reset","reverse","rps","set","shorten","shutdown","social","stock",
    "stopwatch","synonym","sysinfo","theme","time","timer","translate","ttt","typer","uppercase","uptime",
    "username","uuid","weather","whoami"
];

// Utility functions
function parseDate(dateStr) {
    const formats = [
        /^(\d{4})-(\d{2})-(\d{2})$/, // YYYY-MM-DD
        /^(\d{2})-(\d{2})-(\d{4})$/, // DD-MM-YYYY
        /^(\d{2})\/(\d{2})\/(\d{4})$/ // DD/MM/YYYY
    ];

    for (let i = 0; i < formats.length; i++) {
        const match = dateStr.match(formats[i]);
        if (match) {
            let year, month, day;
            if (i === 0) { // YYYY-MM-DD
                [, year, month, day] = match;
            } else { // DD-MM-YYYY or DD/MM/YYYY
                [, day, month, year] = match;
            }
            return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        }
    }
    return null;
}

function calculateAge(birthDate) {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

function generateMatrix() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const lines = [];
    for (let i = 0; i < 20; i++) {
        let line = '';
        for (let j = 0; j < 80; j++) {
            line += chars[Math.floor(Math.random() * chars.length)];
        }
        lines.push(line);
    }
    return lines.join('\n');
}
// e.g. put this outside, then in makeCommands call country: { fn: makeCountryCommand(pushComponent) }
function makeCountryCommand(pushComponent) {
  return async function countryCommand(args = []) {
    async function fetchJson(url) {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    }

    if (!args || args.length === 0) {
      const list = await fetchJson("https://restcountries.com/v3.1/all?fields=name,cca2,flag");
      const sorted = list.sort((a,b)=> (a.name?.common||"").localeCompare(b.name?.common||""));
      return sorted.map(c => `${c.flag || ""} ${c.name?.common || c.cca2 || "Unknown"}`).join("\n");
    }

    const q = args.join(" ").trim();
    const results = await fetchJson(`https://restcountries.com/v3.1/name/${encodeURIComponent(q)}?fullText=false`);
    if (!Array.isArray(results) || results.length === 0) return `No country found for "${q}"`;

    const primary = results.find(r => (r.name?.common||"").toLowerCase() === q.toLowerCase()) || results[0];
    try {
      if (typeof pushComponent === "function") pushComponent(<CountryCard country={primary} />);
    } catch (e) { console.log(e);
    }

    if (results.length > 1) {
      return results.slice(0,25).map(r => `${r.flag || ""} ${r.name?.common || r.cca2}`).join("\n");
    }
    return `Country: ${primary.name?.common || "Unknown"} (${primary.cca2 || ""})`;
  };
}

function generateCalendar(year = new Date().getFullYear()) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    let calendar = `\n📅 Calendar ${year}\n`;
    calendar += '='.repeat(50) + '\n\n';

    for (let month = 0; month < 12; month++) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        calendar += `${months[month]} ${year}\n`;
        calendar += 'Su Mo Tu We Th Fr Sa\n';

        let week = '';
        for (let i = 0; i < startingDay; i++) {
            week += '   ';
        }

        for (let day = 1; day <= daysInMonth; day++) {
            week += day.toString().padStart(2, ' ') + ' ';
            if ((startingDay + day - 1) % 7 === 6) {
                calendar += week + '\n';
                week = '';
            }
        }

        if (week) calendar += week + '\n';
        calendar += '\n';
    }

    return calendar;
}

function getRandomQuote() {
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Life is what happens to you while you're busy making other plans. - John Lennon",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "In the middle of difficulty lies opportunity. - Albert Einstein",
        "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
        "The only impossible journey is the one you never begin. - Tony Robbins",
        "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "Code is like humor. When you have to explain it, it's bad. - Cory House",
        "First, solve the problem. Then, write the code. - John Johnson",
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
        "Programs must be written for people to read, and only incidentally for machines to execute. - Harold Abelson"
    ];

    return quotes[Math.floor(Math.random() * quotes.length)];
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

function generateClockFace(time) {
    const hour = time.getHours() % 12;
    const minute = time.getMinutes();

    const _hourAngle = (hour * 30) + (minute * 0.5);
    const _minuteAngle = minute * 6;

    let clock = '        12\n';
    clock += '    ┌─────────┐\n';
    clock += ' 9  │    ·    │  3\n';
    clock += '    │    ·    │\n';
    clock += '    │    ·    │\n';
    clock += '    └─────────┘\n';
    clock += '        6\n';

    return clock;
}

const makeCommands = (applyThemeFn, pushComponent, getUptimeString, dev) => {
    const base = {
        help: { description: "Show available commands in a grid menu", fn: () => "" },
        "?": { description: "Alias for help", fn: () => "" },
        about: {
            description: "Short about text",
            fn: () => `👋 Hey there! I'm ${dev.name}\n${dev.title}\n\n${dev.expertise}\n\nEmail: ${dev.email}\nLinkedIn: ${dev.linkedIn}\nGitHub: ${dev.github}`
        },
        contact: {
            description: "Contact info",
            fn: () => `📧 Email: ${dev.email}\n📞 Phone: ${dev.phone}\n🔗 LinkedIn: ${dev.linkedIn}\n💻 GitHub: ${dev.github}`,
        },
        projects: {
            description: "List projects",
            fn: () => `🚀 Projects:\n   • Exclusive E-commerce Website – React, Redux, Firebase, TailwindCSS\n   • BD Screens – Video Streaming Site – React, TailwindCSS, Firebase Auth\n   • Browse Pet – Pet Services Landing Page – React, Vite, TailwindCSS`,
        },
        clear: { description: "Clear the terminal (header stays visible)", fn: () => ({ clear: true }) },
        echo: { description: "Echo back text", fn: (args) => args.join(" ") },
        theme: { description: "List available themes", fn: () => THEME_NAMES.join("\n") },
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
        whoami: { description: "Show current user", fn: () => "nur@nurislam" },
        username: { description: "Show username", fn: () => "nur" },
        history: { description: "Show command history (session)", fn: (args, ctx) => (ctx.history && ctx.history.length ? ctx.history.join("\n") : "No history yet.") },
        sysinfo: {
            description: "Show developer header info (dynamic uptime)",
            fn: () => {
                return [
                    `Name:\t${dev.name}`,
                    `Pronouns:\t${dev.pronouns}`,
                    `Location:\t${dev.location.join(" / ")}`,
                    `Uptime:\t${getUptimeString()}`,
                    `Expertise:\t${dev.expertise}`,
                    `Hobbies:\t${dev.hobbies}`,
                    `Email:\t${dev.email}`,
                    `LinkedIn:\t${dev.linkedIn}`
                ].join("\n");
            }
        },
        github: {
            description: "Fetch GitHub user: github <username>",
            fn: async (args) => {
                const username = args[0];
                if (!username) return "Usage: github <username>";
                try {
                    const res = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);
                    if (res.status === 404) return `GitHub user '${username}' not found`;
                    if (!res.ok) return `GitHub API error: ${res.statusText}`;
                    const data = await res.json();
                    pushComponent(<GithubCard data={data} />);
                    return `Fetched GitHub user '${username}'`;
                } catch (err) {
                    return "Network error fetching GitHub user: " + String(err);
                }
            },
        },
// import CountryCard at top of Terminal.jsx
// inside makeCommands(..., pushComponent, ...) add:
country: {
  description: "List countries or show country details: country [name]",
  fn: makeCountryCommand(pushComponent, CountryCard)
},
        // New commands
        age: {
            description: "Calculate age from birth date: age [YYYY-MM-DD | DD-MM-YYYY | DD/MM/YYYY]",
            fn: (args) => {
                if (args.length === 0) {
                    return "Usage: age [YYYY-MM-DD | DD-MM-YYYY | DD/MM/YYYY]\nExample: age 1995-06-15";
                }

                const dateStr = args[0];
                const birthDate = parseDate(dateStr);

                if (!birthDate) {
                    return "Invalid date format. Please use:\n• YYYY-MM-DD (e.g., 1995-06-15)\n• DD-MM-YYYY (e.g., 15-06-1995)\n• DD/MM/YYYY (e.g., 15/06/1995)";
                }

                if (birthDate > new Date()) {
                    return "Birth date cannot be in the future!";
                }

                const age = calculateAge(birthDate);
                const today = new Date();
                const nextBirthday = new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                if (nextBirthday < today) {
                    nextBirthday.setFullYear(today.getFullYear() + 1);
                }
                const daysUntilBirthday = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));

                return `🎂 Age: ${age} years old\n📅 Next birthday in ${daysUntilBirthday} days`;
            }
        },

        matrix: {
            description: "Display Matrix-style falling characters",
            fn: () => {
                const matrixText = generateMatrix();
                return `🟢 THE MATRIX 🟢\n${matrixText}\n\n"Welcome to the real world." - Morpheus`;
            }
        },

        calendar: {
            description: "Show current year calendar or specific year: calendar [YYYY]",
            fn: (args) => {
                const year = args[0] ? parseInt(args[0]) : new Date().getFullYear();
                if (isNaN(year) || year < 1 || year > 9999) {
                    return "Invalid year. Please provide a valid year (1-9999).";
                }
                return generateCalendar(year);
            }
        },

        coin: {
            description: "Flip a gold coin - choose heads or tails",
            fn: (args) => {
                if (args.length === 0) {
                    return "🪙 Coin Flip Game\nUsage: coin [heads|tails]\nExample: coin heads";
                }

                const choice = args[0].toLowerCase();
                if (choice !== 'heads' && choice !== 'tails') {
                    return "Please choose 'heads' or 'tails'\nUsage: coin [heads|tails]";
                }

                const result = Math.random() < 0.5 ? 'heads' : 'tails';
                const win = choice === result;

                let coin = '';
                coin += '    ╭─────────╮\n';
                coin += '  ╱           ╲\n';
                coin += ' ╱      🏛️      ╲\n';
                coin += '│   GOLD COIN   │\n';
                coin += '│      💰       │\n';
                coin += ' ╲             ╱\n';
                coin += '  ╲___________╱\n';

                return `🪙 Coin Flip Result:\n${coin}\nResult: ${result.toUpperCase()}\nYou chose: ${choice.toUpperCase()}\n${win ? '🎉 You WIN!' : '😔 You LOSE!'}`;
            }
        },

        quote: {
            description: "Display a random inspirational quote",
            fn: () => {
                const quote = getRandomQuote();
                return `💭 Random Quote:\n\n"${quote}"\n\n✨ Keep inspiring yourself! ✨`;
            }
        },

        stopwatch: {
            description: "Start/stop/reset a stopwatch",
            fn: (() => {
                let startTime = null;
                let elapsedTime = 0;
                let isRunning = false;

                return (args) => {
                    const action = args[0]?.toLowerCase();

                    if (!action) {
                        return "⏱️  Stopwatch Commands:\n• stopwatch start - Start the timer\n• stopwatch stop - Stop the timer\n• stopwatch reset - Reset to 00:00.00\n• stopwatch time - Show current time";
                    }

                    switch (action) {
                        case 'start':
                            if (isRunning) {
                                return "⏱️  Stopwatch is already running!";
                            }
                            startTime = Date.now();
                            isRunning = true;
                            return "⏱️  Stopwatch started! ▶️";

                        case 'stop':
                            if (!isRunning) {
                                return "⏱️  Stopwatch is not running!";
                            }
                            elapsedTime += Date.now() - startTime;
                            isRunning = false;
                            return `⏱️  Stopwatch stopped! ⏸️\nTime: ${formatTime(elapsedTime)}`;

                        case 'reset':
                            startTime = null;
                            elapsedTime = 0;
                            isRunning = false;
                            return "⏱️  Stopwatch reset! 🔄\nTime: 00:00.00";

                        case 'time': {
                            const currentTime = isRunning ? elapsedTime + (Date.now() - startTime) : elapsedTime;
                            return `⏱️  Current Time: ${formatTime(currentTime)}`;
                        }

                        default:
                            return "Unknown action. Use: start, stop, reset, or time";
                    }
                };
            })()
        },

        typer: {
            description: "Typing test and typing-related tools",
            fn: (args) => {
                const action = args[0]?.toLowerCase();

                if (!action) {
                    return "⌨️  Typing Tools:\n• typer test - Start a typing speed test\n• typer practice - Practice typing\n• typer stats - Show typing statistics\n• typer tips - Get typing improvement tips";
                }

                switch (action) {
                    case 'test':
                        return "⌨️  Typing Test\n\nType this sentence as fast as you can:\n'The quick brown fox jumps over the lazy dog.'\n\nStart typing when ready! (This is a simulation - actual test would require interactive input)";

                    case 'practice':
                        return "⌨️  Typing Practice\n\nPractice sentences:\n1. Pack my box with five dozen liquor jugs\n2. How vexingly quick daft zebras jump\n3. Bright vixens jump; dozy fowl quack\n\n💡 Focus on accuracy first, then speed!";

                    case 'stats':
                        return "⌨️  Typing Statistics:\n\n📊 Average WPM: 65 (estimated)\n🎯 Accuracy: 94%\n⌨️  Most common errors: Transposition\n📈 Improvement: +5 WPM this month\n\n(These are sample statistics)";

                    case 'tips':
                        return "⌨️  Typing Tips:\n\n1. 👀 Look at the screen, not your fingers\n2. 🖐️  Use all 10 fingers correctly\n3. 🪑 Maintain good posture\n4. 🎯 Focus on accuracy over speed\n5. 🔄 Practice regularly\n6. 💪 Build muscle memory\n7. 📚 Use proper finger positioning (home row)";

                    default:
                        return "Unknown action. Use: test, practice, stats, or tips";
                }
            }
        },

        time: {
            description: "Show current time with ASCII clock",
            fn: () => {
                const now = new Date();
                const timeString = now.toLocaleTimeString();
                const dateString = now.toDateString();
                const clock = generateClockFace(now);

                return `🕐 Current Time & Date\n\n${clock}\n📅 ${dateString}\n⏰ ${timeString}\n🌍 Local Time Zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
            }
        }
    };

    for (const name of COMMAND_NAMES) {
        if (base[name]) continue;
        base[name] = { description: "Utility command (stub)", fn: () => `Command '${name}' is available — this is a stub.` };
    }
    return base;
};

// helper: format runtime duration into friendly string
function formatDuration(ms) {
    const s = Math.floor(ms / 1000);
    const years = Math.floor(s / (3600 * 24 * 365));
    if (years > 0) return `${years} year${years > 1 ? "s" : ""}`;
    const days = Math.floor(s / (3600 * 24));
    const hrs = Math.floor((s % (3600 * 24)) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const secs = s % 60;
    if (days > 0) return `${days}d ${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}

export default function Terminal() {
    // header developer info instance
    const dev = useRef(new DEVELOPER_INFO()).current;

    // terminal output lines (cleared by `clear`)
    const [lines, setLines] = useState([
        { type: "info", text: `Welcome to ${dev.name}'s Terminal Portfolio. Type 'help' or '?' for commands.` },
    ]);
    const [input, setInput] = useState("");
    const [history, setHistory] = useState([]);
    const [histIndex, setHistIndex] = useState(null);
    const [themeName, setThemeName] = useState(() => localStorage.getItem("tp:theme") || "default");
    const [suggestions, setSuggestions] = useState([]);
    const [suggestIndex, setSuggestIndex] = useState(0);

    const inputRef = useRef();
    const scrollRef = useRef();

    // start time for uptime (terminal active time)
    const startTimeRef = useRef(Date.now());
    const [, tick] = useState(0); // used just to force re-render each second for uptime display

    // update uptime every second to display in header
    useEffect(() => {
        const id = setInterval(() => tick((n) => n + 1), 1000);
        return () => clearInterval(id);
    }, []);

    // compute a human-readable uptime string
    function getUptimeString() {
        return formatDuration(Date.now() - startTimeRef.current);
    }

    // allow commands to push components (like GithubCard)
    const pushComponent = (component) => {
        setLines((l) => [...l, { type: "component", component }]);
    };

    const commandsRef = useRef();
    useEffect(() => {
        commandsRef.current = makeCommands((t) => applyTheme(t, true), pushComponent, getUptimeString, dev);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [lines]);

    useEffect(() => {
        // compute suggestions when input changes
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
        setSuggestions(combined.slice(0, 200));
        setSuggestIndex(0);
    }, [input]);

    useEffect(() => {
        applyTheme(themeName, false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    function pushOutput(text) {
        setLines((l) => [...l, { type: "output", text }]);
    }

    async function handleCommand(raw) {
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
                const resolved = result instanceof Promise ? await result : result;
                if (resolved && resolved.clear) {
                    // clear only output area (header persists)
                    setLines([]);
                    return;
                }
                if (cmd === "help" || cmd === "?") {
                    showHelpGrid();
                    return;
                }
                if (typeof resolved === "string") {
                    pushOutput(resolved);
                } else {
                    if (resolved != null) pushOutput(String(resolved));
                }
            } catch (err) {
                pushOutput("Command error: " + String(err));
            }
        } else {
            pushOutput(`command not found: ${cmd}\nType 'help' to see available commands.`);
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
            if (suggestions.length === 1) acceptSuggestion(0);
            else acceptSuggestion(suggestIndex);
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

    // build header key/value list from developer info (selected fields)
    const headerKeys = [
        { k: "Name", v: dev.name },
        { k: "Pronouns", v: dev.pronouns },
        { k: "Location", v: dev.location.join(" / ") },
        { k: "Uptime", v: getUptimeString() },
        { k: "Expertise", v: dev.expertise },
        { k: "Hobbies", v: dev.hobbies },
        { k: "Email", v: dev.email },
        { k: "LinkedIn", v: dev.linkedIn }
    ];

    return (
        <div className="terminal-shell" onClick={() => inputRef.current?.focus()}>
            <div className="topbar">
                <div className="left">N/A</div>
                <div className="center">https://nurthedev.vercel.app</div>
                <div className="right">{new Date().toDateString()} {new Date().toLocaleTimeString()}</div>
            </div>

            {/* Persistent header */}
            <div className="header">
                <div className="header-left">
                    <pre className="header-ascii">{ASCII_LOGO}</pre>
                </div>

                <div className="header-center">
                    <div className="sys-box">
                        <div className="sys-columns" role="table" aria-label="Developer info">
                            <div className="sys-keys">
                                {headerKeys.map((it) => <div key={it.k} className="sys-key">{it.k.toLowerCase()}</div>)}
                            </div>
                            <div className="sys-vals">
                                {headerKeys.map((it) => <div key={it.k} className="sys-val">{it.v}</div>)}
                            </div>
                        </div>



                    </div>
                </div>


            </div>

            {/* Terminal output area */}
            <div className="terminal">
                {lines.map((l, i) => {
                    if (l.type === "info") return <div key={i} className="info">{l.text}</div>;
                    if (l.type === "command") {
                        return (
                            <div key={i} className="line">
                                <span className="prompt">nur@nurislam:~$</span>{" "}
                                <span className="cmd">{l.text.replace(/^nur@nurislam:~\$\s*/, "")}</span>
                            </div>
                        );
                    }
                    if (l.type === "component") {
                        return (
                            <div key={i} className="line component-line">
                                {l.component}
                            </div>
                        );
                    }
                    if (l.type === "help-title") return <div key={i} className="help-title">{l.text}</div>;
                    if (l.type === "help-grid") return <div key={i} className="line">{renderHelpGrid(l.items)}</div>;
                    if (l.type === "help-tip") return <div key={i} className="help-tip">{l.text}</div>;
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
                                            key={s + idx}
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

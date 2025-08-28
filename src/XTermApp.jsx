import React, { useEffect, useRef } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";

export default function XTermApp() {
  const ref = useRef();
  const xtermRef = useRef();

  useEffect(() => {
    const term = new Terminal({ cols: 80, rows: 24, cursorBlink: true });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(ref.current);
    fit.fit();
    xtermRef.current = term;

    term.writeln("Welcome to my terminal portfolio");
    term.writeln("");
    term.prompt = () => term.write("\x1b[1;32mvisitor:~$ \x1b[0m");

    term.prompt();
    term.onKey(e => {
      const ev = e.domEvent;
      const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
      if (ev.key === "Enter") {
        term.writeln("");
        term.prompt();
      } else if (printable) {
        term.write(e.key);
      }
    });

    return () => term.dispose();
  }, []);

  return <div style={{ height: "70vh" }} ref={ref}></div>;
}
// src/Components/XTerminal.tsx
import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { WebLinksAddon } from '@xterm/addon-web-links';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useYjs } from '../../Contexts/YjsProvider';

export default function XTerminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const terminal = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon>(new FitAddon());
  const { ydoc, provider } = useYjs();
  const yTerminal = ydoc.getText('terminal');

  useEffect(() => {
    if (!terminalRef.current) return;

    // Initialize terminal
    terminal.current = new Terminal({
      theme: {
        background: '#1f2937',
        foreground: '#f3f4f6',
        cursor: '#f3f4f6',
        // selection: '#374151',
      },
      fontSize: 14,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      allowProposedApi: true,
      scrollback: 1000,
    });

    // Load addons
    terminal.current.loadAddon(new WebLinksAddon());
    terminal.current.loadAddon(fitAddon.current);
    
    // Open terminal
    terminal.current.open(terminalRef.current);
    fitAddon.current.fit();

    // Yjs synchronization
    const handleYjsUpdate = () => {
      if (terminal.current) {
        terminal.current.write(yTerminal.toString());
      }
    };
    
    yTerminal.observe(handleYjsUpdate);

    // Input handling
    terminal.current.onData((data) => {
      Y.transact(ydoc, () => {
        yTerminal.insert(yTerminal.length, data);
      });
    });

    // Resize handling
    const handleResize = () => fitAddon.current.fit();
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      yTerminal.unobserve(handleYjsUpdate);
      terminal.current?.dispose();
    };
  }, []);

  return <div ref={terminalRef} className="h-full p-2" />;
}
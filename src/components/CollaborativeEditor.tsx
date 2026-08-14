"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { basicSetup, EditorView } from "codemirror";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { yCollab } from "y-codemirror.next";
import * as Y from "yjs";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import {
  useRoom,
  useSelf,
  useStorage,
} from "@liveblocks/react/suspense";
import { Avatars } from "@/components/Avatars";

declare global {
  interface Window {
    loadPyodide: any;
  }
}

export default function CollaborativeEditor({
  username,
  activeFileId,
}: {
  username: string;
  activeFileId: string | null;
}) {
  const room = useRoom();
  const provider = getYjsProviderForRoom(room);

  const me = useSelf();
  const infoName =
    (me?.info as any)?.name || username || "Anonymous";
  const infoColor =
    (me?.info as any)?.color || "#00bfff";

  const files = useStorage((root: any) => root.files);

  const [element, setElement] = useState<HTMLElement>();
  const [output, setOutput] = useState<string>("");
  const [pyodide, setPyodide] = useState<any>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    if (node) {
      setElement(node);
    }
  }, []);

  const activeFile = files?.find(
    (f: any) => f.id === activeFileId
  );

  const activeFileName = activeFile?.name || "";

  const isPython = activeFileName
    .toLowerCase()
    .endsWith(".py");

  /**
   * Load Pyodide only when Python is actually executed.
   *
   * This prevents the ~37 MB Python runtime from being
   * downloaded when a user simply opens a CodeRoom.
   */
  const loadPython = async () => {
    if (pyodide) {
      return pyodide;
    }

    if (typeof window === "undefined") {
      throw new Error("Python can only run in the browser.");
    }

    // Load the Pyodide JavaScript loader only when needed.
    if (!window.loadPyodide) {
      await new Promise<void>((resolve, reject) => {
        const existingScript = document.querySelector(
          'script[data-pyodide-loader="true"]'
        );

        if (existingScript) {
          existingScript.addEventListener("load", () => resolve());
          existingScript.addEventListener("error", () =>
            reject(new Error("Failed to load Pyodide loader."))
          );
          return;
        }

        const script = document.createElement("script");

        script.src =
          "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js";

        script.async = true;
        script.dataset.pyodideLoader = "true";

        script.onload = () => resolve();

        script.onerror = () =>
          reject(
            new Error("Failed to load the Pyodide loader.")
          );

        document.head.appendChild(script);
      });
    }

    if (!window.loadPyodide) {
      throw new Error("Pyodide loader is unavailable.");
    }

    const py = await window.loadPyodide({
      indexURL:
        "https://cdn.jsdelivr.net/pyodide/v0.25.0/full/",
    });

    setPyodide(py);

    return py;
  };

  /**
   * Keep the user's collaboration presence updated.
   */
  useEffect(() => {
    provider.awareness.setLocalStateField("user", {
      name: infoName,
      color: infoColor,
      colorLight: infoColor + "80",
    });
  }, [provider, infoName, infoColor]);

  /**
   * Execute the active file.
   */
  const runCode = async () => {
    if (!activeFileId) {
      return;
    }

    const code = provider
      .getYDoc()
      .getText(activeFileId)
      .toString();

    const logs: string[] = [];

    const systemPrint = window.print;

    window.print = () => {};

    try {
      /**
       * Python execution
       *
       * Pyodide is loaded lazily here instead of when
       * CollaborativeEditor first mounts.
       */
      if (isPython) {
        setOutput("Loading Python...");

        const py = await loadPython();

        py.setStdout({
          batched: (msg: string) => {
            logs.push(msg);
          },
        });

        await py.runPythonAsync(code);

        setOutput(
          logs.join("\n") || "Python executed."
        );
      } else {
        /**
         * JavaScript execution
         */
        const customConsole = {
          log: (...args: any[]) =>
            logs.push(
              args
                .map((a) =>
                  typeof a === "object"
                    ? JSON.stringify(a)
                    : String(a)
                )
                .join(" ")
            ),
        };

        const execute = new Function(
          "console",
          `const print = console.log;\n${code}`
        );

        execute(customConsole);

        setOutput(
          logs.join("\n") ||
            "JS executed successfully."
        );
      }
    } catch (err: any) {
      setOutput(
        `${isPython ? "Python Error" : "Error"}: ${
          err?.message || String(err)
        }`
      );
    } finally {
      window.print = systemPrint;
    }
  };

  /**
   * Keep the latest runCode function available to the
   * global trigger without re-registering the listener.
   */
  const runCodeRef = useRef(runCode);

  useEffect(() => {
    runCodeRef.current = runCode;
  }, [runCode]);

  /**
   * Allow other UI controls to trigger code execution.
   */
  useEffect(() => {
    const handler = () => {
      runCodeRef.current();
    };

    window.addEventListener(
      "trigger-run-code",
      handler
    );

    return () => {
      window.removeEventListener(
        "trigger-run-code",
        handler
      );
    };
  }, []);

  /**
   * Create and manage the CodeMirror editor.
   */
  useEffect(() => {
    if (!element || !room || !activeFileId) {
      return;
    }

    const ydoc = provider.getYDoc();
    const ytext = ydoc.getText(activeFileId);

    const state = EditorState.create({
      doc: ytext.toString(),
      extensions: [
        basicSetup,
        javascript(),
        yCollab(ytext, provider.awareness),

        EditorView.theme(
          {
            "&": {
              height: "100%",
              width: "100%",
              fontSize: "14px",
              color: "#e3e3e3",
              backgroundColor: "transparent",
            },

            ".cm-scroller": {
              overflow: "auto",
              fontFamily: "monospace",
            },

            ".cm-content": {
              minHeight: "100%",
              padding: "12px 0",
            },

            ".cm-gutters": {
              backgroundColor: "#121212",
              color: "#666",
              borderRight:
                "1px solid rgba(255,255,255,0.05)",
            },

            ".cm-cursor": {
              borderLeftColor:
                "#ffffff !important",
              borderLeftWidth: "2px",
            },

            "&.cm-focused": {
              outline: "none",
            },
          },
          {
            dark: true,
          }
        ),
      ],
    });

    const view = new EditorView({
      state,
      parent: element,
    });

    return () => {
      view.destroy();
    };
  }, [
    element,
    room,
    provider,
    activeFileId,
  ]);

  return (
    <div className="flex flex-col w-full h-full bg-[#121212] overflow-hidden">
      {/* Header */}
      <header
        className="h-14 shrink-0 flex items-center justify-between border-b border-white/5 bg-[#121212]"
        style={{
          paddingLeft: "40px",
          paddingRight: "40px",
        }}
      >
        <div
          className="flex items-center"
          style={{ marginLeft: "20px" }}
        >
          <div className="flex items-center text-xs font-mono text-gray-500">
            <span className="font-bold tracking-widest uppercase text-[10px] text-gray-600">
              Room Code =
            </span>

            <span
              className="text-gray-300 select-all tracking-tighter"
              style={{ marginLeft: "12px" }}
            >
              {room.id}
            </span>
          </div>

          {isPython &&
            !pyodide &&
            activeFileId && (
              <span
                className="text-blue-400 text-[10px] font-mono"
                style={{ marginLeft: "40px" }}
              >
                Python loads when you run the file
              </span>
            )}
        </div>

        <div className="flex items-center">
          <Avatars username={username} />
        </div>
      </header>

      {!activeFileId ? (
        <div className="flex-1 flex items-center justify-center text-gray-600 text-[11px] uppercase tracking-widest font-mono">
          Create or select a file to start coding.
        </div>
      ) : (
        <>
          <div className="flex-1 relative">
            <div
              className="absolute inset-0 w-full h-full text-left"
              ref={ref}
            ></div>
          </div>

          {/* Terminal Output */}
          <div
            className="shrink-0 bg-[#181818] border-t border-[#2b2b2b] p-4 font-mono text-xs overflow-auto flex flex-col"
            style={{
              height: "200px",
              paddingLeft: "30px",
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 uppercase text-[9px] tracking-widest font-bold">
                Terminal Output
              </span>

              <span className="text-gray-600 text-[9px]">
                {activeFileName}
              </span>
            </div>

            <pre className="text-green-400 whitespace-pre-wrap">
              {output || "Waiting for execution..."}
            </pre>
          </div>
        </>
      )}
    </div>
  );
}
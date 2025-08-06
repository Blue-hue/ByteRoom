import React, {useRef, useEffect, useState} from 'react';
import "codemirror/theme/dracula.css";
import "codemirror/theme/material.css";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/edit/matchtags.js";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";
import CodeMirror, { getMode } from 'codemirror';

// Importing the necessary CodeMirror modes
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";

function Editor({ socketRef, roomId, onCodeChange }) {

    const editorRef = useRef(null);
    const [language, setLanguage] = useState('javascript'); // Default language
    const [theme, setTheme] = useState('dracula'); // Default theme
    const [input, setInput] = useState(''); // State for input
    const [output, setOutput] = useState(''); // State for output

    useEffect(() => {
        const init = async () => {
            const editor = CodeMirror.fromTextArea(
                document.getElementById("realeditor"),
                {
                    mode : getMode(language),
                    theme: "dracula",
                    lineNumbers: true,
                    lineWrapping: true,
                    autoCloseBrackets: true,
                    autoCloseTags: true,
                }
            )
            editorRef.current = editor;
            editor.setSize(null, "100%");

            editorRef.current.on('change', (instance, changeObj) => {
                // Handle changes in the editor
                // console.log('Editor content changed:', instance, changeObj); 
                const {origin} = changeObj;
                const code = instance.getValue();
                onCodeChange(code); // Call the parent function to update the code
                if(origin !== 'setValue') {
                    // Emit the change to the server or handle it as needed
                    // console.log('Code changed:', code);

                    socketRef.current.emit('code-changed', {
                        roomId,
                        code,
                    });
                }
            });

        }
        init();
    }, [])

    useEffect(() => {
        if(editorRef.current) {
            editorRef.current.setOption('mode', getMode(language));
        }  
    }, [language]);

    useEffect(() => {
        if(socketRef.current) {
            socketRef.current.on('code-changed', ({ code, username }) => {
                // Update the editor content when code changes are received
                if (editorRef.current) {
                    // const editor = CodeMirror.fromTextArea(editorRef.current);
                    editorRef.current.setValue(code);
                }
            });
        }
        return () => {
            if(socketRef.current) {
                socketRef.current.off('code-changed');
            }
        }
    }, [socketRef.current]);

    const getMode = (lang) => {
    switch (lang) {
      case "javascript":
        return { name: "javascript", json: true };
      case "python":
        return { name: "python" };
      case "cpp":
        return { name: "text/x-c++src" };
      case "java":
        return { name: "text/x-java" };
      default:
        return { name: "javascript" };
    }
  };

    const runCode = async () => {
    const res = await fetch("/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        code: editorRef.current.getValue(),
        input,
      }),
    });
    const data = await res.json();
    setOutput(data.output || data.error || "No output");
  };

  return (
    <div className="p-4 w-full h-full flex flex-col gap-4 bg-zinc-900 text-white">
      {/* Language selector */}
      <div className="flex gap-4 items-center">
        <label htmlFor="language" className="text-sm font-medium">
          Language:
        </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-zinc-800 px-2 py-1 rounded border border-zinc-700 text-sm"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button
          onClick={runCode}
          className="ml-auto bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
        >
          Run Code
        </button>
      </div>

      {/* Code Editor */}
      <textarea id="realeditor" />

      {/* Input Area */}
      <div>
        <label className="text-sm">Input:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full mt-1 p-2 bg-zinc-800 text-white rounded resize-y h-24 border border-zinc-700"
          placeholder="Enter input here"
        />
      </div>

      {/* Output Area */}
      <div>
        <label className="text-sm">Output:</label>
        <pre className="w-full mt-1 p-2 bg-zinc-800 text-green-400 rounded h-32 overflow-auto border border-zinc-700 whitespace-pre-wrap">
          {output || "Your output will appear here."}
        </pre>
      </div>
    </div>
  );
}

export default Editor;
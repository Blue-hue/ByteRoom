import React, {useRef, useEffect} from 'react';
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/dracula.css";
import "codemirror/theme/material.css";
import "codemirror/addon/selection/active-line.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/addon/edit/matchtags.js";
import "codemirror/lib/codemirror.css";
import "codemirror/lib/codemirror.js";
import CodeMirror from 'codemirror';

function Editor({ socketRef, roomId, onCodeChange }) {

    const editorRef = useRef(null);

    useEffect(() => {
        const init = async () => {
            const editor = CodeMirror.fromTextArea(
                document.getElementById("realeditor"),
                {
                    mode : {name: "javascript", json: true},
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

  return (
    <div className='h-full w-full'>
        <textarea id="realeditor" />
    </div>
  )
}

export default Editor;
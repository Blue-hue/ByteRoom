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

function Editor() {

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
            editor.setSize(null, "100%");
        }
        init();
    }, [])


  return (
    <div className='h-full w-full'>
        <textarea id="realeditor" />
    </div>
  )
}

export default Editor;
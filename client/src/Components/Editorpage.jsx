import React, { useRef, useState } from 'react'
import Client from './Client'
import Editor from './Editor'

function Editorpage() {

  const [clients, setClients] = useState([
    {socketId: 1, username: 'User1'},
    {socketId: 2, username: 'User2'},
    {socketId: 3, username: 'Usyuyuuyyr3'}, 
  ]) // Placeholder for user list




  const editorRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState(300) // initial height in px

  const isDragging = useRef(false)

  const handleMouseDown = () => {
    isDragging.current = true
  }

  const handleMouseMove = (e) => {
    if (!isDragging.current) return
    const newHeight = e.clientY - editorRef.current.getBoundingClientRect().top
    setEditorHeight(Math.max(100, newHeight)) // min height 100px
  }

  const handleMouseUp = () => {
    isDragging.current = false
  }

  return (
    <div
      className="h-screen w-screen flex"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >

      {/* Left Pane */}

      <div className="w-1/4 bg-black text-white flex flex-col overflow-auto items-center">

        {/* user list */}

        <div className="flex-grow overflow-auto whitespace-pre-wrap break-all p-2 flex flex-col items-center">
          <span className="font-bold text-center m-2">USERS</span>
          <ul className="mt-4">
            {clients.map((client) => (
              <li key={client.socketId} className="mb-2">
                <Client username = {client.username} />
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons of invite and leave room */}

        <button className="bg-blue-500 text-white p-2 m-2 rounded-t-2xl hover:bg-blue-600 w-35">
          INVITE
        </button>
        <button className="bg-red-500 text-white p-2 m-2 rounded-b-2xl hover:bg-red-600 w-35">
          LEAVE ROOM
        </button>

      </div>

      {/* Right Pane */}

      <div className="w-3/4 flex flex-col">

        {/* Editor Pane */}
      
        <div
          ref={editorRef}
          className="bg-gray-800 text-white p-4 overflow-auto"
          style={{ height: `${editorHeight}px` }}
        >
          <Editor />
        </div>

        {/* Resizer line */}
        <div
          className="h-2 cursor-row-resize bg-gray-500"
          onMouseDown={handleMouseDown}
        ></div>

        {/* I/O Pane */}
        <div className="flex flex-grow overflow-hidden">
          <div className="w-1/2 bg-gray-700 p-4 overflow-auto">Input</div>
          <div className="w-1/2 bg-gray-600 p-4 overflow-auto">Output</div>
        </div>
      </div>
    </div>
  )
}

export default Editorpage

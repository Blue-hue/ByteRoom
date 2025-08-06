import React, { useRef, useState, useEffect } from 'react'
import Client from './Client'
import Editor from './Editor'
import { initSocket } from '../socket';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

function Editorpage() {

  const socketRef = useRef(null) // Placeholder for socket connection
  const location = useLocation();
  const { roomId } = useParams(); // Get roomId from URL parameters
  const navigate = useNavigate();
  const codeRef = useRef(null); // Placeholder for code editor reference

  const [clients, setClients] = useState([]); // State to hold connected clients



  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      const handleError = (err) => {
        console.error('Socket connection error:', err);
        toast.error('Socket connection failed. Please try again later.');
        navigate('/');
      }

      socketRef.current.on('connect_error', (err) => handleError(err));
      socketRef.current.on('connect_failed', (err) => handleError(err));


      socketRef.current.emit('join', {
        roomId,
        username: location.state?.username
      });

      socketRef.current.on('user-joined', ({ clients, username, socketId }) => {
        if( username !== location.state?.username) {
          toast.success(`${username} joined the room`);
        }
        setClients(clients);
        socketRef.current.emit('sync-code', {
          code: codeRef.current,
          socketId,
        } )
      });

      socketRef.current.on('user-disconnected', ({ socketId, username }) => {
        toast.error(`${username} left the room`);
        setClients((prevClients) => prevClients.filter(client => client.socketId !== socketId));
      });

    }

    init();

    return () => {
      socketRef.current.disconnect();
      socketRef.current.off('connect_error');
      socketRef.current.off('connect_failed');
      socketRef.current.off('user-joined');
      socketRef.current.off('user-disconnected');
    }

  }, []);


  if(!location.state || !location.state.username) {
    toast.error("Username is required to join the room");
    navigate('/');
  }

  const editorRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState(null) // initial height in px

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

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy Room ID');
    }
  }

  const leave = () => {
    socketRef.current.emit('leave', { roomId });
    navigate('/');
    toast.success('You have left the room');
  }

  return (
    <div
      className="h-screen w-screen flex"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >

      {/* Left Pane */}

      <div className="w-1/4 bg-black text-white flex flex-col overflow-auto items-center">

        {/* image */}
        <img src="/byteroom.png" />

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

        <button className="bg-blue-500 text-white p-2 m-2 rounded-t-2xl hover:bg-blue-600 w-35" onClick={copyRoomId}>
          INVITE
        </button>
        <button className="bg-red-500 text-white p-2 m-2 rounded-b-2xl hover:bg-red-600 w-35" onClick={leave}>
          LEAVE ROOM
        </button>

      </div>

      {/* Right Pane */}

      <div className="w-3/4 flex flex-col">

        {/* Editor Pane */}
      
        <div
          ref={editorRef}
          className="bg-gray-800 text-white p-4 overflow-auto h-3/5"
          style={{ height: `${editorHeight}px` }}
        >
          <Editor socketRef={socketRef} roomId={roomId} onCodeChange = {(code) => (codeRef.current = code) } />
        </div>

        {/* Resizer line */}
        <div
          className="h-2 cursor-row-resize bg-gray-500"
          onMouseDown={handleMouseDown}
        ></div>

        {/* I/O Pane */}
        <div className="flex flex-grow overflow-hidden h-2/5">
          <div className="w-1/2 bg-gray-700 p-4 overflow-auto">Input</div>
          <div className="w-1/2 bg-gray-600 p-4 overflow-auto">Output</div>
        </div>
      </div>
    </div>
  )
}

export default Editorpage

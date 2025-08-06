import React, { useRef, useState, useEffect } from 'react'
import Client from './Client'
import Editor from './Editor'
import { initSocket } from '../socket';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { FaBars, FaTimes } from "react-icons/fa";

function Editorpage() {

  const [showSidebar, setShowSidebar] = useState(false);

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
    className="h-screen w-screen flex bg-zinc-950 text-white relative"
    onMouseMove={handleMouseMove}
    onMouseUp={handleMouseUp}
  >
    {/* Mobile Toggle Button */}
    <button
      className="md:hidden absolute top-4 left-4 z-50 p-2 rounded bg-zinc-800 hover:bg-zinc-700"
      onClick={() => setShowSidebar((prev) => !prev)}
    >
      {showSidebar ? <FaTimes /> : <FaBars />}
    </button>

    {/* Left Pane */}
    <div
      className={`fixed md:static top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out
      ${showSidebar ? "translate-x-0" : "-translate-x-full"} 
      md:translate-x-0 w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col items-center py-6 px-4 space-y-4`}
    >
      <img src="/byteroom.png" className="w-32 mb-4" alt="BYTEroom Logo" />

      {/* User List */}
      <div className="w-full flex-1 overflow-auto">
        <h2 className="text-lg font-semibold text-center mb-4 border-b border-zinc-700 pb-2">
          USERS
        </h2>
        <ul className="space-y-3">
          {clients.map((client) => (
            <li key={client.socketId}>
              <Client username={client.username} />
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons */}
      <div className="flex flex-col w-full space-y-2">
        <button
          onClick={copyRoomId}
          className="bg-violet-600 hover:bg-violet-700 py-2 rounded-lg font-medium transition"
        >
          INVITE
        </button>
        <button
          onClick={leave}
          className="bg-pink-600 hover:bg-pink-700 py-2 rounded-lg font-medium transition"
        >
          LEAVE ROOM
        </button>
      </div>
    </div>

    {/* Right Pane */}
    <div className="flex-1 overflow-hidden ml-0 md:ml-0">
      <Editor
        socketRef={socketRef}
        roomId={roomId}
        onCodeChange={(code) => (codeRef.current = code)}
      />
    </div>
  </div>
);
}

export default Editorpage

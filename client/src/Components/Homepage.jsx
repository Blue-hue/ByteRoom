import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room ID generated");
  };
  
  const isValidUUID = (id) => {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }

    if(!isValidUUID(roomId)) {
      toast.error("Invalid Room ID format");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username },
    });
    toast.success("Room joined successfully");
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  // LAYOUT !!

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <div className="p-1 w-fit flex items-center justify-center bg-violet-500 rounded-2xl">
      <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center">

          {/* LOGO */}

          <img
            src="/byteroom.png"
            alt="Logo"
            className="w-2/5 h-2/5"
          />

          {/* Heading */}

          <h4 className="text-2xl font-semibold text-white mb-6">
            Enter the Room ID
          </h4>
        </div>

        <div className="space-y-4">

          {/* Input fields for Room ID and Username */}

          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="ROOM ID"
            onKeyUp={handleInputEnter}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="USERNAME"
            onKeyUp={handleInputEnter}
            className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          {/* Join Button */}

          <button
            onClick={joinRoom}
            className="w-full py-2 bg-violet-800 hover:bg-violet-950 text-white font-semibold rounded-md transition-colors duration-300 hover:border-violet-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            JOIN
          </button>
          
        </div>
        
        <p className="text-center text-gray-400 mt-4">
          Don't have a Room ID?{" "}
          <span 
            onClick={generateRoomId}
            className="relative text-violet-300 hover:text-violet-600 cursor-pointer transition-all duration-300 group"
          >
            Create a new Room
            <span className="absolute left-0 bottom-0 w-full h-0.5 bg-violet-600 transform scale-x-0 transition-transform duration-300 ease-in-out origin-left group-hover:scale-x-100"></span>
          </span>
        </p>
      </div>
    </div>
    </div>
    
  );
}

export default Homepage;

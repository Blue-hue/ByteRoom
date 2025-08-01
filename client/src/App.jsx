import { Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './Components/Homepage'
import Editor from './Components/Editorpage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/editor/:roomId" element={<Editor />} />
      </Routes>
    </>
  )
}

export default App
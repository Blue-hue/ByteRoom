import { Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './Components/Homepage'
import Editor from './Components/Editorpage'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
    <Toaster position='top-center' toastOptions={
      {
        duration: 1000,
        
      }
    } />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/editor/:roomId" element={<Editor />} />
      </Routes>
    </>
  )
}

export default App
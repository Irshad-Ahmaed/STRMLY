import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Upload from './components/Upload';
import VideosList from './components/VideosList';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <Router>
      <div className='w-full'>
        <Navbar />
        <Routes>
          <Route path="/" element={<VideosList />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
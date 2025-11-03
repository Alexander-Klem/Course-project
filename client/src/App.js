import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

import Auth from './pages/Auth';
import Home from './pages/Home';

import './App.css';

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path='/register' element={<Auth setToken={setToken} />} />
          <Route path='/login' element={<Auth setToken={setToken}/>} />
          <Route path='/' element={token ? <Home/> : <Navigate to='/login' />} />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;

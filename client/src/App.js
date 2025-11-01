import { BrowserRouter as Router, Routes, Route, Navigate, useFetcher } from 'react-router-dom';
import { useState, useEffect } from 'react';
// import Register from './pages/Auth';
// import Login from './pages/Login';

import Auth from './pages/Auth';

import './App.css';

function App() {

  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => { 
    setToken(localStorage.getItem('token'))
  }, [])

  return (
    <Router>
      <Routes>
        <Route path='/register' element={<Auth/>} />
        <Route path='/login' element={<Auth/>} />
        <Route path='/' element={token ? <h1>Главная (вход выполнен успешно)</h1> : <Navigate to='/login' />} />
      </Routes>
    </Router>
  );
}

export default App;

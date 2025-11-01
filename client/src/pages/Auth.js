import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Auth() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const location = useLocation();
    const navigate = useNavigate();

    const isLogin = location.pathname === '/login';

    const handleSubmit = async (e) => { 
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = isLogin
                ? await api.post('/login', {
                    email: email,
                    password: password
                })
                : await api.post('/registration', {
                    email: email,
                    password: password
                })
            
            localStorage.setItem('token', res.data.token);

            navigate('/');
            
        } catch (error) {
            setError(error.response.data.message || 'Ошибка при входе')
        } finally { 
            setLoading(false);
        }

    }

  return (
      <div
           className='d-flex justify-content-center align-items-center min-vh-100'
           style={{ backgroundColor: '#f0f2f5', fontFamily: "'Inter', sans-serif" }} >
        <div className="w-100" style={{ maxWidth: '40rem' }}>
              <div className="p-4 rounded-5 shadow" style={{border: '1px solid black'}}>
                  <h1 className='text-center mb-4'>{isLogin ? 'Вход' : 'Регистрация'}</h1>

                    {error && <div className="alert alert-danger small">{error}</div>}
                  
                    <form onSubmit={handleSubmit}>
                    <label className="form-label fs-2 m-0">Введите e-mail</label>
                      <input
                        type='email'
                        className='form-control p-3 fs-5 mb-3 rounded-4 border-secondary'
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        placeholder="name@example.com"
                    ></input>

                        <div className="mb-3 position-relative">
                            <label className="form-label fs-2 m-0">Введите пароль</label>
                            
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control p-3 fs-5 rounded-4 border-secondary pe-5"
                                onChange={e => setPassword(e.target.value)}
                                value={password}
                                placeholder="password"
                            />

                            <i
                                className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                position: 'absolute',
                                right: '1rem',
                                top: '74%',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer',
                                color: '#6c757d',
                                fontSize: '1.3rem',
                                }}
                            ></i>
                            </div>
                      <button
                        type='submit'
                        className={`btn w-100 mb-4 fs-4 rounded-4 ${isLogin ? 'btn-primary' : 'btn-success '}`}>
                      { loading ? 'Загрузка' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
                    </button>
                      </form>
                      
                <p>
                      {isLogin ? (
                          <>
                          Нет аккаунта? <Link to='/register' className='text-decoration-none'>Зарегистрируйся</Link>
                          </> 
                      ) :
                          <>
                          Есть аккаунт? <Link to='/login' className='text-decoration-none'>Войти</Link>    
                          </>
                      }    
                </p>

                </div>
              </div>
          </div>
  )
}

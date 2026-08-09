import React, { useState, type FC} from 'react';
import axiosInstance from '../api/axiosInstance';
import { AxiosError } from 'axios';

const Auth: FC = () => {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/register';

    try {
      const response = await axiosInstance.post<string>(endpoint, { username, password });

      if (isLoginMode) {
        const token = response.data;
        localStorage.setItem('jwt_token', token);
        setMessage('Zalogowano pomyślnie! Token zapisany.');
      } else {
        setMessage(response.data);
        setIsLoginMode(true);
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorMsg = err.response?.data || err.message;
        setMessage('Błąd: ' + errorMsg);
      } else {
        setMessage('Wystąpił nieznany błąd.');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>{isLoginMode ? 'Logowanie' : 'Rejestracja'}</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label>Nazwa użytkownika:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
        <div>
          <label>Hasło:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          {isLoginMode ? 'Zaloguj się' : 'Zarejestruj się'}
        </button>
      </form>

      <p style={{ marginTop: '15px', color: message.includes('Błąd') ? 'red' : 'green' }}>{message}</p>

      <button 
        onClick={() => setIsLoginMode(!isLoginMode)} 
        style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline', marginTop: '10px' }}
      >
        {isLoginMode ? 'Nie masz konta? Zarejestruj się' : 'Masz już konto? Zaloguj się'}
      </button>
    </div>
  );
};

export default Auth;
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './styles/msn-style.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <div className="h-screen w-screen flex justify-center items-center bg-[#008080]">
      <App />
    </div>
  </React.StrictMode>
);
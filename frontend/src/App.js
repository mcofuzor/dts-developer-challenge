import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css';
import Auth from './components/auth/Auth';
import Dashboard from './admin/Dashboard';

function App() {
  return (
   
       <BrowserRouter> 
    <Routes>
      <Route index="/login" element={<Auth /> } />
      <Route path="/dashboard" element={<Dashboard /> } />
      <Route path="/signup" element={<Auth /> } />
      <Route path="/login" element={<Auth /> } />
     
      </Routes>
      </BrowserRouter>
    
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/home/Home';
import Feed from './pages/feed/Feed';
import Login from './pages/login/Login';
import { UserProvider } from './contexts/UserContext';
import PrivateRoute from './utils/PrivateRoute';

function ErrorBoundary() {
  // Uncaught ReferenceError: path is not defined
  return <div>Page not found!</div>
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path='*' element={<ErrorBoundary/>}/>
          {/* Private route */}
          <Route
            path="/feed"
            element={<PrivateRoute element={<Feed />} />}
          />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;

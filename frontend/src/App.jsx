import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useRouteError } from 'react-router-dom';
import './App.css';
import Cookies from 'js-cookie';
import Axios from 'axios';
import Home from './pages/home/Home';
import Feed from './pages/feed/Feed';
import Login from './pages/login/Login';
import { UserProvider } from './contexts/UserContext';

const API_URL = import.meta.env.API_URL;

function PrivateRoute({ element }) {
  const isAuthenticated = !!Cookies.get('access_token');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getUser();
    }
  }, [isAuthenticated]);

  const getUser = () => {
    const token = Cookies.get('access_token');
    if (token) {
      Axios.get(`${API_URL}/api/get-user/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch((error) => {
          console.error('Error fetching user:', error);
        });
    }
  };

  return isAuthenticated ? element : <Navigate to="/login" />;
}

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

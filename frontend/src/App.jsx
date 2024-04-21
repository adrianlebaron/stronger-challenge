import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/home/Home';
import Feed from './pages/feed/Feed';
import Login from './pages/login/Login';
import Shop from './pages/shop/Shop';
import { authStore } from './stores/auth_store/Store.tsx';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/private_route/PrivateRoute';
import { getUser } from './services/UserApiRequest';
import PrivateAppBar from './components/PrivateAppBar.jsx';
import PublicAppBar from './components/PublicAppBar.jsx';

function ErrorBoundary() {
  // Uncaught ReferenceError: path is not defined
  return <div>Page not found!</div>
}

function App() {
  const { token, setUser } = authStore((state) => state);

  useEffect(() => {
    if (token) {
      getUser()
        .then((data) => {
          setUser(data)
        })
    }
  }, [token, setUser]);

  return (
    <BrowserRouter>
      <Toaster />
      {token ? <PrivateAppBar/> : <PublicAppBar/>}
      <Routes>
        {/* Public routes */}
        <Route path='*' element={<ErrorBoundary />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        {/* Private route */}
        <Route element={<PrivateRoute />}>
          <Route path="/feed" element={<Feed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

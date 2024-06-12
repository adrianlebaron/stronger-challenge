import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Shop from './pages/shop/Shop';
import Profile from './pages/profile/Profile'
import Score from './pages/score/Score'
import Admin from './pages/admin/Admin'
import SignUp from './pages/signup/SignUp'
import { authStore } from './stores/auth_store/Store.tsx';
import PrivateRoute from './components/private_route/PrivateRoute';
import { getUser } from './services/UserApiRequest';
import PrivateAppBar from './components/PrivateAppBar';
import PublicAppBar from './components/PublicAppBar';

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
      {token ? <PrivateAppBar /> : <PublicAppBar />}
      <Routes>
        {/* Public routes */}
        <Route path='*' element={<ErrorBoundary />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/signup" element={<SignUp/> } />
        {/* Private route */}
        <Route element={<PrivateRoute />}>
          <Route path="/score" element={<Score />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<Admin/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

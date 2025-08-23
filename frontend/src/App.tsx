import { Route, Routes, useLocation } from 'react-router-dom'
import { Box, useColorModeValue } from '@chakra-ui/react'
import { HomePage } from './pages/HomePage'
import { CreatePage } from './pages/CreatePage'
import { NavBar } from './components/NavBar'
import LoginPage from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'
import { ChangePasswordPage } from './pages/ChangePasswordPage'
import { ForgotPassPage } from './pages/ForgotPassPage'
import LoginWithGoogle from './pages/LoginWithGoogle'
import { useEffect } from 'react'
import { useUserStore } from './store/user'
import PageFooter from './components/PageFooter'


function App() {
  const location = useLocation();
  const hideNav = location.pathname === "/login"
    || location.pathname === "/register"
    || location.pathname === "/forgot"
    || location.pathname === "/change-password"
    || location.pathname === "/auth/google/callback";

  const { fetchUser } = useUserStore();
  useEffect(() => {
    fetchUser();
  }, []);


  return (
    <Box minH={"100vh"} bgColor={useColorModeValue("gray.200", "blackAlpha.300")}>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/forgot' element={<ForgotPassPage />} />
        <Route path='/change-password' element={<ChangePasswordPage />} />
        <Route path="/auth/google/callback" element={<LoginWithGoogle />} />
      </Routes>
      {!hideNav && <PageFooter />}
    </Box>
  )
}

export default App

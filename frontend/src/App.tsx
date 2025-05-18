import { Route, Routes, useLocation } from 'react-router-dom'
import { Box, useColorModeValue } from '@chakra-ui/react'
import { HomePage } from './pages/HomePage'
import { CreatePage } from './pages/CreatePage'
import { NavBar } from './components/NavBar'
import LoginPage from './pages/LoginPage'
import { ProfilePage } from './pages/ProfilePage'
import RegisterPage from './pages/RegisterPage'

function App() {
  const location = useLocation();
  const hideNav = location.pathname === "/login" || location.pathname === "/register";

  return (
    <Box minH={"100vh"} bgColor={useColorModeValue("gray.200", "blackAlpha.300")}>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/' element={<HomePage />} />
        <Route path='/create' element={<CreatePage />} />
        <Route path='/profile' element={<ProfilePage />} />
      </Routes>
    </Box>
  )
}

export default App

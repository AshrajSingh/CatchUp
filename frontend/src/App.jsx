import './App.css'
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom'
import LoginPage from './pages/loginPage'
import SignupPage from './pages/signupPage'
import DashboardPage from './pages/dashboardPage'
import { Toaster } from 'react-hot-toast'
import PrivateRoute, { PublicRoute } from './frontendServices/frontendRouting'
import { authAtom } from './store/chatAppAtom'
import { useSetRecoilState } from 'recoil'
import { useEffect } from 'react'

function App() {
  const setAuth = useSetRecoilState(authAtom)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    console.log("saved User: ", savedUser)

    if (savedUser) {
      setAuth({ isLoggedIn: true, isChecked: true, user: JSON.parse(savedUser) });
    }
    else {
      setAuth({
        isLoggedIn: false,
        isChecked: true,
        user: null
      })
    }

  }, [setAuth])
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={
            <PublicRoute allowWhenLoggedIn={true}>
              <DashboardPage />
            </PublicRoute>
          } />

          <Route path='/login' element={
            <PublicRoute> <LoginPage /> </PublicRoute>
          } />

          <Route path='/dashboardPage' element={
            <PrivateRoute> <DashboardPage /> </PrivateRoute>
          } />

          <Route path='/signup' element={<SignupPage />} />

          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboardPage" element={<DashboardPage />} /> */}

          {/* Redirect root to login */}
          {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
    </>
  )
}

export default App

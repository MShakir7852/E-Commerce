import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EmailConfirm from './pages/EmailConfirm'
import { Login } from './pages/login'
import Signup from './pages/Signup'
import Verifyemail from './pages/Verifyemail';
import Faildemailverification from './pages/Faildemailverification';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import Verifyotp from './pages/verifyotp';
import EmailForForgetPassword from './pages/EmailForForgetPassword';
import NewPassword from './pages/newPassword';



function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/verify-email' element={<EmailForForgetPassword />} />
          <Route path='/verify-otp' element={<Verifyotp />} />
          <Route path='/new-password/:email' element={<NewPassword />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/verify-Email' element={<EmailConfirm />} />
          <Route path='/verify/:token' element={<Verifyemail />} />
          <Route path='/error' element={<Faildemailverification />} />


        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  )
}

export default App

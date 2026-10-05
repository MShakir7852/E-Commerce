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
import ProductComponenet from './pages/productsComponenet'
import Product from './pages/product'
import AddToCart from './pages/AddToCart'



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
          <Route path='/products' element={<ProductComponenet />} />
          <Route path='/product/:id' element={<Product />} />
          <Route path='/add-to-cart' element={<AddToCart />} />
            </Routes>
          <Footer />
      </BrowserRouter>
    </>
  )
}

export default App

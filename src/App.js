import { Routes, Route } from 'react-router-dom';
import Layout from './routes/layout/layout.component';
import Home from './routes/home/home.component';
import Login from './routes/login/login.component';
import Register from './routes/register/register.component';
import UserProfile from './routes/user-profile/user-profile.component';
import ProtectAuthenticated from './components/protect-authenticated/protect-authenticated.component';
import ProtectLoginRegister from './components/protect-login-register/protect-login-register.component';
import SingleVenue from './routes/single-venue/single-venue.component';


function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />}></Route>
        <Route path='/login' element={<ProtectLoginRegister><Login /></ProtectLoginRegister>}></Route>
        <Route path='/register' element={<ProtectLoginRegister><Register /></ProtectLoginRegister>}></Route>
        <Route path="/profile" element={<ProtectAuthenticated><UserProfile /></ProtectAuthenticated>}></Route>                           
        <Route path="venue/:id" element={<SingleVenue />}></Route>
      </Route>
    </Routes>
  );


}

export default App;

import {Routes, Route} from 'react-router-dom';
import UserProfile from '../user-profile/user-profile.component';

const Profiles = () => {

  return (
    <Routes>
      <Route index></Route> 
      <Route path=":name" element={<UserProfile />}></Route>
    </Routes>
  )

};

export default Profiles;
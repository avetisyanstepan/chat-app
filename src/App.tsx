import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios"
import store2 from "store2"
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Contacts from './Pages';

function App() {

  
  const getAccessToken = async () => {
      
      axios.post(`https://api-teams.chatdaddy.tech/token`, {
          "refreshToken": "059c420e-7424-431f-b23b-af0ecabfe7b8",
          "teamId": "a001994b-918b-4939-8518-3377732e4e88"
      })
      .then(res => {
          store2.set("accessToken",res.data.access_token)
    })
      
  } 
  useEffect(() => {
    getAccessToken()
  }, [])
  


  return (
    <div className='container-xxl mx-auto mt-4'>
      <Routes>
        <Route path="/" element={<Contacts />} />
      </Routes>  
    </div>
  

   
  );
}

export default App;

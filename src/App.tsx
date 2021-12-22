import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Contacts from './components/Contacts/Contacts';
import axios from "axios"
import store2 from "store2"
import { useEffect } from 'react';

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
    <div>
      <Contacts />
    </div>
  );
}

export default App;

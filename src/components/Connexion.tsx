import { useState} from "react";
import axios from "axios";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");

  let headersList = {
    Accept: "*/*",
    Autorization: localStorage.getItem("token"),
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //evite de reactualiser la page quand on submit    
        let reqOptions = {
            url: "http://localhost:3000/connexion",
            method: "post",
            data: {email: email, mdp: mdp},
          };
        
        axios(reqOptions).then(function (response) {
            console.log(response.data);
        });
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>Email:
        <input 
          type="text" 
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>Mot de passe:
        <input 
          type="text"
          onChange={(e) => setMdp(e.target.value)}
        />
      </label>
      <input type="submit"/>
    </form>
  )
}

              


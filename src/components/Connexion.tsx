import { useState, useEffect} from "react";
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
            url: "http://localhost:3000/utilisateurs/connexion",
            method: "post",
            data: {email: email, mdp: mdp},
          };
        
        axios(reqOptions).then(function (response) {
          localStorage.setItem("email", response.data[0].email);
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
          type="password"
          onChange={(e) => setMdp(e.target.value)}
        />
      </label>
      <input type="submit"/>
    </form>
  )
}

              


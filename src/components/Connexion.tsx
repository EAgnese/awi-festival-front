import { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const navigation = useNavigate(); // redirection

  let headersList = {
    Accept: "*/*",
    Autorization: localStorage.getItem("token"),
  };

  //s'applique à chaque run du component et verifie si j'ai un token dans le local storage pour interdire la page connexion sinon
  useEffect(() => {
    if(localStorage.getItem("email") != null && localStorage.getItem("idUtilisateur") != null){
      navigation("../")
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //evite de reactualiser la page quand on submit    
        let reqOptions = {
            url: "http://localhost:3000/utilisateurs/connexion",
            method: "post",
            data: {email: email, mdp: mdp},
          };
        
        axios(reqOptions).then(function (response) {
          localStorage.setItem("email", response.data[0].email);
          localStorage.setItem("idUtilisateur", response.data[0].idUtilisateur);
          localStorage.setItem("isAdmin", response.data[0].isAdmin);
          window.location.reload()
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

              


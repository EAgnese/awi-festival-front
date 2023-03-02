import { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isConnected } from "../middleware/token";
import { notify } from "../middleware/notification";

export default function Connexion() {
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const navigation = useNavigate(); // redirection

  //s'applique à chaque run du component et verifie si j'ai un token dans le local storage pour interdire la page connexion sinon
  useEffect(() => {
    if(isConnected()){
      notify("Vous êtes déjà connecté", "warn")
      navigation("../")
    }
  },[]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //evite de reactualiser la page quand on submit    
    let reqOptions = {
      url: "http://localhost:3000/utilisateurs/connexion",
      method: "POST",
      data: {email: email, mdp: mdp},
    };
    axios(reqOptions).then(function (response) {
      //recupération du token
      localStorage.setItem("token", response.data);
      navigation("../")
      window.location.reload()
      notify("Connexion réussie", "success")
    })
    .catch(error => {
      console.log("FRONT")
      console.log(error)
      notify(error.response.data.msg, "error")
    });
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>Email:
        <input 
          required
          type="text" 
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>Mot de passe:
        <input 
          required
          type="password"
          onChange={(e) => setMdp(e.target.value)}
        />
      </label>
      <input type="submit"/>
    </form>
  )
}

              


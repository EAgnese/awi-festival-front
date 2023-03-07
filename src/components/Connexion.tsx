import { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { isConnected } from "../middleware/token";
import { notify } from "../middleware/notification";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { yellow} from '@mui/material/colors';
import '../assets/connexion.css';


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
      navigation("../zone/")
      window.location.reload()
      
    })
    .catch(error => {
      //verif connexion reseau
      if(error.response != null){
        notify(error.response.data.msg, "error")
      }else{
        notify(error.message, "error")
      }
    });
  }
  return (
    <div>
      <h1>Connexion</h1>
      <div id="div-utilisateur">
        <div className="gradient-cards">
            <div>
              <div className="container-card bg-yellow-box">
                <PeopleAltIcon sx={{ width: 70,height: 70, color: yellow[800]}}/>
                <form id="formConnexion" onSubmit={handleSubmit}>
                  <label className="card-description">Email:
                    <input 
                      required
                      className="input-class"
                      type="text" 
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <label className="card-description">Mot de passe:
                    <input 
                      required
                      className="input-class"
                      type="password"
                      onChange={(e) => setMdp(e.target.value)}
                    />
                  </label>
                  <input id="bouton-submit" type="submit"/>
                </form>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}

              


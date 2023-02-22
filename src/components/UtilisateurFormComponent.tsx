import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getIdUtilisateur, getToken, isConnected, isAdmin } from "../middleware/token";

//passage parametre entre component
interface PropsUtilisateurForm {
  isUpdate : Boolean
}

export default function UtilisateurFormComponent(props : PropsUtilisateurForm) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [isAdministrator, setIsAdministrator] = useState(false);
  const navigation = useNavigate(); // redirection

  //liste options header requete API
  let headersList = {
    Accept: "*/*",
    Autorization: 'Bearer ' +getToken()?.toString()
  };

  //chargement données update (profil)
  useEffect(() => {
    if(props.isUpdate){
      if(isConnected()){
        let reqOptions = {
          url: "http://localhost:3000/utilisateurs/"+getIdUtilisateur(),
          method: "GET",
          headers: headersList
        };
        axios(reqOptions).then(function (response) {
          setNom(response.data[0].nom)
          setPrenom(response.data[0].prenom)
          setEmail(response.data[0].email)
          setMdp(response.data[0].mdp)
          setIsAdministrator(response.data[0].isAdmin)
        });
      }else{
        navigation("../")
      }
    }
  },[]); 

  //gère le submit update ou create des inputs
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let data = {}
    let typeRequete = ""
    let method = ""

    //cryptage mdp si inscription
    if(!props.isUpdate){
      typeRequete = "create"
      method = "POST"
      data ={nom: nom, prenom: prenom, email: email, mdp: mdp}
    }else{
      typeRequete = "update"
      method = "PUT"
      data = {nom: nom, prenom: prenom, email: email, mdp: mdp, isAdmin: isAdministrator, idUtilisateur: getIdUtilisateur()}
    }
    
    event.preventDefault()  
      let reqOptions = {
        url: "http://localhost:3000/utilisateurs/"+typeRequete,
        method: method,
        data: data,
        headers: headersList
      };
    axios(reqOptions).then(function (response) {
      navigation("../")
    });
  }
  return (
    <div>
      {props.isUpdate ? <h1>Modification d'un bénévole</h1> : <h1>Création d'un bénévole</h1>}
      <form onSubmit={handleSubmit}>
        <label>Nom:
          <input 
            type="text" 
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </label>
        <label>Prénom:
          <input 
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </label>
        <label>Email:
          <input 
            type="text" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>mdp:
          <input 
            type="password"
            value={mdp} 
            onChange={(e) => setMdp(e.target.value)}
          />
        </label>
        {isAdmin() ? <label>Admin:
          <input
            type="checkbox"
            checked={isAdministrator}
            onChange={(e) => setIsAdministrator(e.target.checked)}
          />
        </label> : null}
        <input type="submit"/>
      </form>
    </div>
  )
}

              


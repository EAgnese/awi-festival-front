import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


interface PropsUtilisateurForm {
  isUpdate : Boolean
}

export default function UtilisateurFormComponent(props : PropsUtilisateurForm) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigation = useNavigate(); // redirection

  let headersList = {
    Accept: "*/*",
    Autorization: localStorage.getItem("token"),
  };

  //s'applique à chaque run du component et verifie si j'ai un token dans le local storage pour interdire la page profil sinon
  useEffect(() => {
    // create  (inscription)
    // isUpdate false
    // email & idUtilisateur null
    if(props.isUpdate){
      if(localStorage.getItem("email") == null && localStorage.getItem("idUtilisateur") == null){
        navigation("../")
      }
    }

    //update ( profil)
    //isUpdate true
    //email & idUtilisateur !=nul

    if(props.isUpdate){
      if(localStorage.getItem("email") == null && localStorage.getItem("idUtilisateur") == null){
        navigation("../")
      }
    }
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let data = {}
    let typeRequete = ""
    let method = ""
    
    if(props.isUpdate){
      typeRequete = "update"
      method = "put"
      data = {nom: nom, prenom: prenom, email: email, mdp: mdp, isAdmin: isAdmin, idUtilisateur: localStorage.getItem("idUtilisateur")}
    }else{
      typeRequete = "create"
      method = "post"
      data ={nom: nom, prenom: prenom, email: email, mdp: mdp}
    }
    event.preventDefault()  
      let reqOptions = {
        url: "http://localhost:3000/utilisateurs/"+typeRequete,
        method: method,
        data: data,
      };
      
    axios(reqOptions).then(function (response) {
      console.log(response.data);
    });
  }
  return (
    <div>
      {props.isUpdate ? <h1>Modification d'un bénévole</h1> : <h1>Création d'un bénévole</h1>}
      <form onSubmit={handleSubmit}>
        <label>Nom:
          <input 
            type="text" 
            onChange={(e) => setNom(e.target.value)}
          />
        </label>
        <label>Prénom:
          <input 
            type="text"
            onChange={(e) => setPrenom(e.target.value)}
          />
        </label>
        <label>Email:
          <input 
            type="text" 
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>mdp:
          <input 
            type="password" 
            onChange={(e) => setMdp(e.target.value)}
          />
        </label>
        {Boolean(localStorage.getItem("isAdmin")?.toString) ? <label>Admin:
          <input
            type="checkbox"
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </label> : null}
        <input type="submit"/>
      </form>
    </div>
  )
}

              


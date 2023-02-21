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

  //chargement données update
  useEffect(() => {
    if(props.isUpdate){
      let reqOptions = {
        url: "http://localhost:3000/utilisateurs/info",
        method: "post",
        data: {idUtilisateur: Number(localStorage.getItem("idUtilisateur"))},
      };
      axios(reqOptions).then(function (response) {
        setNom(response.data[0].nom)
        setPrenom(response.data[0].prenom)
        setEmail(response.data[0].email)
        setMdp(response.data[0].mdp)
        setIsAdmin(response.data[0].isAdmin)
      });
    }
  },[]); 

  //s'applique à chaque run du component et verifie si j'ai un token dans le local storage pour interdire la page profil sinon
  useEffect(() => {
    //inscription bénévole & pas connecté & pas admin
    if(!props.isUpdate){
      if(localStorage.getItem("isAdmin")!="1" && localStorage.getItem("email") != null && localStorage.getItem("idUtilisateur") != null){
        navigation("../")
      }
    }
    //profil & pas connecté
    if(props.isUpdate){
      if(localStorage.getItem("email") == null && localStorage.getItem("idUtilisateur") == null){
        navigation("../")
      }
    }
  },[]);

  //gère le submit update ou create des inputs
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let data = {}
    let typeRequete = ""
    let method = ""

    if(props.isUpdate){
      typeRequete = "update"
      method = "put"
      data = {nom: nom, prenom: prenom, email: email, mdp: mdp, isAdmin: isAdmin, idUtilisateur: Number(localStorage.getItem("idUtilisateur"))}
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
        {localStorage.getItem("isAdmin")=="1" ? <label>Admin:
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
          />
        </label> : null}
        <input type="submit"/>
      </form>
    </div>
  )
}

              


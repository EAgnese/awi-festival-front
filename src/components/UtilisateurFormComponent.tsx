import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getIdUtilisateur, getToken, isConnected, isAdmin, memeId } from "../middleware/token";
import Button from '@mui/material/Button';


//passage parametre entre component
interface PropsUtilisateurForm {
  isUpdate : Boolean
}

export default function UtilisateurFormComponent(props : PropsUtilisateurForm) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [isAdministrator, setIsAdministrator] = useState(false);
  const navigation = useNavigate(); // redirection
  let params = useParams(); //recupere les parametre de l'url
  const [modifMdp, setModifMdp] = useState(false); // pour modifier le mdp si besoin
  const [mdp, setMdp] = useState(""); // pour modifier le nouveau mdp
  const [mdpConfirm, setMdpConfirm] = useState(""); // pour modifier le mdp si besoin

  //liste options header requete API
  let headersList = {
    Accept: "*/*",
    Autorization: 'Bearer ' +getToken()?.toString()
  };

  //chargement données update (profil)
  useEffect(() => {
    if(props.isUpdate){
      if(isConnected()){// && getIdUtilisateur() == params.idUtilisateur){
        console.log("PARAMS COMPONENT")
        console.log(params)
        console.log("type param")
        console.log(params.idUtilisateur)
        let reqOptions = {
          url: "http://localhost:3000/utilisateurs/profil/"+params.idUtilisateur,
          method: "GET",
          headers: headersList
        };
        axios(reqOptions).then(function (response) {
          setNom(response.data[0].nom)
          setPrenom(response.data[0].prenom)
          setEmail(response.data[0].email)
          setIsAdministrator(response.data[0].isAdmin)
        });
      }else{
        navigation("../")
      }
    }
  },[]); 

  //apparition formulaire changement mdp
  const handleModifMdp = (event: React.MouseEvent<HTMLElement>) => {
    setModifMdp(true)
  };

  //gère le submit update ou create des inputs
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault() //evite de reactualiser la page quand on submit
    let data = {}
    let typeRequete = ""
    let method = ""
    let header = {}

    console.log("SUBMIT")
    console.log(props.isUpdate)

    //si on est sur la création
    if(!props.isUpdate){
      console.log("CREATE")
      typeRequete = "create"
      method = "POST"
      data ={nom: nom, prenom: prenom, email: email, mdp: mdp}
    }else{ // si on est sur le profil
      console.log("UPDATE")
      typeRequete = "update"
      method = "PUT"
      data = {nom: nom, prenom: prenom, email: email, mdp: mdp, isAdmin: isAdministrator, idUtilisateur: params.idUtilisateur}
      header = headersList
    }
    if(props.isUpdate && mdp!==mdpConfirm){
      console.log("mdp different")
      alert("Les mots de passe ne correspondent pas")
    }else{
      console.log("REQUETE")
      let reqOptions = {
        url: "http://localhost:3000/utilisateurs/"+typeRequete,
        method: method,
        data: data,
        headers: header
      };
      console.log(reqOptions.url)
      console.log(reqOptions.method)
      console.log(reqOptions.data)
      console.log(reqOptions.headers)
      axios(reqOptions).then(function (response) {
        navigation("../")
      });
    }
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
        {!props.isUpdate ?
        <label>Mot de passe:
          <input 
            type="password" 
            onChange={(e) => setMdp(e.target.value)}
          />
        </label>
        :null
        }
        {isAdmin() ? <label>Admin:
          <input
            type="checkbox"
            checked={isAdministrator}
            onChange={(e) => setIsAdministrator(e.target.checked)}
          />
        </label> : null}
        <input type="submit"/>
      </form>
      {memeId(Number(params.idUtilisateur)) ? 
      <div>
       <Button
          key={"modifierMdp"}
          onClick={handleModifMdp}
          >
          Modifier le mot de passe
        </Button>
      </div>
      :null
      }
      {modifMdp && memeId(Number(params.idUtilisateur)) ?
      <form onSubmit={handleSubmit}>
        <label>Nouveau mot de passe:
          <input 
            type="password" 
            onChange={(e) => setMdp(e.target.value)}
          />
        </label>
        <label>Confirmation mot de passe:
          <input 
            type="password" 
            onChange={(e) => setMdpConfirm(e.target.value)}
          />
        </label>
        <input type="submit"/>
      </form>
      :null
      }
    </div>
  )
}

              


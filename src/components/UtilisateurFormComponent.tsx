import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getIdUtilisateur, getToken, isConnected, isAdmin, memeId } from "../middleware/token";
import Button from '@mui/material/Button';
import { notify } from "../middleware/notification";



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
      if(isConnected() && (isAdmin() || getIdUtilisateur() == Number(params.idUtilisateur))){
        let reqOptions = {
          url: "http://localhost:3000/utilisateurs/profil/"+params.idUtilisateur,
          method: "GET",
          headers: headersList
        };
        axios(reqOptions)
        .then(function (response) {
          setNom(response.data[0].nom)
          setPrenom(response.data[0].prenom)
          setEmail(response.data[0].email)
          setIsAdministrator(response.data[0].isAdmin)
        })
        .catch(error => {
          //verif connexion reseau
          if(error.response != null){
            notify(error.response.data.msg, "error")
          }else{
            notify(error.message, "error")
          }
        });
      }else{
        notify("Vous n'avez pas les droits pour accéder à cette page", "error")
        navigation("../")
      }
    }
  },[params.idUtilisateur]); 

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

    //si on est sur la création
    if(!props.isUpdate){
      typeRequete = "create"
      method = "POST"
      data ={nom: nom, prenom: prenom, email: email, mdp: mdp, isAdmin: isAdministrator}
    }else{ // si on est sur le profil
      typeRequete = "update"
      method = "PUT"
      data = {nom: nom, prenom: prenom, email: email, mdp: mdp, isAdmin: isAdministrator, idUtilisateur: params.idUtilisateur}
      header = headersList
    }
    if(props.isUpdate && mdp!==mdpConfirm){
      notify("Les mots de passe ne correspondent pas", "warn")     
    }else{
      let reqOptions = {
        url: "http://localhost:3000/utilisateurs/"+typeRequete,
        method: method,
        data: data,
        headers: header
      };
      axios(reqOptions).then(function (response) {
        if(props.isUpdate){
          notify("Données modifiées ", "success")
          navigation("../benevole/")
        }else{
          notify("Utilisateur créé ", "success")
          navigation("../benevole/")
        }
      })
      .catch(error => {
        //verif connexion reseau
        if(error.response != null){
          notify(error.response.data.msg, "error")
        }else{
          notify(error.message, "error")
        }
      })
    }
  }
  return (
    <div>
      {props.isUpdate? <h1>Modification d'un bénévole</h1> : <h1>Création d'un bénévole</h1>}
      <div id="div-utilisateur">
        <div className="gradient-cards">
            <div>
                <div className="container-card bg-yellow-box">
                    <form id="formBase" onSubmit={handleSubmit}>
                    <label className="card-description">Nom: *
                      <input 
                        required
                        className="input-class"
                        type="text" 
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                      />
                    </label>
                    <label className="card-description">Prénom: *
                      <input 
                        required
                        className="input-class"
                        type="text"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                      />
                    </label>
                    <label className="card-description">Email: *
                      <input 
                        required
                        className="input-class"
                        type="text" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </label>
                    {!props.isUpdate ?
                    <label className="card-description">Mot de passe: *
                      <input 
                        required
                        className="input-class"
                        type="password" 
                        onChange={(e) => setMdp(e.target.value)}
                      />
                    </label>
                    :null
                    }
                    {isAdmin() ? <label className="card-description">Admin:
                      <input
                        className="input-class"
                        type="checkbox"
                        checked={isAdministrator}
                        onChange={(e) => setIsAdministrator(e.target.checked)}
                      />
                    </label> : null}
                    {modifMdp ? null :
                    <input id="bouton-submit"type="submit"/>
                    }
                  </form>
                </div>
            </div>
        </div>
      </div>
      
      {memeId(Number(params.idUtilisateur)) ?
      <div id="div-modifierMDP">
        <div className="gradient-cards">
        
            <div className="container-card bg-yellow-box">
              <div className="card-title">
                <Button
                    id="titre-MD"
                    key={"modifierMdp"}
                    onClick={handleModifMdp}
                    >
                      Modifier le mot de passe
                  </Button>
              </div>
              {modifMdp && memeId(Number(params.idUtilisateur)) ?
                <form id="formMDP" onSubmit={handleSubmit}>
                  <label className="card-description">Nouveau mot de passe:
                    <input 
                      type="password" 
                      className="input-class"
                      onChange={(e) => setMdp(e.target.value)}
                    />
                  </label>
                  <label className="card-description">Confirmation mot de passe:
                    <input 
                      type="password" 
                      className="input-class"
                      onChange={(e) => setMdpConfirm(e.target.value)}
                    />
                  </label>
                  <input id="bouton-submit-mdp" type="submit"/>
                </form>
                :null
                }
            </div>
        </div>
      </div> 
      :null
      }
    </div>
  )
}

              


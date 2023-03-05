import {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { getToken, isConnected, isAdmin, memeId } from "../middleware/token";
import { notify } from "../middleware/notification";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import TypeJeu from "../models/TypeJeu";
import '../assets/jeu.css';
import { createTheme } from '@mui/material/styles';

//passage parametre entre component
interface PropsJeuForm {
  isUpdate : Boolean
}

export default function JeuFormComponent(props : PropsJeuForm) {

  const [nom, setNom] = useState("");
  const navigation = useNavigate(); // redirection
  let params = useParams(); //recupere les parametre de l'url
  //types jeux chargé de la bd
  const [typeJeux,setTypeJeux] = useState<string[]>([])
  //type jeu sélectionné
  const [typeJeuxSelectNom, setTypeJeuxSelectNom] = useState("");

  //couleur select
  const theme = createTheme({
    palette: {
      primary: {
        main: '#0971f1',
      },
    },
  });

  //style select
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event : SelectChangeEvent) => {
    setTypeJeuxSelectNom(event.target.value);
  };

  //liste options header requete API
  let headersList = {
    Accept: "*/*",
    Autorization: 'Bearer ' +getToken()?.toString()
  };

  //chargement données update
  useEffect(() => {
    if(props.isUpdate){
      if(isAdmin()){
        let reqOptions = {
          url: "http://localhost:3000/jeux/"+params.idJeu,
          method: "GET",
          headers: headersList
        };
        axios(reqOptions)
        .then(function (response) {
          setNom(response.data[0].nom)

          typeJeux?.map((objet : string) => {
            if(JSON.parse(objet).idType === response.data[0].idType){
              setTypeJeuxSelectNom(JSON.parse(objet).nom)
            }
          })
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
  },[params.idJeu,typeJeux]); 

  //chargement données type de jeu
  useEffect(() => {
    let reqOptions = {
      url: "http://localhost:3000/typeJeux/",
      method: "GET",
    };
    axios(reqOptions)
    .then(function (response) {
      const tabTypeJeu = [] as string[]
      response.data?.map((objet : TypeJeu) => {
        let stringType = JSON.stringify({
          idType : objet.idType,
          nom : objet.nom
        })
        tabTypeJeu.push(stringType)
      })
      setTypeJeux(tabTypeJeu)
    })
    .catch(error => {
      //verif connexion reseau
      if(error.response != null){
        notify(error.response.data.msg, "error")
      }else{
        notify(error.message, "error")
      }
    })
  },[])

  //gère le submit update ou create des inputs
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    let idSelect = 0
    typeJeux?.map((objet : string) => {
      if(JSON.parse(objet).nom === typeJeuxSelectNom){
        idSelect = JSON.parse(objet).idType
      }
    })
    event.preventDefault() //evite de reactualiser la page quand on submit
    let data = {}
    let typeRequete = ""
    let method = ""

    //si on est sur la création
    if(!props.isUpdate){
      typeRequete = "create"
      method = "POST"
      data = {idType:idSelect, nom: nom}
    }else{ // si on est sur l'update'
      typeRequete = "update"
      method = "PUT"
      data = {idJeu: Number(params.idJeu),idType: idSelect, nom: nom, }
      console.log(data)
    }

    let reqOptions = {
      url: "http://localhost:3000/jeux/"+typeRequete,
      method: method,
      data: data,
      headers: headersList
    };
    axios(reqOptions).then(function (response) {
      if(props.isUpdate){
        notify("Données modifiées ", "success")
        navigation("../jeu")
      }else{
        notify("jeu créé ", "success")
        navigation("../jeu")
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
  return (
    <div>
      {props.isUpdate? <h1>Modification d'un jeu</h1> : <h1>Création d'un jeu</h1>}
      <form onSubmit={handleSubmit}>
        <label>Nom: *
          <input 
            required
            type="text" 
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </label>
        <InputLabel id="select-multiple">Type du jeu</InputLabel>
        <Select
          labelId="select-multiple"
          required
          value={typeJeuxSelectNom || ""}
          id="select-type-jeu"
          onChange={handleChange}
          renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
              <Chip key={selected} label={selected} color="primary"/>
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {typeJeux?.map((objet : string) => (
            <MenuItem
              key={JSON.parse(objet).idType}
              value={JSON.parse(objet).nom}
            >
              {JSON.parse(objet).nom}
            </MenuItem>
          ))}
        </Select>
        <input type="submit"/>
      </form>
    </div>
  )
}

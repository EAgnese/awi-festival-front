import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";//outlet pour indiquer ou placer le chield component dans app & link pour remplacer les a href (pour ne pas recharger la page)
import axios from "axios";
import Jeu from '../models/Jeu';
import AttributionZone from '../models/AttributionZone';
import ClearIcon from '@mui/icons-material/Clear';
import { getToken, isAdmin, isConnected } from '../middleware/token';
import { notify } from "../middleware/notification";
import { useNavigate, useParams } from "react-router-dom";
import { green, blue, yellow, grey,orange } from '@mui/material/colors';
import '../assets/zoneInfo.css';
import Creneau from '../models/Creneau';

export default function ZoneInfoComponent() {
    const [jeux,setJeux] = useState([])
    const [affectationsZones,setAffectationsZone] = useState([])
    const [creneaux, setCreneaux] = useState<Creneau[]>([])
    let params = useParams(); //recupere les parametre de l'url
    const navigation = useNavigate(); // redirection

    let min=0; 
    let max=4;  
    let listeCouleur = ["container-card bg-blue-box","container-card bg-green-box","container-card bg-white-box","container-card bg-yellow-box"]
    let listeCouleurLogo = [blue[800],green[800],grey[50],yellow[800]]

    //liste options header requete API
    let headersList = {
        Accept: "*/*",
        Autorization: 'Bearer ' +getToken()?.toString()
    };

    //chargement jeux affecté à la zone
    useEffect(() => {
        //requête pour les jeux
        let reqOptions = {
            url: "http://localhost:3000/attributionsJeux/zone/"+params.idZone,
            method: "GET",
        }
        axios(reqOptions)
        .then(function (response) {
            setJeux(response.data)
        })
        .catch(error => {
            //verif connexion reseau
            if(error.response != null){
                notify(error.response.data.msg, "error")
            }else{
                notify(error.message, "error")
            }
        })

        //requête pour les créneaux et bénévoles
        let reqOptions2 = {
            url: "http://localhost:3000/attributionsZone/zone/"+params.idZone,
            method: "GET",
        }
        axios(reqOptions2)
        .then(function (response) {
            const temp = response.data.map((item : AttributionZone) => {
                const tempDebut = new Date(item.creneau.dateDebut)
                const tempFin = new Date(item.creneau.dateFin)
                return {
                    zone : item.zone,
                    creneau :{
                        id: item.creneau.id,
                        dateDebut : tempDebut,
                        dateFin : tempFin
                    },
                    benevole : item.benevole
                }
            })
            setAffectationsZone(temp)

            let tempCreneaux : Creneau[] = []

            temp.forEach ( (value : AttributionZone) => {
                if (tempCreneaux.length == 0){
                    tempCreneaux.push(value.creneau)
                }else{
                    let isIN = false
                    let i = 0
                    while (!isIN && i<=tempCreneaux.length){

                        isIN = (value.creneau.id == tempCreneaux[i].id)
                        i++
                    }
                    if (!isIN) {
                        tempCreneaux.push(value.creneau)
                    }
                }
            });

            setCreneaux(tempCreneaux)
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

    const handleDelete = (event:  React.MouseEvent<HTMLElement>) => {
        const id = event.currentTarget.getAttribute("value")
        if(isAdmin()){
            let reqOptions = {
                url: "http://localhost:3000/Attributionsjeux/delete",
                method: "DELETE",
                data: {idZone:Number(params.idZone),idJeu: Number(id)},
                headers: headersList
            }
            axios(reqOptions).then(function (response) {
                //filtrer pour enlever le jeu supprimé
                const jeuFiltre = jeux.filter((item : Jeu) => item.idJeu != Number(id))
                setJeux(jeuFiltre)
                notify("Le jeu sélectioné vient d'être retiré de la zone n°"+params.idZone , "success")
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
    }
    return (
        <div>
            <h1>Listes des jeux affecté<script></script> à la zone</h1>
            <div id="div-jeu">
                {jeux?.map((item : Jeu) => (
                    <div className="gradient-cards">
                        <div>
                            <div className={listeCouleur[Math.floor(Math.random() * (max - min)) + min]}>
                                <p key={"p-idJeu"+item.idJeu} className="card-title">{"Jeu n°" +item.idJeu}</p>
                                <p key={"p-idType"+item.idJeu} className="card-description">{"idType : "+item.idType}</p>
                                <p key={"p-nom"+item.idJeu} className="card-description">{"Nom du jeu : "+item.nom}</p>
                                {isConnected() ?
                                <div>
                                    <div>
                                        <Button
                                            key={"delete"}
                                            value={item.idJeu.toString()}
                                            onClick={handleDelete}
                                        >
                                            <ClearIcon />
                                        </Button>
                                    </div>
                                </div>
                                :null}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <Button
                    key={"attribuerJeu"}
                    id="bouton-ajout-jeu"
                >  
                    <Link to={`/zone/attribution_Jeu/`+params.idZone} className='link-ajout-jeu'>Ajouter un jeu</Link>
                </Button>
            </div>
            <div>
                <h1>Listes créneaux & bénévoles</h1>
                <div id="div-créneau">
                {creneaux?.map((item : Creneau) => (
                    <div className="gradient-cards">
                        <div>
                            <div className={listeCouleur[Math.floor(Math.random() * (max - min)) + min]}>
                                <p key={"p-idCreneau"+item.id} className="card-title">{"Créneau n°" +item.id}</p>
                                <p key={"p-date-deb"+item.id} className="card-description">{"Début : "+item.dateDebut.getDate() + '/' + (item.dateDebut.getMonth()+1) + ' ' + item.dateDebut.getHours() + ':' + item.dateDebut.getMinutes()}</p>
                                <p key={"p-date-fin"+item.id} className="card-description">{"Fin : "+item.dateFin.getDate() + '/' + (item.dateFin.getMonth()+1) + ' ' + item.dateFin.getHours() + ':' + item.dateFin.getMinutes()}</p>

                                {affectationsZones?.map((attr : AttributionZone) => (
                                    <div className = "div-attrib">
                                        {(attr.creneau.id == item.id) ? 
                                        <div className="gradient-cards">
                                            <div className={listeCouleur[Math.floor(Math.random() * (max - min)) + min]}>
                                                <p key={"p-idBene"+attr.benevole.id} className="card-title">{"Bénévole n°" +item.id}</p>
                                                <p key={"p-nom"+attr.benevole.id} className="card-description">{"Nom : "+attr.benevole.nom}</p>
                                                <p key={"p-prenom"+attr.benevole.id} className="card-description">{"Prénom : "+attr.benevole.prénom}</p>
                                            </div>
                                        </div>
                                        : null}
                                    </div>
                                ))}

                                {isConnected() ?
                                <div>
                                    <div>
                                        <Button
                                            key={"delete"}
                                            value={item.id.toString()}
                                            onClick={handleDelete}
                                        >
                                            <ClearIcon />
                                        </Button>
                                    </div>
                                </div>
                                :null}
                            </div>
                        </div>
                    </div>
                ))}
                </div>    
            </div>
            <div id="bouton-attribution">
                <Button
                    key={"attribuerBenevole"}
                    id="bouton-ajout-benevole"
                >  
                    <Link to={`/`+params.idZone} className='link-ajout-jeu'>Ajouter un bénévole</Link>
                </Button>

            </div>  
        </div>
    )
}


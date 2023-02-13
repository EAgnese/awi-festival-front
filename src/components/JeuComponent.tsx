import { useState, useEffect } from 'react';
import Jeu from '../models/Jeu'
import { useParams } from "react-router-dom";
import axios from "axios";

export default function JeuComponent() {

    const { idJeu} = useParams()
    const [typejeu,setTypeJeu] = useState([])
    const [jeu,setJeu] = useState([])
    let headersList = {
        Accept: "*/*",
        Autorization: localStorage.getItem("token"),
    };

    useEffect(() => {  
        let reqOptionsJeu = {
            url: "http://localhost:3000/jeux/info",
            method: "get",
            data : {id : idJeu}
        };
        
        axios(reqOptionsJeu).then(function (response) {
            console.log(response.data);
            setJeu(response.data);
        });

        let reqOptionsType = {
            url: "http://localhost:3000/typesJeux/info",
            method: "get",
            data : {'id' : jeu.idType}
        };
        
        axios(reqOptionsType).then(function (response) {
            console.log(response.data);
            setTypeJeu(response.data);
        });
    },[]); 

    return (
        <div>
            <p>yo</p>
            <p>{typejeu.nom}</p>
            <p>{jeu.nom}</p>
        </div>
    )
}


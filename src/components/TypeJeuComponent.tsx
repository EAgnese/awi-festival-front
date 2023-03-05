import React, { useState, useEffect } from 'react';
import TypeJeu from '../models/TypeJeu'
import axios from "axios";

export default function TypeJeuComponent() {

    const [typesJeu,setTypeJeu] = useState([])
    let headersList = {
        Accept: "*/*",
        Autorization: localStorage.getItem("token"),
    };

    useEffect(() => {  
        let reqOptions = {
            url: "http://localhost:3000/typesJeux/",
            method: "get",
          };
        
        axios(reqOptions).then(function (response) {
            console.log(response.data);
            setTypeJeu(response.data);
        });
    },[]); 

    return (
        <div>
            <h1>prout</h1>
            <ul id="test">
                {typesJeu.map((item : TypeJeu) => 
                    <li key={item.idType.toString()}>{item.idType + ' : ' + item.nom}</li>
                )}
            </ul>
        </div>
    )
}
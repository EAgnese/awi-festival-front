import { useState} from "react";
import axios from "axios";

export default function BenevoleFormComponent() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [mdp, setMdp] = useState("");

  let headersList = {
    Accept: "*/*",
    Autorization: localStorage.getItem("token"),
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //evite de reactualiser la page quand on submit    
        let reqOptions = {
            url: "http://localhost:3000/benevoles/create",
            method: "post",
            data: {nom: nom, prenom: prenom, email: email, mdp: mdp},
          };
        
        axios(reqOptions).then(function (response) {
            console.log(response.data);
        });
  }
  return (
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
          type="text" 
          onChange={(e) => setMdp(e.target.value)}
        />
      </label>
      <input type="submit"/>
    </form>
  )
}

              


import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Error from './components/Error'
import Zone from './components/Zone'
import './index.css'
import UtilisateurComponent from './components/UtilisateurComponent'
import UtilisateurFormComponent from './components/UtilisateurFormComponent'
import TypeJeuComponent from './components/TypeJeuComponent'
import JeuListComponent from './components/JeuListComponent'
import JeuComponent from './components/JeuComponent'
import Connexion from './components/Connexion'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";




const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />, // n'importe quel sous lien apres le / amenera a la page d'erreur, si /Utilisateur/truc existe pas yaura pas d'erreur si /Utilisateur existe
    children: [
      {
        path: "benevole/",
        element: <UtilisateurComponent />,
      },
      {
        path: "benevole/create/",
        element: <UtilisateurFormComponent isUpdate={false} />,
      },
      {
        path: "zone/",
        element: <Zone />,
      },
      {
        path: "connexion/",
        element: <Connexion />,
      },
      {
        path: "benevole/profil/",
        element: <UtilisateurFormComponent isUpdate={true} />,
      },
      {
        path: "type_jeu/",
        element: <TypeJeuComponent />,
      },
      {
        path: "jeu/",
        element: <JeuListComponent />,
      },
      {
        path: "jeu/:idJeu",
        element: <JeuComponent />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

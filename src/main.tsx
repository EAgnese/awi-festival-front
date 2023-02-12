import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Error from './components/Error'
import Zone from './components/Zone'
import './index.css'
import BenevoleComponent from './components/BenevoleComponent'
import BenevoleFormComponent from './components/BenevoleFormComponent'
import Connexion from './components/Connexion'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";




const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />, // n'importe quel sous lien apres le / amenera a la page d'erreur, si /benevole/truc existe pas yaura pas d'erreur si /benevole existe
    children: [
      {
        path: "benevole/",
        element: <BenevoleComponent />,
      },
      {
        path: "benevole/create/",
        element: <BenevoleFormComponent />,
      },
      {
        path: "zone/",
        element: <Zone />,
      },
      {
        path: "connexion/",
        element: <Connexion />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

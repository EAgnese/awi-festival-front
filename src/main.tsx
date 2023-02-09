import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Error from './components/Error'
import ErrorBenevole from './components/ErrorBenevole'
import Zone from './components/Zone'
import './index.css'

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Benevole from './components/Benevole'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error />, // n'importe quel sous lien apres le / amenera a la page d'erreur, si /benevole/truc existe pas yaura pas d'erreur si /benevole existe
    children: [
      {
        path: "benevole/",
        element: <Benevole />,
      },
      {
        path: "zone/",
        element: <Zone />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)

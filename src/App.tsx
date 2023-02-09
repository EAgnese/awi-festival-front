import './App.css'
import Benevole from './components/Benevole'
import Zone from './components/Zone'
import { Outlet } from "react-router-dom";//pour indiquer ou placer le chield component dans app

function App() {
  return (
    <div>
      <h1>App</h1>
      <Outlet />
      <h1>App fin</h1>
    </div>
  )
}

export default App

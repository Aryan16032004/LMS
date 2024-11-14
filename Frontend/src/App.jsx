import './App.css'
import { Outlet } from 'react-router-dom'
import Header from './Component/Header'
function App() {
  

  return (
    <>
    <Header/>
    <Outlet/>
    </>
  )
}

export default App
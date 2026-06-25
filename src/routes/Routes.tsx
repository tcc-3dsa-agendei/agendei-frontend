import { BrowserRouter, Routes, Route } from "react-router-dom";
//Coloque os importes das páginas conforme vocês forem adicionando/criando
//EX:
//import { Login } from "../pages/Login"
import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { HeroSection } from "../pages/HeroSection";



export function SetupNavigation() {
    return(
        <BrowserRouter>
            <Routes>

                <Route path='/' element={ <HeroSection/>} />
                <Route path='login' element={ <Login/>} />
                <Route path='register' element={ <Register/>} />
                <Route path='home' element={ <Home/> }/>
                <Route path='about' element={ <About/> }/>
                
                

            </Routes>
        </BrowserRouter>
    )
}

/*Para utilizar dentro das páginas:
    -- Importar = import { Link, useNavigate } from 'react-router-dom'
*/
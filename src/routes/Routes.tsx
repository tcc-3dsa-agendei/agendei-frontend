import { BrowserRouter, Routes, Route } from "react-router-dom";
//Coloque os importes das páginas conforme vocês forem adicionando/criando
//EX:
//import { Login } from "../pages/Login"
import { Home } from "../pages/Home";
import { About } from "../pages/About";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { HeroSection } from "../pages/HeroSection";
import { Schedule } from "../pages/Schedule";
import { Clients } from "../pages/Clients";



export function SetupNavigation() {
    return(
        <BrowserRouter>
            <Routes>

                <Route path='/' element={ <HeroSection/>} />
                <Route path='/login' element={ <Login/>} />
                <Route path='/register' element={ <Register/>} />
                <Route path='/home' element={ <Home/> }/>
                <Route path='/about' element={ <About/> }/>
                <Route path='/agenda' element={ <Schedule/>} />
                <Route path='/clientes' element={ <Clients/>} />
                

                {/*Não esquecer de colocar a barra antes do nome da rota:
                    Ex: <Route path='/' element={ <HeroSection/>} />
                */}
            </Routes>
        </BrowserRouter>
    )
}

/*Para utilizar dentro das páginas:
    -- Importar = import { Link, useNavigate } from 'react-router-dom'
*/
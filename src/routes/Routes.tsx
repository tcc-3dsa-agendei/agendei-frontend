import { BrowserRouter, Routes, Route } from "react-router-dom";
//Coloque os importes das páginas conforme vocês forem adicionando/criando
//EX:
import { Login } from "../pages/Login"
import { Home } from "../pages/Home"
import { Register } from "../pages/Register"


export function SetupNavigation() {
    return(
        <BrowserRouter>
            <Routes>

                <Route path='/' element={ <Login/>} />

                <Route path='Home' element={ <Home/> }>
                    {/*Colocar todas as páginas que possuem o menu
                    EX:*/}
                    {/*<Route path='Profile' element={ <Profile/> }/>*/}
                    <Route path='Register' element={ <Register/> }/>

                </Route>
                

            </Routes>
        </BrowserRouter>
    )
}

/*Para utilizar dentro das páginas:
    -- Importar = import { Link, useNavigate } from 'react-router-dom'
*/
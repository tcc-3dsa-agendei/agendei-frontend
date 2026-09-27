import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

import styles from './MainLayout.module.css'

interface MainLayoutProps{
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps){

    return(

        <div className={styles.layout}>

                <Sidebar />

            <div className={styles.content}>

                <main className={styles.main}>
                    {children}
                </main>

                <Footer />

            </div>

        </div>

    )
}

export default MainLayout
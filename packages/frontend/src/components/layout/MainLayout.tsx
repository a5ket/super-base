import styles from '@styles/layout.module.css'
import { type PropsWithChildren } from 'react'
import { Link, Outlet, useLocation } from 'react-router'

export default function MainLayout({ children }: PropsWithChildren) {
    const location = useLocation()
    void children

    const isActive = (path: string) => {
        return location.pathname.startsWith(path)
    }

    return (
        <div className={styles.layout}>
            <header className={styles.header}>
                <div className={styles.container}>
                    <Link to="/" className={styles.logo}>
                        Superhero Database
                    </Link>
                    <nav className={styles.nav}>
                        <ul className={styles.navList}>
                            <li>
                                <Link
                                    to="/superheroes"
                                    className={`${styles.navLink} ${isActive('/superheroes') ? styles.active : ''}`}
                                >
                                    Superheroes
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/superheroes/create"
                                    className={`${styles.navLink} ${isActive('/superheroes/create') ? styles.active : ''}`}
                                >
                                    Add New
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className={styles.main}>
                <div className={styles.container}>
                    <Outlet />
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.container}>
                    <p className={styles.footerText}>
                        &copy; {new Date().getFullYear()} SuperHero DB
                    </p>
                </div>
            </footer>
        </div>
    )
}

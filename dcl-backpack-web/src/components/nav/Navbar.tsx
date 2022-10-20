import {NextRouter, useRouter} from "next/router";
import Link from "next/link";

import styles from '../../../styles/Nav.module.css'

const navigationRoutes = ["home", "backpack", "outfits"];

export default function Navbar() {
    const router = useRouter();
    return (
        <nav className={styles.nav_container}>
            {navigationRoutes.map((singleRoute) => {
                return (
                    <NavigationLink
                        key={singleRoute}
                        href={`/${singleRoute}`}
                        text={singleRoute}
                        router={router}
                    />
                );
            })}
        </nav>
    );
}

interface NavLinkProps {
    href: string,
    text: string,
    router: NextRouter
}

export const NavigationLink = ({href, text, router}: NavLinkProps) => {
    const isActive = router.asPath === (href === "/home" ? "/" : href);
    return (
        <Link href={href === "/home" ? "/" : href} passHref>
            <div className={`${isActive && styles.nav_item_active} ${styles.nav_item}`}>
                {text.charAt(0).toUpperCase() + text.slice(1)}
            </div>
        </Link>
    );
}
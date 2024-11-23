'use client';
import {usePathname, useRouter} from "next/navigation";
import Link from "next/link";

import styles from "@/styles/Nav.module.css";

const navigationRoutes = ["home", "backpack", "outfits"];

export default function Navbar() {
	const router = useRouter();
	const pathName = usePathname();
	return (
		<nav className={styles.nav_container}>
			{navigationRoutes.map((singleRoute) => {
				return (
					<NavigationLink
						key={singleRoute}
						href={`/${singleRoute}`}
						text={singleRoute}
						pathName={pathName || ""}
					/>
				);
			})}
		</nav>
	);
}

interface NavLinkProps {
	href: string,
	text: string,
	pathName: string
}

export const NavigationLink = ({href, text, pathName}: NavLinkProps) => {
	const isActive = pathName === (href === "/home" ? "/" : href);
	return (
		<Link href={href === "/home" ? "/" : href} passHref>
			<div
				className={`${isActive && styles.nav_item_active} ${styles.nav_item}`}>
				{text.charAt(0).toUpperCase() + text.slice(1)}
			</div>
		</Link>
	);
};
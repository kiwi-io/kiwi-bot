import React from "react";
import styles from "./NavButton.module.css";

export interface NavButtonProps {
    name: string;
    iconClass: string;
}
const NavButton = ({
    name,
    iconClass
}: NavButtonProps) => {
    return(
        <div className={styles.navButtonContainer}>
            <div className={styles.navIcon}>
                <i className={iconClass}></i>
            </div>
            <div className={styles.navTitle}>
                {name}
            </div>
        </div>
    )
}

export default NavButton;
import React from "react";
import styles from "./NavButton.module.css";

export interface NavButtonProps {
    name: string;
    iconClass: string;
    isActive: boolean;
}
const NavButton = ({
    iconClass,
    isActive
}: NavButtonProps) => {
    return(
        <div className={styles.navButtonContainer}>
            <div
                className={styles.navIcon}
                style = {{
                    color: isActive ? `#481801` : `#aaaaaa`
                }}
            >
                <i className={iconClass}></i>
            </div>
        </div>
    )
}

export default NavButton;
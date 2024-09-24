import React, { useEffect } from "react";
import styles from "./QRCode.module.css";

import QRCodeStyling from "qr-code-styling";
import { OPTIONS_BLACK_NO_IMG } from "../../constants";

export interface QRCodeProps {
    data: string;
}
const QRCode = ({
    data
}: QRCodeProps) => {
    useEffect(() => {
        const qrCode = new QRCodeStyling({
          ...OPTIONS_BLACK_NO_IMG,
          data: data,
        });
    
        qrCode.append(document.getElementById("qr-code"));
        
        return () => {
            //@ts-ignore
            document.getElementById("qr-code")?.innerHTML = "";
        };
    }, [data]);
    

    return (
        <div className={styles.qrCodeContainer}>
            <div id = "qr-cde">

            </div>
        </div>
    );
}

export default QRCode;

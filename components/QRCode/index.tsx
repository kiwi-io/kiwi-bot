import React, { useEffect, useRef } from "react";
import styles from "./QRCode.module.css";
import QRCodeStyling from '@solana/qr-code-styling';

import { OPTIONS_BLACK_NO_IMG } from "../../constants";

export interface QRCodeProps {
    data: string;
}
const QRCode = ({
    data
}: QRCodeProps) => {

    const qrCodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const qrCode = new QRCodeStyling({
          ...OPTIONS_BLACK_NO_IMG,
          data: data,
        });

        if (qrCodeRef.current) {
            qrCode.append(qrCodeRef.current);
        }
      
        return () => {
            if (qrCodeRef.current) {
              qrCodeRef.current.innerHTML = "";
            }
        };      
    }, [data]);
    

    return (
        <div className={styles.qrCodeContainer}>
            <div ref = {qrCodeRef}>

            </div>
        </div>
    );
}

export default QRCode;

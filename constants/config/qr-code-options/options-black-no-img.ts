import { DrawType } from "@solana/qr-code-styling"

export const OPTIONS_BLACK_NO_IMG: any = {
    "type": "svg" as DrawType,
    "width": 256,
    "height": 256,
    "margin": 0,
    "qrOptions": {
      "typeNumber": "0",
      "mode": "Byte",
      "errorCorrectionLevel": "Q"
    },
    "imageOptions": {
      "hideBackgroundDots": true,
      "imageSize": 0.3,
      "margin": 10
    },
    "dotsOptions": {
      "type": "rounded",
      "color": "#0d0d0c",
      "gradient": null
    },
    "backgroundOptions": {
      "color": "#fffefa"
    },
    "image": null,
    "dotsOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#6a1a4c",
        "color2": "#6a1a4c",
        "rotation": "0"
      }
    },
    "cornersSquareOptions": {
      "type": "extra-rounded",
      "color": "#0d0d0c"
    },
    "cornersSquareOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#000000",
        "color2": "#000000",
        "rotation": "0"
      }
    },
    "cornersDotOptions": {
      "type": "",
      "color": "#0d0d0c"
    },
    "cornersDotOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#000000",
        "color2": "#000000",
        "rotation": "0"
      }
    },
    "backgroundOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#ffffff",
        "color2": "#ffffff",
        "rotation": "0"
      }
    }
  }
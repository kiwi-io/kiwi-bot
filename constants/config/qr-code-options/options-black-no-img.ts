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
      "color": "#481801",
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
        "color1": "#481801",
        "color2": "#481801",
        "rotation": "0"
      }
    },
    "cornersSquareOptions": {
      "type": "extra-rounded",
      "color": "#481801"
    },
    "cornersSquareOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#481801",
        "color2": "#481801",
        "rotation": "0"
      }
    },
    "cornersDotOptions": {
      "type": "",
      "color": "#481801"
    },
    "cornersDotOptionsHelper": {
      "colorType": {
        "single": true,
        "gradient": false
      },
      "gradient": {
        "linear": true,
        "radial": false,
        "color1": "#481801",
        "color2": "#481801",
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
        "color1": "#481801",
        "color2": "#481801",
        "rotation": "0"
      }
    }
  }
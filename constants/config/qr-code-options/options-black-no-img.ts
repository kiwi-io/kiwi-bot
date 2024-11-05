import { DrawType } from "@solana/qr-code-styling";

export const OPTIONS_BLACK_NO_IMG: any = {
  type: "svg" as DrawType,
  width: 256,
  height: 256,
  margin: 0,
  qrOptions: {
    typeNumber: "0",
    mode: "Byte",
    errorCorrectionLevel: "Q",
  },
  imageOptions: {
    saveAsBlob: true,
    hideBackgroundDots: true,
    imageSize: 0.28,
    margin: 10,
  },
  dotsOptions: {
    type: "rounded",
    color: "#8d3811",
    roundSize: true,
    gradient: {
      type: "radial",
      rotation: 1.5707963267948966,
      colorStops: [
        {
          offset: 0,
          color: "#d28460",
        },
        {
          offset: 1,
          color: "#6e2b0d",
        },
      ],
    },
  },
  backgroundOptions: {
    round: 0,
    color: "#fffefa",
    gradient: null,
  },
  image:
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIxNiIgaGVpZ2h0PSIxMDQwIiB2aWV3Qm94PSIwIDAgMTIxNiAxMDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTA5NS4wMSAzODcuMjUyQzEwOTUuMDEgMzkyLjg1OCAxMDkzLjY1IDM5OC42MTYgMTA5Mi44OSA0MDQuMDcxTDEwODguMzYgNDI2LjM0NkwxMDQ5LjUzIDYyMS44MTNWNjIzLjkzNUMxMDMxLjc1IDcyNS44MDEgOTc4LjcyNSA4MTguMTE1IDg5OS43NzUgODg0LjYzM0M4MjAuODI1IDk1MS4xNTEgNzIxLjAxNCA5ODcuNjExIDYxNy45MDQgOTg3LjU5NkM1ODkuNzA0IDk4Ny42NSA1NjEuNTY2IDk4NC45MSA1MzMuOTA0IDk3OS40MTRDNTMzLjEgOTc5LjQ5OSA1MzIuMjkgOTc5LjQ5OSA1MzEuNDg3IDk3OS40MTRDNTI3LjI1NyA5NzguNTA0IDUyMy4xNzggOTc3Ljc0NyA1MTkuMDk4IDk3Ni42ODZMNTA4LjUyMyA5NzQuMjYxQzQwMi42OTIgOTQ4Ljg0NSAzMDMuNDgyIDkwMS4wODYgMjE3LjUxMSA4MzQuMTdDMTMxLjU0IDc2Ny4yNTMgNjAuNzg0OCA2ODIuNzE4IDkuOTY2NTUgNTg2LjIwNUw3LjcwMDk0IDU4MS42NTlDMS43OTg4NCA1NjguNzc4IC0wLjc3ODk4NCA1NTQuNjE1IDAuMjA0MjI4IDU0MC40NzJDMS4xODc0NCA1MjYuMzMgNS43MDAxOCA1MTIuNjYzIDEzLjMyNzYgNTAwLjcyOEMyMC45NTUxIDQ4OC43OTIgMzEuNDUxNSA0NzguOTcyIDQzLjg1MyA0NzIuMTdDNTYuMjU0NCA0NjUuMzY5IDcwLjE2MjggNDYxLjgwMyA4NC4yOTc0IDQ2MS44MDJDOTYuNDE1NiA0NjEuNzYyIDEwOC4zOTcgNDY0LjM3MSAxMTkuNDA3IDQ2OS40NDhDMTMwLjQxOCA0NzQuNTI0IDE0MC4xOTMgNDgxLjk0NyAxNDguMDUyIDQ5MS4xOThDMTQ4LjM0MSA0NzcuOTE4IDE1My4yNTkgNDY1LjE1OCAxNjEuOTUzIDQ1NS4xMzhDMTcwLjY0NyA0NDUuMTE3IDE4Mi41NjggNDM4LjQ2OCAxOTUuNjQyIDQzNi4zNDZDMTk4LjcyNyA0MzUuNzM2IDIwMS44NjQgNDM1LjQzMiAyMDUuMDA4IDQzNS40MzdDMjMzLjQxMSA0MzUuNDM3IDI1MC4zMzEgNDU2LjY1IDI2MS4zNiA0ODMuMzE4TDI4Mi42NjIgNTQwLjQ0NEw0MzAuMjY1IDIyMC41NzRMNDQ3LjE4NSAxODQuMDU1VjE4Mi42OTJDNDU2Ljc5OCAxNjUuMTI0IDQ2Ny44NjYgMTQ4LjM5OCA0ODAuMjcxIDEzMi42ODlDNTE5LjEwNiA4My40NDUxIDU3MC41MyA0NS42ODYgNjI5LjA2NiAyMy40MzMyQzY4Ny42MDIgMS4xODAzNyA3NTEuMDU5IC00LjczMzA0IDgxMi42ODEgNi4zMjE4NEM4NzQuMzAzIDE3LjM3NjcgOTMxLjc4MyA0NC45ODU4IDk3OC45OTggODYuMjEwM0MxMDI2LjIxIDEyNy40MzUgMTA2MS40IDE4MC43MzEgMTA4MC44MSAyNDAuNDIzQzEwNjMuNTkgMjYyLjEyMiAxMTU2LjgyIDI1OS42NDQgMTE1OS42NSAyODcuMjNDMTE2Mi40NyAzMTQuODE2IDEwNzQuNjYgMzcwLjI3MiAxMDk1LjkxIDM4OC4wMDlMMTA5NS4wMSAzODcuMjUyWiIgZmlsbD0iI0ZGOUQwMCIvPgo8cGF0aCBkPSJNMTIxNS44NyAyODAuMDkxTDEwOTUuMDEgMzg3LjI1MkMxMDczLjYgMzY5LjYgMTA2MS4xIDM0NC42OTkgMTA1OC4yNSAzMTcuMjQ2QzEwNTUuNDEgMjg5Ljc5MyAxMDYzLjQ2IDI2Mi4wMTcgMTA4MC44MSAyNDAuNDIzTDEyMTUuODcgMjgwLjA5MVoiIGZpbGw9IiNEODRCMkYiLz4KPHBhdGggZD0iTTgxNS4zNDIgNDAwLjA5N0M4NjIuMTQgNDAwLjA5NyA5MDAuMDc4IDM2MS4zMTcgOTAwLjA3OCAzMTMuNDc4QzkwMC4wNzggMjY1LjY0IDg2Mi4xNCAyMjYuODYgODE1LjM0MiAyMjYuODZDNzY4LjU0NCAyMjYuODYgNzMwLjYwNyAyNjUuNjQgNzMwLjYwNyAzMTMuNDc4QzczMC42MDcgMzYxLjMxNyA3NjguNTQ0IDQwMC4wOTcgODE1LjM0MiA0MDAuMDk3WiIgZmlsbD0iIzIzMUYyMCIvPgo8cGF0aCBkPSJNODM2LjA1NSAzMDIuMThDODUyLjY5NCAzMDIuMTggODY2LjE4MyAyODcuODQ4IDg2Ni4xODMgMjcwLjE2OUM4NjYuMTgzIDI1Mi40ODkgODUyLjY5NCAyMzguMTU4IDgzNi4wNTUgMjM4LjE1OEM4MTkuNDE1IDIzOC4xNTggODA1LjkyNiAyNTIuNDg5IDgwNS45MjYgMjcwLjE2OUM4MDUuOTI2IDI4Ny44NDggODE5LjQxNSAzMDIuMTggODM2LjA1NSAzMDIuMThaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTE1LjEgNzM4LjE1OEMxMTUuMSA3MzguMTU4IDQ5My4xODMgNTA0LjgwNyA1ODcuOTMgNTEzLjMwNEM2ODguMzA0IDUyMi40MDcgNzA3Ljc3IDY1Mi4yODIgNTg1LjY0OSA3NDAuODg5QzQ3NC43ODEgODIxLjQ1NCAxOTIuODE0IDgwNS44MjcgMTE1LjEgNzM4LjE1OFoiIGZpbGw9IiNEODRCMkYiLz4KPHBhdGggZD0iTTQ5NS4xODYgMTAzOS42N1Y4NjIuNjcxSDU1NS40NDJWMTAzOS42N0w1MjUuMzE0IDEwMDguODlMNDk1LjE4NiAxMDM5LjY3WiIgZmlsbD0iI0ZGOUQwMCIvPgo8cGF0aCBkPSJNNjY3LjMyMiAxMDM5LjY3Vjg2Mi42NzFINzI3LjU3OFYxMDM5LjY3TDY5Ny40NSAxMDA4Ljg5TDY2Ny4zMjIgMTAzOS42N1oiIGZpbGw9IiNGRjlEMDAiLz4KPC9zdmc+Cg==",
  dotsOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: "#6a1a4c",
      color2: "#6a1a4c",
      rotation: "0",
    },
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#6e2b0d",
  },
  cornersSquareOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: "#000000",
      color2: "#000000",
      rotation: "0",
    },
  },
  cornersDotOptions: {
    type: "",
    color: "#6e2b0d",
  },
  cornersDotOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: "#000000",
      color2: "#000000",
      rotation: "0",
    },
  },
  backgroundOptionsHelper: {
    colorType: {
      single: true,
      gradient: false,
    },
    gradient: {
      linear: true,
      radial: false,
      color1: "#ffffff",
      color2: "#ffffff",
      rotation: "0",
    },
  },
};

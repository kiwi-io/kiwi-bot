interface DAOSConfigItem {
  tokenMint: string,
  name: string,
  curveAddress: string,
  tokenVault: string,
  fundingVault: string,
  tokenProgram: string,
  fundingTokenProgram: string,
  associatedTokenProgram: string
}

export const DEFAULT_TOKENS_LIST: DAOSConfigItem[] = [
  {
    tokenMint: "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC",
    name: "ai16z",
    curveAddress: "3wY7okWt6XjGewtwCxL5eTTW8NSRgeFku5yPWMKYTbR8",
    tokenVault: "9g9P5QVhEN4eoyPN2DnXTafjgfJ7qMvc1ZPeWHXAgzmV",
    fundingVault: "3cs32MYFojY8TYoTzWQ6EEtvrzaCeg3CE7d6XWRZkT6b"
  } as DAOSConfigItem
];

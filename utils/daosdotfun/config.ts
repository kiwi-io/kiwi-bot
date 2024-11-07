interface DAOSConfigItem {
  tokenMint: string,
  depositor: string,
  name: string,
  curveAddress: string,
  tokenVault: string,
  fundingVault: string,
  tokenProgram: string,
  fundingTokenProgram: string,
  associatedTokenProgram: string
}

export const DAOS_CONFIG_ITEMS_LIST : DAOSConfigItem[] = [
  {
    tokenMint: "HeLp6NuQkmYB4pYWo2zYs22mESHXPQYzXbB8n4V98jwC",
    depositor: "AZtt8LUScEAG74iKnPNRuYgQhwmGJhAf6yUkAXjAd8sp",
    name: "ai16z",
    curveAddress: "3wY7okWt6XjGewtwCxL5eTTW8NSRgeFku5yPWMKYTbR8",
    tokenVault: "9g9P5QVhEN4eoyPN2DnXTafjgfJ7qMvc1ZPeWHXAgzmV",
    fundingVault: "3cs32MYFojY8TYoTzWQ6EEtvrzaCeg3CE7d6XWRZkT6b",
    tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    fundingTokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    associatedTokenProgram: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  } as DAOSConfigItem
];

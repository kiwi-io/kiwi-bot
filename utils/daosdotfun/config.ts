interface DAOSConfigItem {
  tokenMint: string,
  depositor: string,
  name: string,
  ticker: string,
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
    ticker: "ai16z",
    curveAddress: "3wY7okWt6XjGewtwCxL5eTTW8NSRgeFku5yPWMKYTbR8",
    tokenVault: "9g9P5QVhEN4eoyPN2DnXTafjgfJ7qMvc1ZPeWHXAgzmV",
    fundingVault: "3cs32MYFojY8TYoTzWQ6EEtvrzaCeg3CE7d6XWRZkT6b",
    tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    fundingTokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    associatedTokenProgram: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  } as DAOSConfigItem,
  {
    tokenMint: "EZDW15KWEhT5e61LSjAWSkhNKKWAuxBAHqEjw4qahmtj",
    depositor: "2v2Y9TAULhBUR1mUsupVQR2hWGTfRDNxgXdLDdh1rAfd",
    name: "LEFT",
    ticker: "LEFT",
    curveAddress: "A94zawNksiKKDfWi9Fs3EnbfM25jtbNmeZmiq3NkcwzR",
    tokenVault: "2TydNqgmSyFhME315x5z398xFD3fNwAhU9vBYpzYNaJb",
    fundingVault: "8KvbV9gkxCEBG25gAJKzvQw6usNxXRKeVEJRYqfKgwLR",
    tokenProgram: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    fundingTokenProgram: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    associatedTokenProgram: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
  } as DAOSConfigItem
];

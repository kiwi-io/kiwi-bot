import axios from "axios";

export interface JupiterQuote {
  inputMint: string;
  inAmount: number;
  outputMint: string;
  outAmount: number;
  priceImpactPct: number;
}

export interface JupiterSwapParams {
  userPublicKey: string;
  inputMint: string;
  outputMint: string;
  amountIn: number;
  slippage: number;
}

export const fetchQuote = async (
  inputMint: String,
  outputMint: String,
  amountIn: number,
  slippage: number,
): Promise<JupiterQuote | null> => {
  try {
    const response = await axios.get(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountIn}&slippage=${slippage}`,
    );

    const data = response.data;

    let result = {
      inputMint: data.inputMint,
      inAmount: parseInt(data.inAmount),
      outputMint: data.outputMint,
      outAmount: data.outAmount,
      priceImpactPct: data.priceImpactPct,
    } as JupiterQuote;

    return result;
  } catch (err) {
    console.log(`Error fetching Jupiter quote: ${err}`);
    return null;
  }
};

export const swapOnJupiterTx = async ({
  userPublicKey,
  inputMint,
  outputMint,
  amountIn,
  slippage,
}: JupiterSwapParams) => {
  try {
    const res = await axios.get(
      `https://quote-api.jup.ag/v6/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amountIn}&slippage=${slippage}&restrictIntermediateTokens=true`,
    );

    const quoteResponse = res.data;

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    let body = JSON.stringify({
      userPublicKey,
      quoteResponse,
      wrapAndUnwrapSol: true,
      dynamicComputeUnitLimit: true, // Set this to true to get the best optimized CU usage.
      dynamicSlippage: { // This will set an optimized slippage to ensure high success rate
        maxBps: 300 // Make sure to set a reasonable cap here to prevent MEV
      },
        prioritizationFeeLamports: {
        priorityLevelWithMaxLamports: {
          maxLamports: 1_000_000,
          priorityLevel: "veryHigh" // If you want to land transaction fast, set this to use `veryHigh`. You will pay on average higher priority fee.
        }
      }

    });

    const response = await axios.post(
      `https://quote-api.jup.ag/v6/swap`,
      body,
      config,
    );

    const { swapTransaction } = response.data;

    return swapTransaction;
  } catch (err) {
    console.log(`Error fetching Jupiter swap tx: ${err}`);
    return null;
  }
};

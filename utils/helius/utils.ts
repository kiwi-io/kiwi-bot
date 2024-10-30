export const getPriorityFeeEstimate = async (accountsToTrack: string[]) => {
  const response = await fetch(process.env.RPC_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "1",
      method: "getPriorityFeeEstimate",
      params: [
        {
          accountKeys: [...accountsToTrack],
          options: {
            includeAllPriorityFeeLevels: true,
          },
        },
      ],
    }),
  });
  const data = await response.json();
  return data.result;
};

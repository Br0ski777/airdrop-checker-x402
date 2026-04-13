import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "airdrop-checker",
  slug: "airdrop-checker",
  description: "Check wallet eligibility for active crypto airdrops -- token, value, deadline, claim URL via Etherscan.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/check",
      price: "$0.005",
      description: "Check wallet eligibility for crypto airdrops",
      toolName: "crypto_check_airdrops",
      toolDescription: `Use this when you need to check if a wallet address is eligible for crypto airdrops. Scans wallet interactions against known airdrop contracts and returns eligible claims.

1. eligible: array of airdrops the wallet qualifies for
2. Each airdrop contains: tokenName, tokenSymbol, estimatedValueUsd, deadline (ISO date), claimUrl, status (claimable/claimed/expired)
3. totalEligible: number of eligible airdrops found
4. totalEstimatedValue: combined estimated USD value of all eligible airdrops
5. walletAddress: the address checked
6. checkedAt: timestamp of the check

Example output: {"eligible":[{"tokenName":"LayerZero","tokenSymbol":"ZRO","estimatedValueUsd":450,"deadline":"2026-06-30T00:00:00Z","claimUrl":"https://claim.layerzero.network","status":"claimable"}],"totalEligible":3,"totalEstimatedValue":1250,"walletAddress":"0x742d...","checkedAt":"2026-04-13T12:00:00Z"}

Use this FOR discovering unclaimed airdrops, monitoring multiple wallets for eligibility, or building airdrop farming dashboards.

Do NOT use for wallet balance -- use wallet_get_portfolio. Do NOT use for token safety -- use token_check_safety. Do NOT use for NFT data -- use nft_get_collection_data.`,
      inputSchema: {
        type: "object",
        properties: {
          address: { type: "string", description: "Ethereum wallet address (0x...)" },
        },
        required: ["address"],
      },
    },
  ],
};

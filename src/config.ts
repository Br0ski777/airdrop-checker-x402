import type { ApiConfig } from "./shared";

export const API_CONFIG: ApiConfig = {
  name: "airdrop-checker",
  slug: "airdrop-checker",
  description: "Check wallet eligibility for active and upcoming crypto airdrops.",
  version: "1.0.0",
  routes: [
    {
      method: "GET",
      path: "/api/check",
      price: "$0.005",
      description: "Check wallet eligibility for crypto airdrops",
      toolName: "crypto_check_airdrops",
      toolDescription: "Use this when you need to check if a wallet address is eligible for crypto airdrops. Returns a list of eligible airdrops with token name, estimated value, deadline, and claim URL. Checks wallet interactions against known airdrop contracts via Etherscan. Do NOT use for wallet balance — use wallet_get_portfolio. Do NOT use for token safety — use token_check_safety.",
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

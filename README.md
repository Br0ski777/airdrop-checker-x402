# Airdrop Checker API

[![MCP Server](https://img.shields.io/badge/MCP-server-blue)](https://airdrop-checker.api.klymax402.com/mcp)
[![x402](https://img.shields.io/badge/payments-x402-6E56CF)](https://x402.org)
[![License: MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)

Check wallet eligibility for active crypto airdrops -- token, value, deadline, claim URL via Etherscan. Pay-per-call via [x402](https://x402.org) (USDC on Base L2) -- no API key, no signup, no rate-limit wall.

Part of the [klymax402](https://klymax402.com) marketplace -- 100 x402 micropayment APIs for AI agents, one wallet, USDC on Base.

## Quickstart -- MCP

Add to your MCP client config (Claude Desktop, Cursor, ElizaOS, etc.):

```json
{
  "mcpServers": {
    "airdrop-checker": {
      "url": "https://airdrop-checker.api.klymax402.com/mcp"
    }
  }
}
```

## Quickstart -- HTTP (x402)

```bash
curl "https://airdrop-checker.api.klymax402.com/api/check?address=0x0000000000000000000000000000000000dEaD"
# -> 402 Payment Required, with an x402 payment challenge in the response body
```

Any x402-aware client ([`@x402/fetch`](https://www.npmjs.com/package/@x402/fetch), [`x402-agent-tools`](https://www.npmjs.com/package/x402-agent-tools), ATXP) handles the 402 -> sign -> retry cycle automatically.

## Tools

| Tool | Method | Path | Price | Description |
|---|---|---|---|---|
| `crypto_check_airdrops` | GET | `/api/check` | $0.005 | Check wallet eligibility for crypto airdrops |

### `crypto_check_airdrops`

Use this when you need to check if a wallet address is eligible for crypto airdrops. Scans wallet interactions against known airdrop contracts and returns eligible claims.

**Parameters**

| Name | Type | Required | Description |
|---|---|---|---|
| `address` | string | yes | Ethereum wallet address (0x...) |

**Returns**

- `eligible` -- array of airdrops the wallet qualifies for
- `totalEligible` -- number of eligible airdrops found
- `totalEstimatedValue` -- combined estimated USD value of all eligible airdrops
- `walletAddress` -- the address checked
- `checkedAt` -- timestamp of the check

Example response:

```json
{"eligible":[{"tokenName":"LayerZero","tokenSymbol":"ZRO","estimatedValueUsd":450,"deadline":"2026-06-30T00:00:00Z","claimUrl":"https://claim.layerzero.network","status":"claimable"}],"totalEligible":3,"totalEstimatedValue":1250,"walletAddress":"0x742d...","checkedAt":"2026-04-13T12:00:00Z"}
```

**When to use**: discovering unclaimed airdrops, monitoring multiple wallets for eligibility, or building airdrop farming dashboards.

## Example agent prompts

- "Check if a wallet address is eligible for crypto airdrops"

## Payment

- Protocol: [x402](https://x402.org) -- HTTP-native pay-per-call, no signup, no API key
- Network: Base L2 (`eip155:8453`)
- Asset: USDC
- Facilitator: Coinbase CDP (primary), PayAI (fallback)

## Part of klymax402

100 x402 micropayment APIs for AI agents -- one wallet, USDC on Base, zero signup.

- Catalog: https://klymax402.com/llms.txt
- Full API reference: https://klymax402.com/llms-full.txt
- Live stats: https://klymax402.com/stats

## License

MIT

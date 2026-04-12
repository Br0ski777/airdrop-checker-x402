import type { Hono } from "hono";

interface AirdropInfo {
  name: string;
  token: string;
  protocol: string;
  estimatedValue: string;
  deadline: string | null;
  claimUrl: string | null;
  criteria: string;
  contractAddress: string;
  chain: string;
  status: "active" | "upcoming" | "ended";
}

// Major known airdrops with their qualifying contracts
const AIRDROPS: AirdropInfo[] = [
  {
    name: "LayerZero Season 2",
    token: "ZRO",
    protocol: "LayerZero",
    estimatedValue: "$200-$2000",
    deadline: "2026-06-30",
    claimUrl: "https://layerzero.network/claim",
    criteria: "Bridge transactions via LayerZero endpoints",
    contractAddress: "0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675",
    chain: "ethereum",
    status: "upcoming",
  },
  {
    name: "Scroll Marks Season 2",
    token: "SCR",
    protocol: "Scroll",
    estimatedValue: "$100-$1500",
    deadline: "2026-07-15",
    claimUrl: "https://scroll.io/airdrop",
    criteria: "Bridge to Scroll or interact with Scroll DeFi",
    contractAddress: "0xD8A791fE2bE73eb6E6cF1eb0cb3F36adC9B3F8f9",
    chain: "ethereum",
    status: "active",
  },
  {
    name: "zkSync Season 2",
    token: "ZK",
    protocol: "zkSync",
    estimatedValue: "$150-$3000",
    deadline: null,
    claimUrl: null,
    criteria: "Activity on zkSync Era (swaps, bridges, mints)",
    contractAddress: "0x32400084C286CF3E17e7B677ea9583e60a000324",
    chain: "ethereum",
    status: "upcoming",
  },
  {
    name: "EigenLayer Points",
    token: "EIGEN",
    protocol: "EigenLayer",
    estimatedValue: "$500-$5000",
    deadline: "2026-05-30",
    claimUrl: "https://app.eigenlayer.xyz/claim",
    criteria: "Restaked ETH or LSTs on EigenLayer",
    contractAddress: "0x858646372CC42E1A627fcE94aa7A7033e7CF075A",
    chain: "ethereum",
    status: "active",
  },
  {
    name: "Linea Voyage",
    token: "LINEA",
    protocol: "Linea",
    estimatedValue: "$100-$800",
    deadline: "2026-08-01",
    claimUrl: null,
    criteria: "Bridge to Linea and interact with DeFi protocols",
    contractAddress: "0xd19d4B5d358258f05D7B411E21A1460D11B0876F",
    chain: "ethereum",
    status: "upcoming",
  },
  {
    name: "Blast Season 3",
    token: "BLAST",
    protocol: "Blast",
    estimatedValue: "$50-$1000",
    deadline: "2026-06-15",
    claimUrl: "https://blast.io/airdrop",
    criteria: "Bridge ETH/USDB to Blast and use native dApps",
    contractAddress: "0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d",
    chain: "ethereum",
    status: "active",
  },
  {
    name: "Monad Testnet",
    token: "MON",
    protocol: "Monad",
    estimatedValue: "$200-$2500",
    deadline: null,
    claimUrl: null,
    criteria: "Testnet interactions and community participation",
    contractAddress: "0x0000000000000000000000000000000000000000",
    chain: "monad-testnet",
    status: "upcoming",
  },
  {
    name: "Berachain Boyco",
    token: "BERA",
    protocol: "Berachain",
    estimatedValue: "$300-$4000",
    deadline: "2026-05-15",
    claimUrl: "https://hub.berachain.com",
    criteria: "Deposit to Berachain vaults or use Boyco",
    contractAddress: "0x7507c1dc16935B82698e4C63f2746A2fCf994dF8",
    chain: "ethereum",
    status: "active",
  },
  {
    name: "Starknet DeFi Spring S2",
    token: "STRK",
    protocol: "Starknet",
    estimatedValue: "$100-$1200",
    deadline: "2026-07-01",
    claimUrl: "https://starknet.io/provisions",
    criteria: "Active DeFi usage on Starknet (swaps, LPs, lending)",
    contractAddress: "0xae0Ee0A63A2cE6BaeEFFE56e7714FB4EFE48D419",
    chain: "ethereum",
    status: "active",
  },
  {
    name: "Fuel Network",
    token: "FUEL",
    protocol: "Fuel",
    estimatedValue: "$100-$1500",
    deadline: null,
    claimUrl: null,
    criteria: "Bridge to Fuel or participate in Fuel points program",
    contractAddress: "0x6880f6Fd960D1581C2730a451A22EED1081cfD72",
    chain: "ethereum",
    status: "upcoming",
  },
  {
    name: "Hyperlane Explorer",
    token: "HYP",
    protocol: "Hyperlane",
    estimatedValue: "$50-$500",
    deadline: null,
    claimUrl: null,
    criteria: "Cross-chain message relaying via Hyperlane",
    contractAddress: "0xc005dc82818d67AF737725bD4bf75435d065D239",
    chain: "ethereum",
    status: "upcoming",
  },
  {
    name: "Ambient Finance",
    token: "AMBIENT",
    protocol: "Ambient",
    estimatedValue: "$50-$800",
    deadline: "2026-06-30",
    claimUrl: null,
    criteria: "LP or swap on Ambient DEX (Scroll, Blast, Ethereum)",
    contractAddress: "0xAaAaAAAaA24eEeb8d57D431224f73832bC34f688",
    chain: "ethereum",
    status: "active",
  },
];

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

async function checkWalletInteractions(address: string): Promise<Set<string>> {
  const interactedContracts = new Set<string>();

  try {
    // Fetch normal transactions
    const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc${ETHERSCAN_API_KEY ? `&apikey=${ETHERSCAN_API_KEY}` : ""}`;
    const resp = await fetch(url);
    if (resp.ok) {
      const data = await resp.json() as any;
      if (data.result && Array.isArray(data.result)) {
        for (const tx of data.result) {
          if (tx.to) interactedContracts.add(tx.to.toLowerCase());
        }
      }
    }
  } catch {}

  return interactedContracts;
}

export function registerRoutes(app: Hono) {
  app.get("/api/check", async (c) => {
    const address = c.req.query("address");

    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return c.json({ error: "Missing or invalid address parameter. Provide a valid Ethereum address (0x...)" }, 400);
    }

    const interacted = await checkWalletInteractions(address);

    const eligible: Array<AirdropInfo & { interacted: boolean }> = [];
    const potential: Array<AirdropInfo & { interacted: boolean }> = [];

    for (const airdrop of AIRDROPS) {
      if (airdrop.status === "ended") continue;

      const hasInteracted = interacted.has(airdrop.contractAddress.toLowerCase());

      if (hasInteracted) {
        eligible.push({ ...airdrop, interacted: true });
      } else {
        potential.push({ ...airdrop, interacted: false });
      }
    }

    return c.json({
      address,
      checkedAt: new Date().toISOString(),
      transactionsScanned: interacted.size,
      eligible: {
        count: eligible.length,
        airdrops: eligible,
      },
      potential: {
        count: potential.length,
        description: "Airdrops you haven't qualified for yet — interact with these protocols to potentially qualify",
        airdrops: potential,
      },
      totalActiveAirdrops: AIRDROPS.filter((a) => a.status !== "ended").length,
    });
  });
}

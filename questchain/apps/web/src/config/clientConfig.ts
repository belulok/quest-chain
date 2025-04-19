import { z } from "zod";

/*
 * The schema for the client-side environment variables
 * These variables should be defined in the .env file
 * These variables are NOT SECRET, they are exposed to the client side
 */

const clientConfigSchema = z.object({
  SUI_NETWORK: z.string(),
  SUI_NETWORK_NAME: z.enum(["mainnet", "testnet", "devnet"]),
  ENOKI_API_KEY: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string(),
  PACKAGE_ID: z.string().optional(),
});

const clientConfig = {
  SUI_NETWORK: process.env.NEXT_PUBLIC_SUI_NETWORK || "devnet",
  SUI_NETWORK_NAME: (process.env.NEXT_PUBLIC_SUI_NETWORK || "devnet") as "mainnet" | "testnet" | "devnet",
  ENOKI_API_KEY: process.env.NEXT_PUBLIC_ENOKI_API_KEY || "",
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_ZKLOGIN_PROVIDER_GOOGLE_CLIENT_ID || "",
  PACKAGE_ID: process.env.NEXT_PUBLIC_PACKAGE_ID || "",
};

export default clientConfig;

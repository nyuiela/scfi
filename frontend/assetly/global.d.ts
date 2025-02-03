// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ConnectKitProvider } from "@particle-network/connectkit";
declare global {
    interface Window {
      ethereum: ConnectKitOptions; // Replace `any` with a more specific type if available
    }
  }
  
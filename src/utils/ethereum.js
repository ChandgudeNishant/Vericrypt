import { ethers } from "ethers";

export const connectWallet = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      localStorage.setItem("walletAddress", accounts[0]);
      return accounts[0];
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  } else {
    console.log("Please install MetaMask");
    return null;
  }
};

export const getCurrentWalletConnected = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length > 0) {
        return accounts[0];
      } else {
        console.log("Connect to MetaMask using the Connect button");
        return "";
      }
    } catch (err) {
      console.error(err.message);
      return "";
    }
  } else {
    console.log("Please install MetaMask");
    return "";
  }
};

export const addWalletListener = (callback) => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    window.ethereum.on("accountsChanged", (accounts) => {
      callback(accounts[0]);
    });
  } else {
    callback("");
    console.log("Please install MetaMask");
  }
};

export const getProviderAndSigner = async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return { provider, signer };
  }
  return null;
};

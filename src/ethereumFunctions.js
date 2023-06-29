import { Contract, ethers } from "ethers";

export function getProvider() {
  return new ethers.BrowserProvider(window.ethereum)
}

export function getSigner(provider) {
  return provider.getSigner();
}

export async function getNetwork(provider) {
  const network = await provider.getNetwork();
  return network;
}

export async function checkNetwork(provider) {
  const chainId = getNetwork(provider);

  return chainId;
}

export async function getAccount() {
  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return accounts[0];
}

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { getProvider, getNetwork, getAccount } from "../ethereumFunctions";
import "./FetchBalance.css";

const FetchBalance = () => {
  const [account, setAccount] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [balance, setBalance] = useState("Balance");
  const [connected, setConnected] = useState(true);
  const [networkID, setNetworkID] = useState("netWorkID");
  const [networkName, setNetworkName] = useState("netWorkName");
  const connectWalletHandler = async () => {
    try {
      if (window.ethereum && window.ethereum.isMetaMask) {
        const _account = await getAccount();

        accountChangedHandler(_account);
        setConnButtonText(
          account === null
            ? "-"
            : account
            ? `${account.substring(0, 6)}...${account.substring(
                account.length - 5
              )}`
            : ""
        );
        setConnected(true);

        balanceHandler();
      } else {
        alert("metamask is not installed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const balanceHandler = async () => {
    try {
      const provider = getProvider();

      const balance = await provider.getBalance(account);

      const balanceInEth = ethers.formatEther(balance);

      setBalance(balanceInEth);
    } catch (error) {
      console.log(error);
    }
  };

  const getNetworkID = async () => {
    try {
      const provider = getProvider();
      const network = await getNetwork(provider);
      const id = network.chainId;
      const name = network.name;

      setNetworkID(id.toString());
      if (id.toString() === "2000") {
        setNetworkName("DOGECHAIN");
      }

      setNetworkName(name.toUpperCase());
    } catch (error) {
      console.log(error);
    }
  };
  const accountChangedHandler = (newAccount) => {
    setAccount(newAccount);
  };

  const chainChangedHandler = () => {
    // reload the page to avoid any errors with chain change mid use of application
    window.location.reload();
  };

  // listen for account changes
  if (window.ethereum && window.ethereum.isMetaMask) {
    window.ethereum.on("accountsChanged", accountChangedHandler);

    window.ethereum.on("chainChanged", chainChangedHandler);
  }

  useEffect(() => {
    connectWalletHandler();
    balanceHandler();
    getNetworkID();
  }, [accountChangedHandler]);

  return (
    <div>
      <header className="header">
        <div className="header-container">
          <button className="menu-btn">
            <img alt="" className="menu-btn-icon" />
          </button>
          <nav>
            <ul className="nav-links">
              <li>
                <span className="icon"> 🤖</span>
                <span
                  className="nav-link"
                  onClick={() => connectWalletHandler()}
                >
                  {connButtonText}
                </span>
              </li>
              <>
                <li>
                  <span className="nav-link">{balance}</span>
                </li>
                <li>
                  <label>Chanin ID </label>
                  <span className="nav-link">{networkID}</span>
                </li>
                <li>
                  <label>NetworkName </label>
                  <span className="nav-link">{networkName}</span>
                </li>
              </>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
};

export default FetchBalance;

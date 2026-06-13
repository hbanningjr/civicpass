import { useState } from "react";
import LandingPage from "./components/LandingPage";
import AdminPortal from "./components/AdminPortal";
import IssuerPortal from "./components/IssuerPortal";
import VerifierPortal from "./components/VerifierPortal";
import "./App.css";

function App() {
  const [role, setRole] = useState(null);
  const [account, setAccount] = useState(null);

  const connectWallet = async (selectedRole) => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      setRole(selectedRole);
    } else {
      alert("Please install MetaMask!");
    }
  };

  const handleExit = () => {
    setRole(null);
    setAccount(null);
  };

  return (
    <div className='App'>
      {!role && <LandingPage onSelectRole={connectWallet} />}
      {role === "admin" && (
        <AdminPortal account={account} onExit={handleExit} />
      )}
      {role === "issuer" && (
        <IssuerPortal account={account} onExit={handleExit} />
      )}
      {role === "verifier" && (
        <VerifierPortal account={account} onExit={handleExit} />
      )}
    </div>
  );
}

export default App;

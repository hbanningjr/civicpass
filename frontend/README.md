# 🗳️ CivicPass

### Blockchain Credential Verification Prototype

CivicPass is a privacy-preserving voter eligibility verification system built on Ethereum. Instead of relying solely on physical documents at check-in, eligible voters receive a portable digital credential tied to their MetaMask wallet. Poll workers can instantly verify eligibility without exposing personal identity data on-chain.

---

## 🏗️ Architecture

CivicPass is built across three layers:

### Smart Contracts (Solidity + Hardhat)

- **IssuerRegistry** — manages trusted issuer authorization using OpenZeppelin Ownable
- **CivicPassCredential** — handles credential lifecycle: issuance, revocation, expiration, and one-time participation tracking

### Test Suite (Hardhat + Chai)

- 10 passing tests covering issuer authorization, credential issuance, revocation, expiration, and duplicate participation prevention

### Frontend (React + ethers.js)

- **Issuer Dashboard** — issue and revoke credentials, authorize new issuers
- **Voter Dashboard** — check credential validity and status
- **Verifier Dashboard** — verify credentials and check voters in at the polling place

---

## 🚀 Deployed Contracts (Sepolia Testnet)

| Contract            | Address                                    |
| ------------------- | ------------------------------------------ |
| IssuerRegistry      | 0xb793E8e856D3a2f11de5981FfB604aD11dC7775c |
| CivicPassCredential | 0x286e62cDEE1778f663804E8DE4042b0f03482248 |

🔍 Verify on Etherscan:

- [IssuerRegistry](https://sepolia.etherscan.io/address/0xb793E8e856D3a2f11de5981FfB604aD11dC7775c)
- [CivicPassCredential](https://sepolia.etherscan.io/address/0x286e62cDEE1778f663804E8DE4042b0f03482248)

---

## 🔄 How CivicPass Works

### The Voter Journey

1. **Before Election Day** — A trusted issuer verifies the voter's eligibility off-chain and issues a digital credential to their wallet address
2. **At the Polling Place** — The voter connects their MetaMask wallet
3. **Check-In** — A poll worker (verifier) confirms the credential is valid, unexpired, not revoked, and unused
4. **Marked Used** — The credential is marked as used on-chain, preventing double voting
5. **Voter Proceeds** — The voter goes to the regular voting booth as normal

### Credential Validation Checks

- ✅ Issued by an authorized issuer
- ✅ Not revoked
- ✅ Not expired
- ✅ Not already used for this election

---

## 🛠️ Technology Stack

| Technology       | Purpose                                       |
| ---------------- | --------------------------------------------- |
| Solidity         | Smart contract development                    |
| Hardhat          | Local blockchain, testing, deployment         |
| Chai + Mocha     | Smart contract testing                        |
| OpenZeppelin     | Secure access control (Ownable)               |
| React            | Frontend application                          |
| ethers.js        | Frontend-to-blockchain communication          |
| MetaMask         | Wallet authentication and transaction signing |
| Ethereum Sepolia | Public testnet deployment                     |
| Netlify          | Frontend hosting                              |

---

## ⚙️ Local Development Setup

### Prerequisites

- Node.js v22.13+
- MetaMask browser extension
- Git

### Installation

```bash
git clone https://github.com/hbanningjr/civicpass.git
cd civicpass
npm install
cd frontend
npm install
```

### Run Locally

**Terminal 1 — Start local blockchain:**

```bash
cd civicpass
npx hardhat node
```

**Terminal 2 — Deploy contracts:**

```bash
cd civicpass
npx hardhat ignition deploy ignition/modules/CivicPass.js --network localhost
```

**Terminal 3 — Start frontend:**

```bash
cd civicpass/frontend
npm start
```

Then update `frontend/src/contracts/config.json` with the new local contract addresses and set MetaMask to `localhost:8545` Chain ID `31337`.

### Run Tests

```bash
cd civicpass
npx hardhat test
```

---

## 🔒 Security Design

- Sensitive identity data is never stored on-chain
- The blockchain acts as a tamper-resistant trust ledger only
- Issuer authorization is strictly controlled by the contract owner
- One-time participation tracking prevents double voting
- Credential revocation is available at any time by an authorized issuer

---

## 🗺️ Future Roadmap

| Feature                     | Description                                                    |
| --------------------------- | -------------------------------------------------------------- |
| QR-Based Credential Cards   | Printable credentials for users with limited smartphone access |
| Mobile Verification Units   | Portable issuer workflows for remote verification              |
| Biometric Wallet Unlocking  | Device-level fingerprint or facial authentication              |
| Additional Credential Types | Education, permits, certifications, professional licenses      |
| Multi-Jurisdiction Support  | Verification across multiple organizations or regions          |
| Advanced Privacy Features   | Zero-knowledge proof integration                               |

---

## 👨‍💻 Author

**Harv Banning**
Dapp University Blockchain Developer Bootcamp — Capstone Project
[GitHub](https://github.com/hbanningjr/civicpass)

---

_CivicPass V1 is a prototype built for educational purposes as part of a blockchain developer bootcamp capstone project._

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("CivicPassModule", (m) => {
  // Deploy IssuerRegistry first
  const issuerRegistry = m.contract("IssuerRegistry");

  // Deploy CivicPassCredential with IssuerRegistry address
  const civicPassCredential = m.contract("CivicPassCredential", [
    issuerRegistry,
  ]);

  return { issuerRegistry, civicPassCredential };
});

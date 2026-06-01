const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CivicPass", function () {
  let issuerRegistry;
  let civicPassCredential;
  let owner;
  let authorizedIssuer;
  let unauthorizedIssuer;
  let voter;

  // Run before each test - deploy fresh contracts
  beforeEach(async function () {
    [owner, authorizedIssuer, unauthorizedIssuer, voter] =
      await ethers.getSigners();

    // Deploy IssuerRegistry
    const IssuerRegistry = await ethers.getContractFactory("IssuerRegistry");
    issuerRegistry = await IssuerRegistry.deploy();

    // Deploy CivicPassCredential with IssuerRegistry address
    const CivicPassCredential = await ethers.getContractFactory(
      "CivicPassCredential",
    );
    civicPassCredential = await CivicPassCredential.deploy(
      await issuerRegistry.getAddress(),
    );

    // Authorize one issuer for testing
    await issuerRegistry.authorizeIssuer(authorizedIssuer.address);
  });

  // -------------------------
  // IssuerRegistry Tests
  // -------------------------
  describe("IssuerRegistry", function () {
    it("Should authorize an issuer", async function () {
      expect(
        await issuerRegistry.isAuthorizedIssuer(authorizedIssuer.address),
      ).to.equal(true);
    });

    it("Should reject unauthorized issuer", async function () {
      expect(
        await issuerRegistry.isAuthorizedIssuer(unauthorizedIssuer.address),
      ).to.equal(false);
    });

    it("Should revoke an issuer", async function () {
      await issuerRegistry.revokeIssuer(authorizedIssuer.address);
      expect(
        await issuerRegistry.isAuthorizedIssuer(authorizedIssuer.address),
      ).to.equal(false);
    });

    it("Should only allow owner to authorize issuers", async function () {
      await expect(
        issuerRegistry
          .connect(unauthorizedIssuer)
          .authorizeIssuer(voter.address),
      ).to.be.reverted;
    });
  });

  // -------------------------
  // CivicPassCredential Tests
  // -------------------------
  describe("CivicPassCredential", function () {
    const electionId = 1;
    const futureExpiration = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now

    it("Should issue a credential", async function () {
      await civicPassCredential
        .connect(authorizedIssuer)
        .issueCredential(voter.address, electionId, futureExpiration);
      const result = await civicPassCredential.verifyCredential(
        voter.address,
        electionId,
      );
      expect(result.exists).to.equal(true);
      expect(result.valid).to.equal(true);
    });

    it("Should reject credential from unauthorized issuer", async function () {
      await expect(
        civicPassCredential
          .connect(unauthorizedIssuer)
          .issueCredential(voter.address, electionId, futureExpiration),
      ).to.be.revertedWith("Not an authorized issuer");
    });

    it("Should revoke a credential", async function () {
      await civicPassCredential
        .connect(authorizedIssuer)
        .issueCredential(voter.address, electionId, futureExpiration);
      await civicPassCredential
        .connect(authorizedIssuer)
        .revokeCredential(voter.address, electionId);
      const result = await civicPassCredential.verifyCredential(
        voter.address,
        electionId,
      );
      expect(result.revoked).to.equal(true);
      expect(result.valid).to.equal(false);
    });

    it("Should prevent duplicate credential issuance", async function () {
      await civicPassCredential
        .connect(authorizedIssuer)
        .issueCredential(voter.address, electionId, futureExpiration);
      await expect(
        civicPassCredential
          .connect(authorizedIssuer)
          .issueCredential(voter.address, electionId, futureExpiration),
      ).to.be.revertedWith("Credential already exists");
    });

    it("Should mark credential as used", async function () {
      await civicPassCredential
        .connect(authorizedIssuer)
        .issueCredential(voter.address, electionId, futureExpiration);
      await civicPassCredential
        .connect(authorizedIssuer)
        .markCredentialUsed(voter.address, electionId);
      const result = await civicPassCredential.verifyCredential(
        voter.address,
        electionId,
      );
      expect(result.used).to.equal(true);
      expect(result.valid).to.equal(false);
    });

    it("Should prevent duplicate participation", async function () {
      await civicPassCredential
        .connect(authorizedIssuer)
        .issueCredential(voter.address, electionId, futureExpiration);
      await civicPassCredential
        .connect(authorizedIssuer)
        .markCredentialUsed(voter.address, electionId);
      await expect(
        civicPassCredential
          .connect(authorizedIssuer)
          .markCredentialUsed(voter.address, electionId),
      ).to.be.revertedWith("Credential already used");
    });
  });
});

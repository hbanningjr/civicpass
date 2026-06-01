// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IssuerRegistry.sol";

contract CivicPassCredential is Ownable {
    IssuerRegistry public issuerRegistry;

    struct Credential {
        address wallet;
        uint256 expirationDate;
        bool revoked;
        bool used;
        bool exists;
    }

    // wallet address => electionId => Credential
    mapping(address => mapping(uint256 => Credential)) private credentials;

    // Events
    event CredentialIssued(
        address indexed wallet,
        uint256 indexed electionId,
        uint256 expirationDate
    );
    event CredentialRevoked(address indexed wallet, uint256 indexed electionId);
    event CredentialUsed(address indexed wallet, uint256 indexed electionId);

    constructor(address _issuerRegistry) Ownable(msg.sender) {
        issuerRegistry = IssuerRegistry(_issuerRegistry);
    }

    // Authorized issuer issues a credential
    function issueCredential(
        address wallet,
        uint256 electionId,
        uint256 expirationDate
    ) external {
        require(
            issuerRegistry.isAuthorizedIssuer(msg.sender),
            "Not an authorized issuer"
        );
        require(wallet != address(0), "Invalid wallet address");
        require(
            !credentials[wallet][electionId].exists,
            "Credential already exists"
        );
        require(
            expirationDate > block.timestamp,
            "Expiration must be in the future"
        );

        credentials[wallet][electionId] = Credential({
            wallet: wallet,
            expirationDate: expirationDate,
            revoked: false,
            used: false,
            exists: true
        });

        emit CredentialIssued(wallet, electionId, expirationDate);
    }

    // Authorized issuer revokes a credential
    function revokeCredential(address wallet, uint256 electionId) external {
        require(
            issuerRegistry.isAuthorizedIssuer(msg.sender),
            "Not an authorized issuer"
        );
        require(
            credentials[wallet][electionId].exists,
            "Credential does not exist"
        );
        require(!credentials[wallet][electionId].revoked, "Already revoked");

        credentials[wallet][electionId].revoked = true;
        emit CredentialRevoked(wallet, electionId);
    }

    // Mark credential as used (called during verification)
    function markCredentialUsed(address wallet, uint256 electionId) external {
        require(
            issuerRegistry.isAuthorizedIssuer(msg.sender),
            "Not an authorized issuer"
        );
        require(
            credentials[wallet][electionId].exists,
            "Credential does not exist"
        );
        require(
            !credentials[wallet][electionId].revoked,
            "Credential is revoked"
        );
        require(
            !credentials[wallet][electionId].used,
            "Credential already used"
        );
        require(
            credentials[wallet][electionId].expirationDate > block.timestamp,
            "Credential expired"
        );

        credentials[wallet][electionId].used = true;
        emit CredentialUsed(wallet, electionId);
    }

    // Verify a credential - returns full status
    function verifyCredential(
        address wallet,
        uint256 electionId
    )
        external
        view
        returns (bool exists, bool valid, bool revoked, bool used, bool expired)
    {
        Credential memory cred = credentials[wallet][electionId];
        exists = cred.exists;
        revoked = cred.revoked;
        used = cred.used;
        expired = cred.exists && block.timestamp > cred.expirationDate;
        valid = exists && !revoked && !used && !expired;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract IssuerRegistry is Ownable {
    // Track which addresses are authorized issuers
    mapping(address => bool) private authorizedIssuers;

    // Events
    event IssuerAuthorized(address indexed issuer);
    event IssuerRevoked(address indexed issuer);

    constructor() Ownable(msg.sender) {}

    // Owner can authorize a new issuer
    function authorizeIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid address");
        require(!authorizedIssuers[issuer], "Already authorized");
        authorizedIssuers[issuer] = true;
        emit IssuerAuthorized(issuer);
    }

    // Owner can revoke an issuer
    function revokeIssuer(address issuer) external onlyOwner {
        require(authorizedIssuers[issuer], "Not an authorized issuer");
        authorizedIssuers[issuer] = false;
        emit IssuerRevoked(issuer);
    }

    // Check if an address is an authorized issuer
    function isAuthorizedIssuer(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer];
    }
}

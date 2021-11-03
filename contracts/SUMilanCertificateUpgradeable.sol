// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";

/// @custom:security-contact info@singularityumilan.com
contract SUMilanCertificate is Initializable, ERC721URIStorageUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    using CountersUpgradeable for CountersUpgradeable.Counter;

    CountersUpgradeable.Counter private _tokenIdCounter;

    struct EventsOwned {
        mapping (string => bool) eventIds;
    }

    mapping (address => EventsOwned) private _certificateOwners;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() initializer {}

    function initialize() initializer public {
        __ERC721_init("SUMilanCertificate", "SUM");
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function mintCertificate(address to, string memory tokenURI, string memory eventId)
        public onlyOwner
        returns (uint256)
    {
        bool hasCertificate = _certificateOwners[to].eventIds[eventId];
        require(
            hasCertificate == false,
            "This address already has a certificate for this event"
        );

        _tokenIdCounter.increment();

        uint256 newItemId = _tokenIdCounter.current();
        _mint(to, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _certificateOwners[to].eventIds[eventId] = true;

        return newItemId;
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}
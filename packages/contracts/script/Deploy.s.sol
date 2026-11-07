// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/EnergyEvidenceRegistry.sol";

contract Deploy is Script {
    function run() external {
        uint256 pk = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address admin = vm.envOr("REGISTRY_ADMIN", vm.addr(pk));

        require(block.chainid == 968, "wrong chain: expected BOT Chain testnet 968");
        require(admin != address(0), "registry admin cannot be zero");

        vm.startBroadcast(pk);
        EnergyEvidenceRegistry reg = new EnergyEvidenceRegistry(admin);
        vm.stopBroadcast();
        console2.log("EnergyEvidenceRegistry deployed at:", address(reg));
        console2.log("Registry admin:", admin);
        console2.log("BOT Chain testnet chain id:", block.chainid);
    }
}

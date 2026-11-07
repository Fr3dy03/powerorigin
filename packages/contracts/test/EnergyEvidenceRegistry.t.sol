pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import {EnergyEvidenceRegistry} from "../src/EnergyEvidenceRegistry.sol";

contract EnergyEvidenceRegistryTest is Test {
    EnergyEvidenceRegistry reg;
    address admin = address(0xA11CE);
    address operator = address(0xB0B);
    address meter = address(0xCAFE);
    address auditor = address(0xD00D);

    function setUp() public {
        vm.prank(admin);
        reg = new EnergyEvidenceRegistry(admin);
        vm.startPrank(admin);
        reg.grantRole(reg.SITE_OPERATOR_ROLE(), operator);
        reg.grantRole(reg.METER_ISSUER_ROLE(), meter);
        reg.grantRole(reg.ENERGY_AUDITOR_ROLE(), auditor);
        reg.registerSite(bytes32("site-1"), operator, "BOT-ZONE-1");
        vm.stopPrank();
    }

    function testRegisterAndAttestClaim() public {
        vm.prank(operator);
        reg.createClaim(bytes32("claim-1"), bytes32("site-1"), 1704067200, 1706745599, bytes32("m1"), bytes32("meth1"), bytes32("c1"), bytes32("e1"));
        vm.prank(auditor);
        reg.attestEnergyClaim(bytes32("claim-1"), bytes32("evidence-digest-1"));
        assertEq(uint(reg.getClaimStatus(bytes32("claim-1"))), uint(EnergyEvidenceRegistry.ClaimStatus.Attested));
    }

    function testSubmitIntervalEvidence() public {
        vm.prank(meter);
        reg.submitIntervalEvidence(bytes32("site-1"), bytes32("commitment-123"));
    }

    function testSupersedeClaim() public {
        vm.prank(operator);
        reg.createClaim(bytes32("claim-1"), bytes32("site-1"), 1704067200, 1706745599, bytes32("m1"), bytes32("meth1"), bytes32("c1"), bytes32("e1"));
        vm.prank(operator);
        reg.createClaim(bytes32("claim-2"), bytes32("site-1"), 1704067200, 1706745599, bytes32("m2"), bytes32("meth2"), bytes32("c2"), bytes32("e2"));
        vm.prank(operator);
        reg.supersedeClaim(bytes32("claim-1"), bytes32("claim-2"));
        assertEq(uint(reg.getClaimStatus(bytes32("claim-1"))), uint(EnergyEvidenceRegistry.ClaimStatus.Superseded));
    }
}

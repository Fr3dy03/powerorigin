pragma solidity ^0.8.20;

/**
 * @title EnergyEvidenceRegistry
 * @notice Evidence lifecycle for PowerOrigin energy provenance
 */
contract EnergyEvidenceRegistry {
    bytes32 public constant DEFAULT_ADMIN_ROLE = bytes32(0);
    bytes32 public constant SITE_OPERATOR_ROLE = keccak256("SITE_OPERATOR_ROLE");
    bytes32 public constant METER_ISSUER_ROLE = keccak256("METER_ISSUER_ROLE");
    bytes32 public constant ENERGY_AUDITOR_ROLE = keccak256("ENERGY_AUDITOR_ROLE");
    bytes32 public constant CERTIFICATE_ISSUER_ROLE = keccak256("CERTIFICATE_ISSUER_ROLE");

    struct EnergySite {
        bytes32 siteId;
        address operator;
        string gridZone;
        bool active;
    }

    enum ClaimStatus {
        Submitted,
        Attested,
        Rejected,
        Revoked,
        Superseded
    }

    struct EnergyClaim {
        bytes32 claimId;
        bytes32 siteId;
        uint64 reportingStart;
        uint64 reportingEnd;
        bytes32 meterCommitment;
        bytes32 methodologyHash;
        bytes32 certificateCommitment;
        address issuer;
        bytes32 evidenceDigest;
        ClaimStatus status;
    }

    mapping(bytes32 => EnergySite) public sites;
    mapping(bytes32 => EnergyClaim) public claims;
    mapping(address => mapping(bytes32 => bool)) private _roles;
    mapping(bytes32 => bytes32[]) private _claimRevisions;

    event SiteRegistered(bytes32 indexed siteId, address indexed operator, string gridZone);
    event MeterIssuerRegistered(address indexed issuer);
    event IntervalEvidenceSubmitted(bytes32 indexed siteId, bytes32 indexed commitmentHash, address indexed issuer);
    event EnergyClaimAttested(bytes32 indexed claimId, address indexed auditor, bytes32 evidenceDigest);
    event IntervalSuperseded(bytes32 indexed siteId, bytes32 indexed oldCommitment, bytes32 indexed newCommitment);
    event ClaimRevoked(bytes32 indexed claimId, address indexed revoker);
    event ClaimSuperseded(bytes32 indexed oldClaimId, bytes32 indexed newClaimId);

    constructor(address admin) {
        _roles[admin][DEFAULT_ADMIN_ROLE] = true;
    }

    modifier onlyRole(bytes32 role) {
        require(_roles[msg.sender][role] || _roles[msg.sender][DEFAULT_ADMIN_ROLE], "missing role");
        _;
    }

    function hasRole(bytes32 role, address account) public view returns (bool) {
        return _roles[account][role] || _roles[account][DEFAULT_ADMIN_ROLE];
    }

    function grantRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _roles[account][role] = true;
    }

    function revokeRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _roles[account][role] = false;
    }

    function registerSite(bytes32 siteId, address operator, string calldata gridZone) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(sites[siteId].siteId == bytes32(0), "site exists");
        sites[siteId] = EnergySite({siteId: siteId, operator: operator, gridZone: gridZone, active: true});
        emit SiteRegistered(siteId, operator, gridZone);
    }

    function registerMeterIssuer(address issuer) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _roles[issuer][METER_ISSUER_ROLE] = true;
        emit MeterIssuerRegistered(issuer);
    }

    function verifyIssuer(address issuer) external view returns (bool) {
        return _roles[issuer][METER_ISSUER_ROLE] || _roles[issuer][CERTIFICATE_ISSUER_ROLE];
    }

    function submitIntervalEvidence(bytes32 siteId, bytes32 commitmentHash) external onlyRole(METER_ISSUER_ROLE) {
        require(sites[siteId].active, "site not active");
        emit IntervalEvidenceSubmitted(siteId, commitmentHash, msg.sender);
    }

    function attestEnergyClaim(bytes32 claimId, bytes32 evidenceDigest) external onlyRole(ENERGY_AUDITOR_ROLE) {
        require(claims[claimId].claimId == claimId, "claim not found");
        require(claims[claimId].status == ClaimStatus.Submitted, "invalid status");
        claims[claimId].status = ClaimStatus.Attested;
        claims[claimId].evidenceDigest = evidenceDigest;
        emit EnergyClaimAttested(claimId, msg.sender, evidenceDigest);
    }

    function supersedeInterval(bytes32 siteId, bytes32 oldCommitment, bytes32 newCommitment) external onlyRole(METER_ISSUER_ROLE) {
        require(sites[siteId].active, "site not active");
        emit IntervalSuperseded(siteId, oldCommitment, newCommitment);
    }

    function revokeClaim(bytes32 claimId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(claims[claimId].claimId == claimId, "claim not found");
        claims[claimId].status = ClaimStatus.Revoked;
        emit ClaimRevoked(claimId, msg.sender);
    }

    function createClaim(
        bytes32 claimId,
        bytes32 siteId,
        uint64 reportingStart,
        uint64 reportingEnd,
        bytes32 meterCommitment,
        bytes32 methodologyHash,
        bytes32 certificateCommitment,
        bytes32 evidenceDigest
    ) external onlyRole(SITE_OPERATOR_ROLE) {
        require(claims[claimId].claimId != claimId, "claim exists");
        require(sites[siteId].active, "site not active");
        claims[claimId] = EnergyClaim({
            claimId: claimId,
            siteId: siteId,
            reportingStart: reportingStart,
            reportingEnd: reportingEnd,
            meterCommitment: meterCommitment,
            methodologyHash: methodologyHash,
            certificateCommitment: certificateCommitment,
            issuer: msg.sender,
            evidenceDigest: evidenceDigest,
            status: ClaimStatus.Submitted
        });
    }

    function supersedeClaim(bytes32 oldClaimId, bytes32 newClaimId) external onlyRole(SITE_OPERATOR_ROLE) {
        require(claims[oldClaimId].claimId == oldClaimId, "old claim not found");
        require(claims[newClaimId].claimId == newClaimId, "new claim not found");
        claims[oldClaimId].status = ClaimStatus.Superseded;
        _claimRevisions[oldClaimId].push(newClaimId);
        emit ClaimSuperseded(oldClaimId, newClaimId);
    }

    function getClaim(bytes32 claimId) external view returns (EnergyClaim memory) {
        return claims[claimId];
    }

    function getClaimStatus(bytes32 claimId) external view returns (ClaimStatus) {
        return claims[claimId].status;
    }

    function getClaimRevisions(bytes32 claimId) external view returns (bytes32[] memory) {
        return _claimRevisions[claimId];
    }
}

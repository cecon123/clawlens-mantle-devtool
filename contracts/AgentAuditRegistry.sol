// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AgentAuditRegistry {
    struct AuditRecord {
        bytes32 packetHash;
        string agentLabel;
        uint8 riskScore;
        string packetURI;
        address reporter;
        uint256 createdAt;
    }

    AuditRecord[] private records;

    event AuditRecorded(
        uint256 indexed recordId,
        bytes32 indexed packetHash,
        string agentLabel,
        uint8 riskScore,
        string packetURI,
        address indexed reporter
    );

    function recordAudit(
        bytes32 packetHash,
        string calldata agentLabel,
        uint8 riskScore,
        string calldata packetURI
    ) external returns (uint256 recordId) {
        require(packetHash != bytes32(0), "packet hash required");
        require(bytes(agentLabel).length > 0, "agent label required");
        require(riskScore <= 100, "risk score too high");

        recordId = records.length;
        records.push(
            AuditRecord({
                packetHash: packetHash,
                agentLabel: agentLabel,
                riskScore: riskScore,
                packetURI: packetURI,
                reporter: msg.sender,
                createdAt: block.timestamp
            })
        );

        emit AuditRecorded(recordId, packetHash, agentLabel, riskScore, packetURI, msg.sender);
    }

    function recordCount() external view returns (uint256) {
        return records.length;
    }

    function getRecord(uint256 recordId) external view returns (AuditRecord memory) {
        require(recordId < records.length, "record missing");
        return records[recordId];
    }
}

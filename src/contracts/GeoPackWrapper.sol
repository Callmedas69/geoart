// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract GeoPackWrapper {
    address public vibeProxy;
    address public treasury;
    uint256 public fee;
    address public owner;

    event FeeCollected(address indexed user, uint256 amount);
    event ConfigUpdated(address vibeProxy, address treasury, uint256 fee);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    error ZeroAddress();
    error InsufficientFee();
    error DeploymentFailed();
    error TransferFailed();

    constructor(address _vibeProxy, address _treasury, uint256 _fee) {
        if (_vibeProxy == address(0) || _treasury == address(0)) revert ZeroAddress();

        vibeProxy = _vibeProxy;
        treasury = _treasury;
        fee = _fee;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    function deploy(bytes calldata data) external payable returns (bytes memory) {
        uint256 currentFee = fee;  // Gas optimization: single storage read
        if (msg.value < currentFee) revert InsufficientFee();

        // Collect fee using call instead of transfer
        address currentTreasury = treasury;  // Gas optimization
        (bool feeSuccess,) = currentTreasury.call{value: currentFee}("");
        if (!feeSuccess) revert TransferFailed();

        emit FeeCollected(msg.sender, currentFee);

        // Forward call
        (bool success, bytes memory result) = vibeProxy.call{value: msg.value - currentFee}(data);
        if (!success) revert DeploymentFailed();

        return result;
    }

    function updateConfig(address _vibeProxy, address _treasury, uint256 _fee) external onlyOwner {
        if (_vibeProxy == address(0) || _treasury == address(0)) revert ZeroAddress();

        vibeProxy = _vibeProxy;
        treasury = _treasury;
        fee = _fee;
        emit ConfigUpdated(_vibeProxy, _treasury, _fee);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddress();

        address previousOwner = owner;
        owner = newOwner;
        emit OwnershipTransferred(previousOwner, newOwner);
    }
}
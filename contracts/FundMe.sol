// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./PriceConverter.sol";


error FundMe_NotOwner();

/**
 * @title
 * @author
 * @notice
 * @dev
 */
contract FundMe {
    using PriceConverter for uint256;

    // AggregatorV3Interface internal dataFeed;

    uint256 public constant MIN_USD = 50 * 1e18;

    address[] private s_funders;

    mapping(address => uint256) private s_addressToAmountFunded;

    address private immutable i_owner;

    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        // require(msg.sender == i_owner, "Sender is not owner!");
        if (msg.sender != i_owner) {
            revert FundMe_NotOwner();
        }
        _;
    }

    constructor(address priceFeedAddress) {
        i_owner = msg.sender;
        
        // sepolia eth/usd 0x694AA1769357215DE4FAC081bf1f309aDC325306
        s_priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    // receive() external payable {
    //     fund();
    // }

    // fallback() external payable {
    //     fund();
    // }

    /**
     * @notice
     * @dev
     */
    function fund() public payable {
        require(
            msg.value.getConversionRate(s_priceFeed) >= MIN_USD,
            "You need to send more ETH!"
        );
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
        for (uint256 index = 0; index < s_funders.length; index++) {
            address addr = s_funders[index];
            s_addressToAmountFunded[addr] = 0;
        }
        s_funders = new address[](0);

        // // transfer的方式发送以太币，失败会回滚
        // payable (msg.sender).transfer(address(this).balance);
        // // send的方式发送以太币，失败不会回滚，有一个bool类型的返回值
        // bool result = payable (msg.sender).send(address(this).balance);
        // require(result, "Send failed!");
        // // payable (msg.sender).call(address(this).balance);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed!");
    }

    function cheaperWithdraw() public onlyOwner {
        address[] memory funders = s_funders;
        uint256 length = funders.length;
        for (uint256 index = 0; index < length; index++) {
            address addr = funders[index];
            s_addressToAmountFunded[addr] = 0;
        }
        s_funders = new address[](0);
        (bool callSuccess, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(callSuccess, "Call failed!");
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getOwner() public view returns (address) {
        return i_owner;
    }

    function getAddressToAmountFunded(
        address addr
    ) public view returns (uint256) {
        return s_addressToAmountFunded[addr];
    }
}

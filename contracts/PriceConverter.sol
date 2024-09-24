// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        (
            ,
            /* uint80 roundID */ int256 answer /*uint startedAt*/ /*uint timeStamp*/ /*uint80 answeredInRound*/,
            ,
            ,

        ) = priceFeed.latestRoundData();
        // answer是1e8,msg.value是1e18;
        return uint256(answer * 1e10);
    }

    function getConversionRate(
        uint256 etherAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        return (etherAmount * getPrice(priceFeed)) / 1e18;
    }
}

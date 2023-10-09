const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {

    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Bonjour, le monde!");
    await greeter.deployed();
    expect(await greeter.greet()).to.equal("Bonjour, le monde!");
    const setGreetingTx = await greeter.setGreeting("Salut, tout le monde!"); 

    // Wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Salut, tout le monde!");
  });
});

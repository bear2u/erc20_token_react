var CustomToken = artifacts.require("./CustomToken.sol");

contract("CustomToken", function(accounts) {
  const symbol = "TOMMY";
  const name = "TommyToken";
  const decimals = 2;
  const totalSupply = 1000;

  let customTokenInstance;

  beforeEach(async () => {
    customTokenInstance = await CustomToken.deployed();

    await customTokenInstance.generate(symbol, name, decimals, totalSupply, {
      from: accounts[0]
    });
  });

  it("...it should generate token by given parameters", async () => {
    const tokenName = await customTokenInstance._name();
    const tokenSymbol = await customTokenInstance._symbol();
    const tokenDecimals = await customTokenInstance._decimals();

    const tokenDecimalsNumber = parseInt(tokenDecimals.toNumber());

    assert.deepEqual(
      [tokenName, tokenSymbol, tokenDecimalsNumber],
      [name, symbol, decimals],
      "compare two array values"
    );
  });

  it("...it should test balance by specific member", async () => {
    const owner = accounts[0];

    const balance = await customTokenInstance.balanceOf(owner);

    assert.equal(balance, totalSupply, "init balance is totalSupply");
  });

  it("...it should test balance when owner transfer some money", async () => {
    const owner = accounts[0];
    const receiver = accounts[1];
    const transferAmount = 100;

    //receiver 에게 전송
    const transferResult = await customTokenInstance.transfer(
      receiver,
      transferAmount,
      { from: accounts[0] }
    );

    const balance = await customTokenInstance.balanceOf(owner);

    assert.equal(
      balance,
      totalSupply - transferAmount,
      "check balance after transfer amount"
    );
    //이벤트 발생 여부 체크
    assert.equal(transferResult.logs[0].event, "Transfer", "check event call");
  });

  it("...it should test to trasnferFrom with approve " , async () => {
    const sender = accounts[0];
    const receiver = accounts[1];
    const transferAmount = 100;

    await customTokenInstance.approve(receiver, transferAmount);

    const remaining = await customTokenInstance.allowance(sender, receiver);

    assert.equal(remaining.toNumber(), transferAmount);

    const transferResult = await customTokenInstance.transferFrom(
        sender,
        receiver,
        transferAmount,
        { from: accounts[0] }
      );

    const balance = await customTokenInstance.balanceOf(sender);

    assert.equal(balance.toNumber(), totalSupply - transferAmount);
    assert.equal(transferResult.logs[0].event, "Transfer", "check event call");

  });

});

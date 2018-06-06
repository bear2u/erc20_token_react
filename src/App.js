import React, { Component } from "react";
import CustomTokenContract from "../build/contracts/CustomToken.json";
import getWeb3 from "./utils/getWeb3";
import { Label, Button, Checkbox, Form } from "semantic-ui-react";

const contract = require("truffle-contract");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      isAttached: false,
      account: "",
      balance: 0,

      tokenSymbol: "",
      tokenName: "",
      tokenDecimals: 0,
      tokenTotalSupply: 0
    };

    this.handleEvent = this.handleEvent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    // const React = require('react');

    // //It should be 16.3.2
    // console.log(React.version);

    const result = await getWeb3;
    this.setState({
      web3: result.web3
    });

    const accounts = await this.state.web3.eth.getAccounts();
    console.log(accounts);

    this.setState({
      account: accounts[0]
    });

    await this.instantiateContract();
  }

  //https://goo.gl/QH3EX8
  async instantiateContract() {
    const customToken = contract(CustomTokenContract);
    customToken.setProvider(this.state.web3.currentProvider);

    try {
      const tokenContract = await customToken.deployed();
      this.customTokenInstance = tokenContract;
      const balance = await this.customTokenInstance.balanceOf(
        this.state.account
      );

      console.dir(this.customTokenInstance);
      this.address = this.customTokenInstance.address;

      this.setState({
        balance: balance.toNumber()
      });

      if (tokenContract != null) {
        this.setState({
          isAttached: true
        });
      }

      console.log(tokenContract);
    } catch (e) {
      alert("계약 배포가 안되어있음 , 서버가 다를수 있음");
    }
  }

  handleEvent(e) {
    const name = e.target.name;

    console.log(e.target.value);
    this.setState({
      [name]: e.target.value
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    const tokenSymbol = this.state.tokenSymbol;
    const tokenName = this.state.tokenName;
    const tokenDecimals = this.state.tokenDecimals;
    const tokenTotalSupply = this.state.tokenTotalSupply;
    console.log(tokenSymbol, tokenName, tokenDecimals, tokenTotalSupply);

    await this.customTokenInstance.generate(
      tokenSymbol,
      tokenName,
      tokenDecimals,
      tokenTotalSupply,
      {
        from: this.state.account
      }
    );

    const balance = await this.customTokenInstance.balanceOf(
      this.state.account
    );

    this.setState({
      balance
    })
  }

  render() {
    return (
      <div>
        배포상태 : {this.state.isAttached ? "ok" : "not connected"} <br />
        <Label>계정 주소</Label> {this.state.account} <br />
        <Label>토큰 잔액 조회</Label> {this.state.balance} <br />
        <Label>토큰 주소</Label> {this.address} <br />
        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>심볼</label>
            <input
              placeholder="eg)txt"
              name="tokenSymbol"
              onChange={this.handleEvent}
              value={this.state.tokenSymbol}
            />
          </Form.Field>
          <Form.Field>
            <label>토큰이름</label>
            <input
              placeholder="eg)text"
              name="tokenName"
              onChange={this.handleEvent}
              value={this.state.tokenName}
            />
          </Form.Field>
          <Form.Field>
            <label>decimal</label>
            <input
              placeholder="2"
              name="tokenDecimals"
              onChange={this.handleEvent}
              value={this.state.tokenDecimals}
            />
          </Form.Field>
          <Form.Field>
            <label>총수량</label>
            <input
              placeholder="10000"
              name="tokenTotalSupply"
              onChange={this.handleEvent}
              value={this.state.tokenTotalSupply}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

export default App;

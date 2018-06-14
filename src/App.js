import React, { Component } from "react";
import CustomTokenContract from "../build/contracts/CustomToken.json";
import getWeb3 from "./utils/getWeb3";
import { Label, Button, Checkbox, Form } from "semantic-ui-react";
import CLabel from "./components/CLabel";

const contract = require("truffle-contract");

class App extends Component {
  state = {
    storageValue: 0,
    web3: null,
    isAttached: false,
    account: "",
    balance: 0,

    tokenSymbol: "",
    tokenName: "",
    tokenDecimals: 0,
    tokenTotalSupply: 0,

    sendFormRsvAddr: "",
    sendFormRsvPrice: 0
  };

  constructor(props) {
    super(props);

    this.handleEvent = this.handleEvent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitSendForm = this.handleSubmitSendForm.bind(this);
    this.handleSubmitApproveForm = this.handleSubmitApproveForm.bind(this);
    this.handleSubmitallowanceForm = this.handleSubmitallowanceForm.bind(this);
    this.handleSubmitTransferForm = this.handleSubmitTransferForm.bind(this);
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

    console.log(name, e.target.value);
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
    });
  }

  async handleSubmitSendForm(e) {
    e.preventDefault();

    // const tokenSymbol = this.state.tokenSymbol

    //Address, Price 획득
    const resvAddress = this.state.sendFormRsvAddr;
    const resvPrice = this.state.sendFormRsvPrice;

    console.log(this.state.account, "resvAddress", resvPrice);

    await this.customTokenInstance.transfer(resvAddress, resvPrice, {
      from: this.state.account
    });

    console.log("submit sendForm ok");
  }

  async handleSubmitallowanceForm(e) {
    e.preventDefault();

    const sender = this.state.allowanceFormSendAddr;
    const receiver = this.state.allowanceFormResvAddr;

    const balance = await this.customTokenInstance.allowance(sender, receiver, {
      from: this.state.account
    });

    alert(balance);
  }

  async handleSubmitApproveForm(e) {
    e.preventDefault();

    const spender = this.state.approveFormSendAddr;
    const price = this.state.approveFormSendPrice;

    await this.customTokenInstance.approve(spender, price, {
      from: this.state.account
    });

    alert("approve done");
  }

  async handleSubmitTransferForm(e) {
    e.preventDefault();

    const sender = this.state.transferFormSendAddr;
    const receiver = this.state.transferFormResvAddr;
    const price = this.state.transferFormResvPrice;

    await this.customTokenInstance.transferFrom(sender, receiver, price, {
      from: this.state.account
    });

    alert("transfer done");
  }

  render() {
    return (
      <div>
        배포상태 : {this.state.isAttached ? "ok" : "not connected"} <br />
        <CLabel title={"계정 주소"} value={this.state.account} />
        <CLabel title={"토큰 잔액 조회"} value={this.state.balance} />
        <CLabel title={"토큰 주소"} value={this.address} />
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
        <h1>전송 폼</h1>
        <Form onSubmit={this.handleSubmitSendForm}>
          <Form.Field>
            <label>받는 사람 주소</label>
            <input
              placeholder="0x0000000...."
              name="sendFormRsvAddr"
              onChange={this.handleEvent}
              value={this.state.sendFormRsvAddr}
            />
          </Form.Field>
          <Form.Field>
            <label>금액</label>
            <input
              placeholder="숫자만 입력해주세요"
              name="sendFormRsvPrice"
              onChange={this.handleEvent}
              value={this.state.sendFormRsvPrice}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
        <h1>승인 폼</h1>
        <Form onSubmit={this.handleSubmitApproveForm}>
          <Form.Field>
            <label>보내는 사람</label>
            <input
              placeholder="0x0000000...."
              name="approveFormSendAddr"
              onChange={this.handleEvent}
              value={this.state.approveFormSendAddr}
            />
          </Form.Field>
          <Form.Field>
            <label>금액</label>
            <input
              placeholder="숫자만 입력해주세요"
              name="approveFormSendPrice"
              onChange={this.handleEvent}
              value={this.state.approveFormSendPrice}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>

        
        <h1>승인 조회 폼</h1>
        <Form onSubmit={this.handleSubmitallowanceForm}>
          <Form.Field>
            <label>보내는 사람</label>
            <input
              placeholder="0x0000000...."
              name="allowanceFormSendAddr"
              onChange={this.handleEvent}
              value={this.state.allowanceFormSendAddr}
            />
          </Form.Field>
          <Form.Field>
            <label>받는 사람</label>
            <input
              placeholder="0x0000000...."
              name="allowanceFormResvAddr"
              onChange={this.handleEvent}
              value={this.state.allowanceFormResvAddr}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>


        <h1>전송 폼2</h1>
        <Form onSubmit={this.handleSubmitTransferForm}>
          <Form.Field>
            <label>보내는 사람</label>
            <input
              placeholder="0x0000000...."
              name="transferFormSendAddr"
              onChange={this.handleEvent}
              value={this.state.transferFormSendAddr}
            />
          </Form.Field>
          <Form.Field>
            <label>받는 사람</label>
            <input
              placeholder="0x0000000...."
              name="transferFormResvAddr"
              onChange={this.handleEvent}
              value={this.state.transferFormResvAddr}
            />
          </Form.Field>
          <Form.Field>
            <label>금액</label>
            <input
              placeholder="숫자만 입력해주세요"
              name="transferFormResvPrice"
              onChange={this.handleEvent}
              value={this.state.transferFormResvPrice}
            />
          </Form.Field>
          <Button type="submit">Submit</Button>
        </Form>
      </div>
    );
  }
}

export default App;

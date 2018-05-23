import React, { Component } from "react";
import CustomTokenContract from "../build/contracts/CustomToken.json";
import getWeb3 from "./utils/getWeb3";

const contract = require('truffle-contract');

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0,
      web3: null,
      isAttached : false
    };
  }

  async componentWillMount() {

    // const React = require('react');

    // //It should be 16.3.2
    // console.log(React.version);

    const result = await getWeb3;
    this.setState({
      web3: result.web3
    });

    const accounts = await this.state.web3.eth.getAccounts();
    
    await this.instantiateContract();
  }

  async instantiateContract() {    
    const customToken = contract(CustomTokenContract);
    customToken.setProvider(this.state.web3.currentProvider);

    try{
      const tokenContract = await customToken.deployed();

      if(tokenContract != null) {      
        this.setState({
          isAttached : true
        })
      }

      console.log(tokenContract);

    } catch( e ) {
      alert('계약 배포가 안되어있음 , 서버가 다를수 있음');
    }

    
  }

  render() {
    return (
      <div>
        배포상태 : { this.state.isAttached ? "ok" : "not connected" }
      </div>
    )
  }
}

export default App;

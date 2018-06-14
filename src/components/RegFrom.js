import React, { Component } from "react";

class RegForm extends Component {
    render() {
        return (
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
        )
    }
}

export default RegForm
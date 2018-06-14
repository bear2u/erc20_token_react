import React, { Component } from "react";
import { Label } from "semantic-ui-react";

class CLabel extends Component {
    render(){
        return (
            <div>
                <Label>{this.props.title}</Label> {this.props.value}
            </div>    
        )
    }
}

export default CLabel;
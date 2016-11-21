import React, { Component } from 'react'
import { browserHistory } from 'react-router'

import Banner from '../components/Banner.jsx'
import Content from '../components/Content.jsx'

import {
    TextField,
    RaisedButton,
} from 'material-ui'

import firebase from '../db/firebase.js'

class Login extends Component {
    constructor(props){
        super(props)

        this.state = {
            errorMsg: ""
        }
    }
    componentWillMount(){
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                browserHistory.push('/')
            }
        })   
    }
    submit = () => {
        let e = this.email.input.value
        let p = this.password.input.value
        if(!e || !p){
            this.setState({errorMsg:"Please input email and password"})
            return
        }
        firebase.auth().signInWithEmailAndPassword(e, p).catch( error => {
            var errorMessage = error.message;
            this.setState({errorMsg:errorMessage})
        });
    }
    render() {
        return (
            <div>
                <Banner title="Login"/>
                <Content>
                    Login as BRL-CAD member<br/><br/>
                    { this.state.errorMsg ? <b style={{color:"red"}}>{this.state.errorMsg}<br/></b> : ""}
                    <TextField ref={c=>this.email=c} id="email" placeholder="Email" /><br/>
                    <TextField ref={c=>this.password=c} type="password" id="password" placeholder="Password"/><br/>
                    <RaisedButton primary={true} label="Login" onClick={this.submit} />
                </Content>
            </div>
        )
    }
}

export default Login
import React from 'react';
import {Link} from 'react-router-dom';
import {Meteor} from 'meteor/meteor';
import {createContainer} from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import {History} from '/imports/routes/routes';
import {Session} from 'meteor/session';

let global_token;

Accounts.onResetPasswordLink((token,done)=>{
  if (token) {
    global_token=token;
  }
});

export class Login extends React.Component {
  constructor(props){
    super(props);
    this.state={
      error: ''
    };
  }
  //onEnter is replaced by this method in react v4
  componentWillMount(){
    if (Meteor.userId())
    {
      History.replace('/dashboard');
    }
    if (global_token) {
      Session.set('global_token',global_token);
      global_token=undefined;
      History.replace('/resetpassword');
    }
  }
  formsubmit(e)
  {
    e.preventDefault();
    let email=this.refs.email.value.trim();
    let password=this.refs.password.value.trim();
    this.props.loginWithPassword({email},password,(err)=>{
      if (err) {
        this.setState({
          error:'Unable to login. Check email and password.'
        });
      }
      else {
        this.setState({
          error:''
        });
      }
    });
  }
  render(){
    return (
      <div className="boxed-view">
        <div className="boxed-view__box">
          <h1>Login</h1>
          {this.state.error ? <p>{this.state.error}</p> : undefined}
          <form onSubmit={this.formsubmit.bind(this)} noValidate className="boxed-view__form">
            <input type="email" ref="email" name="email" placeholder="Email"/>
            <input type="password" ref="password" name="password" placeholder="Password"/>
            <button type="Submit" className="button button--space">Login</button>
          </form>
          <Link to="/signup">Need an account?</Link><br/>
          <Link to="/forgotpassword" className="a--bottom">Forgot password?</Link>
        </div>
      </div>
    );
  }
}
Login.propTypes={
  loginWithPassword:PropTypes.func.isRequired
};

export default createContainer(()=>{
  return {
    loginWithPassword:Meteor.loginWithPassword
  };
},Login);

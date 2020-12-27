import React, { Component } from 'react';
import zxcvbn from 'zxcvbn';
import useForm from "react-hook-form";


const userInputsDom = {
  fname: document.getElementById('fname'),
  lname: document.getElementById('lname'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
};

class App extends Component {

  state = {
    fname: '',
    lname: '',
    email: '',
    password: ''
  }

  handlePasswordChange = (e) => {
    this.setState({ password: e.target.value });

    const strength = {
      0: "Worst",
      1: "Bad",
      2: "Weak",
      3: "Good",
      4: "Strong"
    };

    const meter = document.getElementById('password-strength-meter');
    const text = document.getElementById('password-strength-text');

    let val = this.state.password;
    let result = zxcvbn(val);

    // Update the password strength meter
    meter.value = result.score;

    // Update the text indicator
    if (val !== "") {
      text.innerHTML = "Strength: " + strength[result.score]; 
    } else {
      text.innerHTML = "";
    }
  };
  
  render () {
    return (
      <form action="">
        <label htmlFor="fname">First name:</label>
        <input 
          type="text" 
          id="fname" 
          name="fname" />
  
        <label htmlFor="lname">Last name:</label>
        <input 
          type="text" 
          id="lname" 
          name="lname" />
  
        <label htmlFor="email">Email:</label>
        <input 
          type="text" 
          id="email" 
          name="email" />
  
        <label htmlFor="password">Enter password</label>
        <input 
          type="password" 
          id="password"
          value={ this.state.password }
          onChange={ this.handlePasswordChange } 
          required />

        <meter 
          max="4" 
          id="password-strength-meter"></meter>

        <p id="password-strength-text"></p>
        <p id="showPw">Show password</p>
      </form>
    );
  }
  
}

export default App;

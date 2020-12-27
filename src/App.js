import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import zxcvbn from 'zxcvbn';


function App() {
  const [ password, setPassword ] = useState(''); 
  const { register, handleSubmit, errors } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  }

  const userInputsDom = {
    fname: document.getElementById('fname'),
    lname: document.getElementById('lname'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
  };

  const strength = {
    0: "Worst",
    1: "Bad",
    2: "Weak",
    3: "Good",
    4: "Strong"
  };

  const showPassword = document.getElementById('showPw');
  const meter = document.getElementById('password-strength-meter');
  const text = document.getElementById('password-strength-text');


  // handle password state change and zxcvbn validation
  const handlePasswordChange = (e) => {
    // set state
    setPassword(e.target.value);

    let val = password;
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


  // handle toggle mask/unmask pw
  const handleTogglePasswordMask = () => {
    console.log('clicked')
    if (userInputsDom.password.getAttribute('type') === 'password'){
      userInputsDom.password.setAttribute('type', 'text');
    } else {
      userInputsDom.password.setAttribute('type', 'password');
    }
  };
  

  return (
    <form action="" onSubmit={ handleSubmit(onSubmit) }>
      {/* first name */}
      <label htmlFor="fname">First name:</label>
      <input 
        type="text" 
        id="fname" 
        name="fname" 
        ref={ register({ required: true }) } />
        { errors.fname && <p>必須項目です。</p> }


      {/* last name */}
      <label htmlFor="lname">Last name:</label>
      <input 
        type="text" 
        id="lname" 
        name="lname" 
        ref={ register({ required: true }) } />
      { errors.fname && <p>必須項目です。</p> }


      {/* email */}
      <label htmlFor="email">Email:</label>
      <input 
        type="text" 
        id="email" 
        name="email" 
        ref={ register({ 
          required: true,
          pattern: {　value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,}
        }) 
      } />
      { errors.email && errors.email.type === "required" && <p>必須項目です。</p> }
      { errors.email && errors.email.type === "pattern" && <p>メールアドレスの形式が正しくありません。</p> }


      {/* password */}
      <label htmlFor="password">Enter password</label>
      <input 
        type="password" 
        id="password"
        name="password"
        value={ password }
        onChange={ handlePasswordChange } 
        ref={ register({ required: true }) } />
        { errors.password && <p>必須項目です。</p> }

      <meter 
        max="4" 
        id="password-strength-meter"></meter>
      <p id="password-strength-text"></p>

      <p 
        id="showPw"
        onClick={ handleTogglePasswordMask } >Show password</p>

      {/* submit */}
      <input type="submit" />
    </form>
  );
  
}

export default App;

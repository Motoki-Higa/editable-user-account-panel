import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import zxcvbn from 'zxcvbn';


function App() {
  // state
  const [ fname, setFname ] = useState('');
  const [ lname, setLname ] = useState('');
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  // hook useForm & submit
  const { register, handleSubmit, errors } = useForm();

  const strength = {
    0: "Worst",
    1: "Bad",
    2: "Weak",
    3: "Good",
    4: "Strong"
  };

  let userInputs = {
    fname,
    lname,
    email,
  };


  // handle pw strength check
  function handleStrengthChech(passwordVal) {
    const meter = document.getElementById('password-strength-meter');
    const text = document.getElementById('password-strength-text');
  
    // check strength *second arg only takes array
    let result = zxcvbn(passwordVal, [userInputs.fname, userInputs.lname, userInputs.email]);

    // Update the password strength meter
    meter.value = result.score;

    // Update the text indicator
    if (passwordVal !== "") {
      text.innerHTML = "Strength: " + strength[result.score]; 
    } else {
      text.innerHTML = "";
    }
  }


  // handle other fields state change, also store vals in custom obj for zxcvbn to use
  const handleFieldValueChange = (setState, key, e) => {
    const inputVal = e.target.value;

    setState(inputVal);
    userInputs[key] = inputVal;

    handleStrengthChech(password);
  }


  // handle password state change and trigger handleStrengthChech()
  const handlePasswordChange = (e) => {
    const passwordVal = e.target.value;
    
    setPassword(passwordVal);
    handleStrengthChech(passwordVal);
  };


  // handle toggle mask/unmask pw
  const handleTogglePasswordMask = () => {
    const passwordDOM = document.getElementById('password');

    if (passwordDOM.getAttribute('type') === 'password'){
      passwordDOM.setAttribute('type', 'text');
    } else {
      passwordDOM.setAttribute('type', 'password');
    }
  };


  // handle save input values to db (in this case, to local storage)
  const handleOnSubmit = (data) => {
    localStorage.setItem('data', JSON.stringify(data));
  };


  // handle get and display data into input fields
  const handleSetStateFromDatabase = () => {
    
    let storedData = JSON.parse(localStorage.getItem('data'));

    setFname(storedData['fname']);
    setLname(storedData['lname']);
    setEmail(storedData['email']);
    setPassword(storedData['password']);
  };
  window.addEventListener('load', handleSetStateFromDatabase);
  

  return (
    <form action="" onSubmit={ handleSubmit(handleOnSubmit) }>
      {/* first name */}
      <label htmlFor="fname">First name:</label>
      <input 
        type="text" 
        id="fname" 
        name="fname" 
        value={ fname }
        onChange={ (e) => { handleFieldValueChange(setFname, 'fname', e) } } 
        ref={ register({ 
          required: true,
          pattern: { value: /^\S*$/ }
        }) } />
        { errors.fname && <p>必須項目です。</p> }


      {/* last name */}
      <label htmlFor="lname">Last name:</label>
      <input 
        type="text" 
        id="lname" 
        name="lname" 
        value={ lname }
        onChange={ (e) => { handleFieldValueChange(setLname, 'lname', e) } } 
        ref={ register({ 
          required: true,
          pattern: { value: /^\S*$/ }
        }) } />
      { errors.lname && <p>必須項目です。</p> }


      {/* email */}
      <label htmlFor="email">Email:</label>
      <input 
        type="text" 
        id="email" 
        name="email" 
        value={ email }
        onChange={ (e) => { handleFieldValueChange(setEmail, 'email', e) } } 
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
        ref={ register({ 
          required: true,
          pattern: { value: /^\S*$/ }
        }) } />
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

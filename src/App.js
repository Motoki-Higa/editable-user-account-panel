import React from 'react';
import { useForm } from "react-hook-form";
import zxcvbn from 'zxcvbn';


const userInputsDom = {
  fname: document.getElementById('fname'),
  lname: document.getElementById('lname'),
  email: document.getElementById('email'),
  password: document.getElementById('password'),
};

function App() {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    console.log(data);
  }
  
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
        ref={ register({ required: true }) } />
        { errors.password && <p>必須項目です。</p> }

      <meter 
        max="4" 
        id="password-strength-meter"></meter>

      <p id="password-strength-text"></p>
      <p id="showPw">Show password</p>

      {/* submit */}
      <input type="submit" />
    </form>
  );
  
}

export default App;

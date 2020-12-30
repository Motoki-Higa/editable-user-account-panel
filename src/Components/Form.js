import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import zxcvbn from 'zxcvbn';
import MD5 from 'crypto-js/md5';

function Form() {
  // parse data from database (localstorage is used for development)
  const storedData = JSON.parse(localStorage.getItem('data'));
  
  // hook useForm. get data from database (if any) and update input values
  const { register, handleSubmit, setValue, errors } = useForm({
    defaultValues: {
      fname: storedData ? storedData['fname'] : '',
      lname: storedData ? storedData['lname'] : '',
      email: storedData ? storedData['email'] : '',
      password: storedData ? storedData['password'] : '',
    }
  });

  // get and update userInputs array for validation use. if no database, then '';
  let userInputs = {
    fname: storedData ? storedData['fname'] : '',
    lname: storedData ? storedData['lname'] : '',
    email: storedData ? storedData['email'] : '',
    password: storedData ? storedData['password'] : '',
  };

  const strength = { 0: "Worst", 1: "Bad", 2: "Weak", 3: "Good", 4: "Strong" };


  // handle pw strength check
  function handleStrengthCheck(passwordVal) {
    const meter = document.getElementById('password-strength-meter');
    const text = document.getElementById('password-strength-text');
  
    // check strength *second arg only takes array
    let result = zxcvbn(passwordVal, [userInputs.fname, userInputs.lname, userInputs.email]);

    // Update the password strength meter
    meter.value = result.score;

    // Update the text indicator
    if (passwordVal !== '') {
      text.innerHTML = 'Strength: ' + strength[result.score]; 
    } else {
      text.innerHTML = '';
    }
  }


  // handle other fields state change, also store vals in custom obj for zxcvbn to use
  const handleFieldValueChange = (key, e) => {
    const inputVal = e.target.value;

    setValue(key, inputVal);
    userInputs[key] = inputVal;

    handleStrengthCheck(userInputs.password);
  }


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


  // handle update Gravatar
  const handleUpdateGravatar = () => {
    const gravatar = 'https://www.gravatar.com/avatar/';
    const profileImg = document.getElementById('profileImg');
    const email = document.getElementById('email');
    const emailVal = email.value.replace(/\s+/g, '').toLowerCase(); // no whitespace & lowercase for generating valid md5hash
    const md5Hash = MD5(emailVal).toString(); 
    const imgURL = gravatar + md5Hash; // complete image url
    
    profileImg.setAttribute('src', imgURL);
    profileImg.setAttribute('srcset', imgURL + ' 320w,' + imgURL + '?s=400 800w,');
  };
  useEffect(() => { handleUpdateGravatar() }); // update gravatar after load the page


  return (
    <div>
      <div className="imgWrap">
        <picture>
          <img id="profileImg" src="https://www.gravatar.com/avatar/"
          srcSet="https://www.gravatar.com/avatar/?s=20 320w, https://www.gravatar.com/avatar/?s=400 800w"
          alt="Image description" />
        </picture>
      </div>

      <form action="" onSubmit={ handleSubmit(handleOnSubmit) }>
        {/* first name */}
        <div>
          <label htmlFor="fname">First name:</label>
          <input 
            type="text" 
            id="fname" 
            name="fname" 
            onChange={ (e) => { handleFieldValueChange('fname', e) } } 
            ref={ register({ 
              required: true,
              pattern: { value: /^\S*$/ }
            }) } />
            { errors.fname && <p>必須項目です。</p> }
        </div>

        {/* last name */}
        <div>
          <label htmlFor="lname">Last name:</label>
          <input 
            type="text" 
            id="lname" 
            name="lname" 
            onChange={ (e) => { handleFieldValueChange('lname', e) } } 
            ref={ register({ 
              required: true,
              pattern: { value: /^\S*$/ }
            }) } />
          { errors.lname && <p>必須項目です。</p> }
        </div>

        {/* email */}
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="text" 
            id="email" 
            name="email" 
            onChange={ (e) => { 
              handleFieldValueChange('email', e);
              handleUpdateGravatar(); 
            } } 
            ref={ register({ 
              required: true,
              pattern: {　value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,}
            }) 
          } />
          { errors.email && errors.email.type === "required" && <p>必須項目です。</p> }
          { errors.email && errors.email.type === "pattern" && <p>メールアドレスの形式が正しくありません。</p> }
        </div>

        {/* password */}
        <div>
          <label htmlFor="password">Enter password</label>
          <input 
            type="password" 
            id="password"
            name="password"
            onChange={ (e) => { handleFieldValueChange('password', e) } } 
            ref={ register({ 
              required: true,
              pattern: { value: /^\S*$/ }
            }) } />
          { errors.password && errors.password.type === "required" && <p>必須項目です。</p> }
          { errors.password && errors.password.type === "pattern" && <p>スペースは使用できません。</p> }
        </div>

        <meter 
          max="4" 
          id="password-strength-meter"></meter>
        <p id="password-strength-text"></p>

        <p 
          id="showPw"
          onClick={ handleTogglePasswordMask } >Show password</p>

        {/* submit */}
        <div>
          <input type="submit" />
        </div>
      </form>
    </div>
  );
  
}

export default Form;
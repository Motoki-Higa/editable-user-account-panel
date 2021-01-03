import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import zxcvbn from 'zxcvbn';
import MD5 from 'crypto-js/md5';
import CloseBtn from '@material-ui/icons/Close';
import VisibilityOnIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

function Form() {
  // state
  const [message, setMessage] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // parse data from database (localstorage is used for development)
  const storedData = JSON.parse(localStorage.getItem('data'));
  
  // hook useForm. get data from database (if any) and update default input values
  const { register, handleSubmit, errors, reset } = useForm({
    defaultValues: {
      fname: storedData ? storedData['fname'] : '',
      lname: storedData ? storedData['lname'] : '',
      email: storedData ? storedData['email'] : '',
      password: storedData ? storedData['password'] : '',
    }
  });

  // set userInputs array for validation use. if no database, then '';
  let userInputs = {
    fname: storedData ? storedData['fname'] : '',
    lname: storedData ? storedData['lname'] : '',
    email: storedData ? storedData['email'] : '',
    password: storedData ? storedData['password'] : '',
  };

  const strength = { 0: "Worst", 1: "Bad", 2: "Weak", 3: "Good", 4: "Strong" };


  // handle close message
  const handleCloseMsg = () => {
    setMessage('');
  };


  // handle password strength check
  const handleStrengthCheck = (passwordVal) => {
    const customMeter = document.getElementById('custom-meter');
    const text = document.getElementById('password-strength-text');
  
    // check strength *second arg only takes array
    let result = zxcvbn(passwordVal, [userInputs.fname, userInputs.lname, userInputs.email]);

    // Update the password strength meter
    customMeter.setAttribute('class', 'strength-' + result.score);

    // Update the text indicator
    if (passwordVal !== '') {
      text.innerHTML = 'Strength: ' + strength[result.score]; 
    } else {
      text.innerHTML = '';
    }
  };


  // handle other fields state change, also store vals in custom obj for zxcvbn to use
  const handleFieldValueChange = (key, e) => {
    userInputs[key] = e.target.value;

    if (key === 'password'){
      handleStrengthCheck(userInputs.password);
    }
  };


  // handle toggle mask/unmask pw
  const handleTogglePasswordMask = () => {
    // set visibility state
    setIsPasswordVisible(!isPasswordVisible);

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

    setMessage('Your details are updated!');

    // reset password visibility to invisible
    const passwordDOM = document.getElementById('password');
    passwordDOM.setAttribute('type', 'password');
    setIsPasswordVisible(false);

    // reset strength meter to 0
    const customMeter = document.getElementById('custom-meter');
    customMeter.setAttribute('class', '');
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
    <div className="formWrapper">
      {/* Gravatar */}
      <div className="sct-profile">
        <div className="sct-profile__inner">
          <div className="sct-profile__gravatar">
            <picture>
              <img 
              id="profileImg" 
              src="https://www.gravatar.com/avatar/"
              srcSet="https://www.gravatar.com/avatar/?s=20 320w, https://www.gravatar.com/avatar/?s=400 800w" />
            </picture>
          </div>
          <div className="sct-profile__txtBox">
            <p className="sct-profile__name">{
              (()=> {
                if (storedData) {
                  return <span>{ storedData['fname'] + ' ' + storedData['lname'] } </span>;
                } else {
                  return <span></span>;
                }
              })()
            }
            </p>
          </div>
        </div>
      </div>

      <div className="sct-form">
        {(()=> {
          if (message) {
            return <span id="message" className="message">{ message }
              <span 
                onClick={ () => { handleCloseMsg()} }
                className="messageBox__closeBtn"><CloseBtn /></span>
            </span>;
          }
        })()}

        <form className="sct-form__form" action="" onSubmit={ handleSubmit(handleOnSubmit) }>
          {/* first name */}
          <div className="sct-form__field sct-form__field--fname">
            <label htmlFor="fname">First Name</label>
            <input 
              type="text" 
              id="fname" 
              name="fname" 
              onChange={ (e) => { handleFieldValueChange('fname', e) } } 
              ref={ register({ 
                required: true,
                pattern: { value: /^\S*$/ }
              }) } />
              { errors.fname && <p className="sct-form__error">Required</p> }
          </div>

          {/* last name */}
          <div className="sct-form__field sct-form__field--lname">
            <label htmlFor="lname">Last Name</label>
            <input 
              type="text" 
              id="lname" 
              name="lname" 
              onChange={ (e) => { handleFieldValueChange('lname', e) } } 
              ref={ register({ 
                required: true,
                pattern: { value: /^\S*$/ }
              }) } />
            { errors.lname && <p className="sct-form__error">Required</p> }
          </div>

          {/* email */}
          <div className="sct-form__field sct-form__field--email">
            <label htmlFor="email">Email</label>
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
            { errors.email && errors.email.type === "required" && <p className="sct-form__error">Required</p> }
            { errors.email && errors.email.type === "pattern" && <p className="sct-form__error">Invalid mail address</p> }
          </div>

          {/* password */}
          <div className="sct-form__field sct-form__field--password">
            <label htmlFor="password">Password</label>
            <div className="sct-form__fieldCol">
              <div className="sct-form__col50">
                <div className="sct-form__inputWrapper">
                  <input 
                    type="password" 
                    id="password"
                    name="password"
                    onChange={ (e) => { handleFieldValueChange('password', e) } } 
                    ref={ register({ 
                      required: true,
                      minLength: 6,
                      pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/ },
                    }) } />
                  <span 
                    id="showPw"
                    className="sct-form__btnPwVisible"
                    onClick={ handleTogglePasswordMask } >{
                      (()=> {
                        return isPasswordVisible ? <VisibilityOnIcon /> : <VisibilityOffIcon />;
                      })()
                    }</span>
                </div>

                <div className="sct-form__meter">
                  <span 
                    id="custom-meter"
                    className="sct-form__meterBar" ></span>
                </div>
                <p id="password-strength-text" className="sct-form__strengthTxt"></p>

                { errors.password && errors.password.type === "required" && <p className="sct-form__error">Required</p> }
                { errors.password && errors.password.type === "minLength" && <p className="sct-form__error">Minimum 6 characters</p> }
                { errors.password && errors.password.type === "pattern" && <p className="sct-form__error">Your password must contain at least one number and have a mixture of uppercase and lowercase letters.</p> }
              </div>
              
              <div className="sct-form__strength sct-form__col50">
                <p className="sct-form__strengthTxt">・At least 6 characters<br />・At least one number<br />・At least one uppercase<br />・At least one lowercase</p>
              </div>
            </div>
            
          </div>

          {/* submit */}
          <div className="sct-form__field sct-form__field--btn">
            <input type="submit" value="UPDATE CHANGES" />
          </div>
        </form>
      </div>
    </div>
  );
  
}

export default Form;
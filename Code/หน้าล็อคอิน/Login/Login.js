import React , { useEffect, useState}from 'react';
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import '../Login/Login.css'
import ForgottenForm from '../Forgotten/Forgotten';

function LoginForm({ setPagestate , outPagestate , setLanguage}) {
  const [showModal, setShowModal] = useState(false);
  
  const handleShow = () => {
    setShowModal(true)
  };
  
  const handleClose = () => {
    setShowModal(false)
    outPagestate(false)
  };
  
  useEffect(() => {
    if(setPagestate){
      setShowModal(setPagestate)
    }
  },[setPagestate])

  return( 
        <>
          <div className="App">
              <Button variant="btn btn-success" onClick={handleShow} style={{margin : 10}}>
                  {setLanguage === "TH" ? "เข้าสู่ระบบ" : "Login"}
              </Button>
              <Login show={showModal} handleClose={handleClose} setLanguage={setLanguage}/>
          </div>      
        </>     
  )
}

function Login({ show, handleClose , setLanguage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginFail, setLoginFail] = useState(0);
  const [checkboxRule , setCheckboxRule] = useState(false);
  const [fogottenState , setFogottenState] = useState(false);
  const navigate = useNavigate();


  const handleLogin = async e => {
    const tokens ={ email:email , password:password , remember:checkboxRule} // Make list Json

     e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', tokens);
      console.log('Data sent successfully:', response.data );
      if( response.data['user'] != null ){  

        // convert image to show 
        const image = response.data.image;
        const image_src = 'data:image/jpeg;base64,' + image;
        
        sessionStorage.setItem('token', JSON.stringify(response.data.user));
        sessionStorage.setItem('token_bank', JSON.stringify(response.data.bank));
        sessionStorage.setItem('token_image', JSON.stringify(image_src));
        sessionStorage.setItem('token_id' , JSON.stringify(response.data.user_token));

        // Check Remember
        if(checkboxRule === false){
          window.location.reload(); // refresh window for back to login page
          sessionStorage.setItem('token_remember', false);
        } 
        else{
          window.location.reload(); // refresh window for back to login page 
        }

        navigate('/home');
      }
      else if(loginFail < 2){
        alert(response.data['warning']);
        setLoginFail(loginFail+1)
      }  
      else{
        alert( setLanguage === 'TH' ? "คุณยังไม่สามารถเข้าสู่ระบบได้ใน 10 วินาที" : "You can't login within 10 seconds");
        setLoginFail(loginFail+1)
        setTimeout(() => {  
          console.log('You can login this time!' );
          setLoginFail(0) 
        },10000)
      }    
    }
    catch (error) {
      console.error('Error sending data:', error);
    }
  }

  const onGoogle = (e) => {
    //<GoogleLogin />
    e.preventDefault();
    console.log("Ok google")
  }
  const onFacebook = (e) => {
    //<FacebookLogin />
    e.preventDefault();
    console.log("Ok facebook")
  }
  const onLine = (e) => {
    //<LineLogin />
    e.preventDefault();
    console.log("Ok line")
  }

  const handleForgotPassword = (e) => {
    setFogottenState(true)
  }

  return(
    <>
      { fogottenState ? 
        <ForgottenForm setModal={fogottenState} outModal={() => setFogottenState(false)} setLanguage={setLanguage} /> 
        : 
        <Modal show={show} onHide={handleClose} className='Modal-Login'>
            <Modal.Header >
                <Modal.Title>{setLanguage === 'TH' ? 'เข้าสู่ระบบ' : 'Login'}</Modal.Title>
                <Button type="button" className="btn-close btn-success" aria-label="Close" onClick={handleClose}></Button>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleLogin}>
                    <Form.Group>
                        <Form.Label>{setLanguage === 'TH' ? 'อีเมลล์' : 'Email address'}</Form.Label>
                        <Form.Control 
                          className='custom-input-login'
                            type="email" 
                            placeholder={setLanguage === 'TH' ? 'กรอกอีเมลล์' : "Enter email" }
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label>{setLanguage === 'TH' ? 'รหัสผ่าน' : "Password" }</Form.Label>
                        <Form.Control 
                            className='custom-input-login'
                            type="password" 
                            placeholder={setLanguage === 'TH' ? 'กรอกรหัสผ่าน' : "Password"  }
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                        <div className='custom-fogotten-link'  onClick={handleForgotPassword} >{setLanguage === 'TH' ? 'เปลี่ยนรหัสผ่าน' : "Forgot Password?" }</div> 
                        <Form.Check 
                            className='custom-remember'
                            type="checkbox" 
                            label={setLanguage === 'TH' ? 'จดจำเข้าสู่ระบบ' : "Remember me"  }
                            checked={checkboxRule} 
                            onChange={(e) => setCheckboxRule(e.target.checked)}
                          />
                    </Form.Group>                  
                    <Button className="nav-link dropdown-toggle btn btn-light" data-bs-toggle="dropdown" role="button" aria-expanded="false" style={{position : 'absolute' , right : 10 , marginTop : 20}} >
                      {setLanguage === 'TH' ? 'เพิ่มเติม' : "More" }
                    </Button>
                      <ul className="dropdown-menu">
                          <li><Button className="dropdown-item" onClick={()=>onGoogle()}>{setLanguage === 'TH' ? 'บัญชี Google' : "GoogleLoginComponent" }</Button></li>
                          <li><Button className="dropdown-item" onClick={()=>onFacebook()}>{setLanguage === 'TH' ? 'บัญชี Facebook' : "Facebook" }</Button></li>
                          <li><Button className="dropdown-item" onClick={()=>onLine()}>{setLanguage === 'TH' ? 'บัญชี Line' : "Line" }</Button></li>
                      </ul>
                    <Button variant="btn custom-btn-submit-login" type="submit" style={{marginTop : 10}} disabled={loginFail < 3 ? false : true}>
                      {setLanguage === 'TH' ? 'เข้าสู่ระบบ' : "Login" }
                    </Button>
                    
                </Form>
            </Modal.Body>
          </Modal>
      }
    </>


  )
}

export default LoginForm
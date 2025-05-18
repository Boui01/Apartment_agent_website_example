import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import '../Register/Register.css';
import { useState } from 'react';
import RegisterAdmin from './RegisterAdmin/RegisterAdmin';
import RegisterEmployee from './RegisterEmployee/RegisterEmployee';
import DetectRule from '../../Function/DetectRule';
import emailjs from 'emailjs-com';
import PopupError from '../PopupError/PopupError';
import { useNavigate } from 'react-router-dom';
import {
    ThailandAddressTypeahead,
    ThailandAddressValue,
  } from "react-thailand-address-typeahead";
import PopupSuccess from '../PopupSuccess/PopupSuccess';
function RegisterForm({setLogin , setLanguage}) {
    const [showModal, setShowModal] = useState(true);
    const [Waiting , setWaiting] = useState(false);
    const [stateShow , setStatShow] = useState('user');
    const [ModalError , setModalError] = useState(false)
    const [ModalErrorDetail , setModalErrorDetail] = useState()
    const [ModalSuccess , setModalSuccess] = useState(false)
    const [ModalSuccessDetail , setModalSuccessDetail] = useState()
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin
    const navigate = useNavigate();

    const handleClose = () => {
      //sessionStorage.removeItem('window')
      navigate('/')
    
    }

    return (
    <>
        <video autoPlay loop muted className='videoBackground'>
            <source src="..\Video\Register2.mp4" type="video/mp4" />
        </video>
        {Waiting ?
            <div className='waiting'>
                <div className="spinner-grow text-success waiting-spinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
            :
            <Modal show={showModal} onHide={() => setShowModal(true)} className={`${Waiting ? 'wait' :  ''} Model`}>
                <Modal.Header className='Model_head'>

                    <div>
                        <Button className={`btn-Modal-register-head ${DetectRule(stateShow , 'user' , 'btn-Modal-register-head-active' , '')}`} 
                                type='button' onClick={() => setStatShow('user')}>
                                    {setLanguage === 'TH' ? 'สมัครสมาชิก' : 'Register'}
                        </Button>
                        { ( Login ? Login.status: '' ) === 'employee' ||  ( Login ? Login.status: '' ) === 'admin'?
                                <>
                                    <Button className={`btn-Modal-register-head ${DetectRule(stateShow , 'employee' , 'btn-Modal-register-head-active' , '')}`}
                                            type='button' onClick={() => setStatShow('employee')}>
                                                {setLanguage === 'TH' ? 'สมัครสมาชิกพนักงาน' : 'Employee'}
                                    </Button>
                                    { ( Login ? Login.status: '' ) === 'admin'?
                                        <Button className={`btn-Modal-register-head ${DetectRule(stateShow , 'admin' , 'btn-Modal-register-head-active' , '')}`} 
                                                type='button' onClick={() => setStatShow('admin')}>
                                                    {setLanguage === 'TH' ? 'สมัครสมาชิกหัวหน้า' : 'Admin'}
                                        </Button>
                                    :
                                        <></>
                                    }
                                </>
                            :
                                <></>
                        }
                    </div>

                    <Button type="button" className="btn-close btn-warning btn-close-register" aria-label="Close" onClick={handleClose}></Button>
                </Modal.Header>
                <Modal.Body className='Model_body'>
                    {stateShow === 'admin' ?
                        <RegisterAdmin  handleClose={handleClose} setWaiting={setWaiting} setLogin={Login} setLanguage={setLanguage}/>
                    :stateShow === 'employee' ?
                        <RegisterEmployee handleClose={handleClose} setWaiting={setWaiting} setLogin={Login} setLanguage={setLanguage}/>
                    : stateShow === 'user' ?
                        <Register handleClose={handleClose} setWaiting={setWaiting} outError={setModalError} outErrorDetial={setModalErrorDetail} outSuccess={setModalSuccess} outSuccessDetial={setModalSuccessDetail} setLanguage={setLanguage}/>
                    :
                        <></>
                    }
                </Modal.Body>
            </Modal>   
        }
        <PopupError setModal={ModalError} outModal={() => setModalError(false)} setDetail={ModalErrorDetail} setLanguage={setLanguage}/>
        <PopupSuccess   show={ModalSuccess} onHide={() =>  (  sessionStorage.removeItem('window'),
                                                            navigate('/') , 
                                                            setModalSuccess(false)
                                                        )}
                        message={ModalSuccessDetail} setLanguage={setLanguage}/>
    </>)

}




function Register({setWaiting , outError , outErrorDetial , outSuccess , outSuccessDetial  , setLanguage}) {
    const [PasswordFail, setPasswordFail] = useState(false)
    const [ShowinfoPassword , setShowinfoPassword ] = useState(false)
    const [Race , setRace] = useState('eu')
    const navigate = useNavigate();


    const handleSubmit = async (event) => {
        
        event.preventDefault();

        const  birthday = new Date(event.target.birthday.value);
        console.log('check-birthday : ', birthday)

        if(event.target.password.value !== event.target.password_confirmation.value){
            setPasswordFail(true)
        }
        else if( birthday > new Date()){
            alert('Please check your birthday. It should be in the past.')
        }
        else if (   new Date().getFullYear() - birthday.getFullYear() !== parseInt(event.target.age.value) || 
                    parseInt(event.target.age.value) < 18 || parseInt(event.target.age.value) > 60
        ){
            alert("Please check your age. ( It should be between 18 and 60 or check your age don't match with your birthday. ) ")
        }
        else{
            const formData = {
                id_card : event.target.id_card.value,
                english_fname: event.target.English_fname.value,
                english_lname: event.target.English_lname.value,
                address:   
                    Race === 'eu' ? 
                        event.target.StreetAddress.value + ' ' +
                        event.target.PostalCode.value + ' ' +
                        event.target.City.value + ' ' +
                        event.target.State.value + ' ' +
                        event.target.Country.value 
                    :
                        event.target.House_number.value+' '+
                        'moo.'+ event.target.Village.value+' '+
                        'road.'+ event.target.Street.value+' '+
                        'tambon.'+ event.target.Sub_district.value+' '+
                        'amphoe.'+ event.target.District.value+' '+
                        'province.'+ event.target.Province.value+' '+
                        'zipcode. '+ event.target.Zip_code.value
                ,
                birthday: event.target.birthday.value,
                religion: event.target.religion.value,
                sex: event.target.sex.value,
                age: parseInt(event.target.age.value),
                phone: event.target.phone.value,
                line_id: event.target.line_id.value,
                financial_statement  : parseInt(event.target.financial_statement.value),     
                guarantor_english_fname : event.target.guarantor_english_fname.value, 
                guarantor_english_lname : event.target.guarantor_english_lname.value, 
                guarantor_address : 
                    Race === 'eu' ? 
                        event.target.Guarantor_StreetAddress.value + ' ' +
                        event.target.Guarantor_PostalCode.value + ' ' +
                        event.target.Guarantor_City.value + ' ' +
                        event.target.Guarantor_State.value + ' ' +
                        event.target.Guarantor_Country.value 
                    :
                        event.target.Guarantor_House_Number.value+' '+
                        'moo. '+ event.target.Guarantor_Village.value+' '+
                        'road. '+event.target.Guarantor_Street.value+' '+
                        event.target.Guarantor_Sub_district.value !== '' ?'tambol.'+ event.target.Guarantor_Sub_district.value+' ' : ''+
                        event.target.Guarantor_District.value !== '' ? 'amphoe.'+ event.target.Guarantor_District.value+' ' : ''+
                        'province.'+ event.target.Guarantor_Province.value+' '+
                        'zipcode '+ event.target.Guarantor_Zip_code.value
                ,    
                guarantor_phone : event.target.guarantor_phone.value,    
                bank_id: event.target.bank_id.value,
                bank_type: event.target.bank_type.value,
                email: event.target.email.value,
                password: event.target.password.value,
                password_confirmation: event.target.password_confirmation.value,
            };

            console.log('Registration check:', formData);
            setWaiting(true)

            // create user 
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/register`, formData,{ 
                  } 
                );
                if(response.data[422]  || response.data[401]  || response.data[402]){
                    console.log('Registration Failled : ', response.data);
                    // set Error
                    outError(true)
                    outErrorDetial({text : setLanguage  === 'TH' ? 'การลงทะเบียนล้มเหลว'  : 'Registration Failled.', detail : setLanguage  === 'TH' ? {422 : 'ตรวจสอบข้อมูลที่กรอกของคุณให้ถูกต้อง'}  : {422  : ' Please check your input data correctly'}});
                    setWaiting(false)
                }
                else{
                    console.log('Registration successful:', response.data.user);
                    
                    // set data sent
                    const validationToken = Math.random().toString(36).slice(-8);
                    const validationLink = `http://localhost:3000/validate-email?token=${validationToken}`
                    const ms =  `Please click the following link to validate your email address: 
                                   <a href="${validationLink}">Validate Email</a>       
                                `
                    // save token
                    const history_save = { email : event.target.email.value , token : validationToken}
                    try {
                        const response_token = await axios.post('http://127.0.0.1:8000/api/token', {history : history_save});
                        if(response_token.data[404] || response_token.data[422]){
                            console.log('error set token_valify : ', response_token.data);
                            // set Error
                            outError(true)
                            outErrorDetial({text : setLanguage  === 'TH' ? 'ส่ง Token valify ล้มเหลว'  : 'Error set Token valify  ', detail : response_token.data});
                            setWaiting(false)
                        }
                        else{
                            console.log('Set token_valify:', response_token.data);

                            //send email  
                            try{
                                const response2 = await emailjs.send(
                                    'service_7im7vlo', 'template_nuqayod', 
                                    {
                                        from_name: 'cecezx111@gmail.com',
                                        to_email: event.target.email.value,
                                        message: ms,
                                    }, 
                                    'jw32AzeO3ezAw8l91')

                                    if(response2){
                                        console.log('Email sent successfully:', response2);
                                        outSuccess(true)
                                        outSuccessDetial(setLanguage === 'TH' ? 'ส่งอีเมลสําเร็จ โปรดคลิกลิงก์เพื่อยืนยันอีเมล' : 'Send email successfully. Please click the link to validate your email. ');
                                        setWaiting(false)

                                    }

                                }

                                // sent error
                                catch (err) {
                                    console.error('Failed to send email:', err);
            
                                    setWaiting(false)
                                    alert('Cannot send email. Please try again later. ');
            
                                }

                        }
                    }
                    catch (error) {
                        console.error('Failed to set token_valify:', error);
                        setWaiting(false)
                    }

                }
                
            } catch (error) {
                setWaiting(false)
                outError(true)
                outErrorDetial({text : setLanguage  === 'TH' ? 'การลงทะเบียนล้มเหลว'  : 'Registration Failled.', detail : setLanguage  === 'TH' ? {422 : 'ตรวจสอบข้อมูลที่กรอกของคุณให้ถูกต้อง'}  : {422  : 'Server is broken register later. '}});
                console.error('Registration error:', error.response.data);
            
            }
        }
    };
    
    

    return(
        <>
                <Form onSubmit={handleSubmit} className="container">
                <Form.Label style={{color : 'red', fontSize : '14px'}}>{ setLanguage === 'TH' ? '( กรุณากรอกข้อมูลภาษาอังกฤษเท่านั้น )' : '( Please fill in the information english only )'}</Form.Label>
                    <Form.Group  className='row'>
                        <Form.Group  className='col-6'>
                            <Form.Label>{setLanguage === 'TH' ? 'ชื่อ - นามสกุล' : 'Name'}</Form.Label>
                            <Form.Group  className='row'>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="English_fname" maxLength="30"  placeholder={setLanguage === 'TH' ? 'ชื่อ (อังกฤษ)' : "English Frist Name"} pattern="^[a-zA-Z]+$" required/>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="English_lname" maxLength="30" placeholder={setLanguage === 'TH' ? 'นามสกุล (อังกฤษ)' : "English Last Name" }pattern="^[a-zA-Z]+$" required/>
                            </Form.Group>
                            <Form.Group  className='row mb-2'>
                                <Form.Label>{setLanguage === 'TH' ? 'สัญชาติโซน' : 'Race zone'}</Form.Label>
                                <Form.Select  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Race" maxLength="10"  placeholder={setLanguage === 'TH' ? 'สัญชาติ' : "Race"} onChange={(e) => setRace(e.target.value)}  required>
                                    <option value="eu">{setLanguage === 'TH' ? 'ยุโรป' : "Europe"}</option>
                                    <option value="as">{setLanguage === 'TH' ? 'เอเชีย' : "Asian"}</option>
                                </Form.Select>
                            </Form.Group>
                            { 
                                Race === 'eu' ? 
                                <>
                                    <Form.Group >
                                        <Form.Label>{setLanguage === 'TH' ? 'ที่อยู่ (ุถ้ากรณีไม่มีเว้นช่องกรอกข้อมูลให้ว่าง)' : 'Address ( Please empty input if not have )'}</Form.Label>
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="StreetAddress"
                                            maxLength="100"
                                            placeholder={setLanguage === 'TH' ? 'ที่อยู่ถนน / เลขที่บ้าน' : 'Street Address / House Number'}
                                            pattern="^[a-zA-Z0-9]+$"
                                            required
                                        />
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="PostalCode"
                                            maxLength="10"
                                            placeholder={setLanguage === 'TH' ? 'รหัสไปรษณีย์' : 'Postal Code'}
                                            pattern="^[a-zA-Z0-9]+$"
                                        />
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="City"
                                            maxLength="50"
                                            placeholder={setLanguage === 'TH' ? 'เมือง / ตำบล' : 'City / Town'}
                                            pattern="^[a-zA-Z0-9]+$"
                                        />
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="State"
                                            maxLength="50"
                                            placeholder={setLanguage === 'TH' ? 'รัฐ / จังหวัด / ภูมิภาค (ถ้ามี)' : 'State / Province / Region (optional)'}
                                            pattern="^[a-zA-Z0-9]+$"
                                        />
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="Country"
                                            maxLength="50"
                                            placeholder={setLanguage === 'TH' ? 'ประเทศ' : 'Country'}
                                            pattern="^[a-zA-Z]+$"
                                        />
                                    </Form.Group>
                                </>
                            :
                                <>
                                    <Form.Label>{setLanguage === 'TH' ? 'ที่อยู่ (ุถ้ากรณีไม่มีเว้นช่องกรอกข้อมูลให้ว่าง)' : 'Address ( Please empty input if not have )'}</Form.Label>
                                    <Form.Group  className='row'>
                                        <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="House_number" maxLength="10"  placeholder={setLanguage === 'TH' ? 'บ้านเลขที่' : "House Number"} pattern={Race === 'eu' ? "^[a-zA-Z]+$":"[0-9]+$" } required/>
                                        <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Village" maxLength="4"  placeholder={setLanguage === 'TH' ? 'หมู่ที่' : "Village"} pattern="[0-9]+$" />
                                        <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Street" maxLength="20"  placeholder={setLanguage === 'TH' ? 'ถนน' : "Street"} pattern="^[a-zA-Z]+$" />
                                    </Form.Group>
                                    <Form.Group  className='row'>
                                        <div className="col-6">
                                            <Form.Control placeholder={setLanguage === 'TH' ? 'ตําบล' : "Sub-district"} name='Sub_district'  className="form-control mb-3 " pattern="^[a-zA-Z]+$" />
                                        </div>
                                        <div className="col-6">
                                            <Form.Control placeholder={setLanguage === 'TH' ? 'อำเภอ' : "District"} name='District' className="form-control mb-3" pattern="^[a-zA-Z]+$" />
                                        </div>
                                        <div className="col-6">
                                            <Form.Control placeholder={setLanguage === 'TH' ? 'จังหวัด' : "Province"} name='Province' className="form-control mb-3" pattern="^[a-zA-Z]+$" />
                                        </div>
                                        <div className="col-6">
                                        <Form.Control placeholder={setLanguage === 'TH' ? 'รหัสไปรษณีย์' : "Zip Code"} name='Zip_code'  className="form-control mb-3" pattern={Race === 'eu' ? "^[a-zA-Z]+$":"[0-9]+$" } />
                                        </div>
                                    </Form.Group>
                                </>
                            }
                            <Form.Group  className='row'>
                                <Form.Label className='col-6'>{setLanguage === 'TH' ? 'วันเกิด' : 'Birthday'}</Form.Label>
                                <Form.Label className='col-6'>{setLanguage === 'TH' ? 'อายุ' : 'Age'}</Form.Label>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="date" name="birthday" placeholder={setLanguage === 'TH' ? 'วันเกิด' : "Birthday"} required/>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="number" name="age" max="100" min="1" placeholder={setLanguage === 'TH' ? 'อายุ' : "Age"} pattern="^[0-9]+$" required/>
                            </Form.Group>
                            <Form.Group  className='row'>
                                <Form.Label className='col-6'>{setLanguage === 'TH' ? 'เบอร์โทร' : 'Phone'}</Form.Label>
                                <Form.Label className='col-6'>{setLanguage === 'TH' ? 'ไลน์ไอดี' : 'Line id'}</Form.Label>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="phone"  maxLength="10" placeholder={setLanguage === 'TH' ? 'เบอร์โทร' : "Phone"}  pattern="^[0-9]+$" required/>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="line_id" placeholder={setLanguage === 'TH' ? 'ไลน์ไอดี' : "Line id" }maxLength="10" minLength="1"  pattern="^[a-zA-Z0-9]+$" required/>
                            </Form.Group>

                            <Form.Group  className='row'>
                                    <Form.Group  className='col-8' style={{marginLeft: "-10px"}}>
                                        <Form.Label style={{ marginLeft: "10px"}} >{setLanguage === 'TH' ? 'ศาสนา' : 'Religion'}</Form.Label>
                                        <Form.Control  className="form-control marginInput" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="religion" maxLength="10" placeholder={setLanguage === 'TH' ? 'ศาสนา' : "Religion"} pattern="^[a-zA-Z]+$" required/>
                                    </Form.Group>
                                    <Form.Group className=' col'>
                                        <Form.Label style={{ marginLeft: "10px"}}>{setLanguage === 'TH' ? 'เพศ' : 'Sex'}</Form.Label>
                                        <Form.Select  className="form-control marginInput" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="sex" maxLength="10" placeholder={setLanguage === 'TH' ? 'เพศ' : "Sex"} required>
                                            <option value="" disabled>{setLanguage === 'TH' ? 'เลือกเพศ' : 'Select Sex'}</option>
                                            <option value="Male">{setLanguage === 'TH' ? 'ชาย' : 'Male'}</option>
                                            <option value="Female">{setLanguage === 'TH' ? 'หญิง' : 'Female'}</option>
                                        </Form.Select>
                                    </Form.Group>
                            </Form.Group>
                            
                            <Form.Group  className='row'>
                                <Form.Label >{setLanguage === 'TH' ? 'หมายเลขบัตรประชาชน' : 'ID crad or  Identity card'}</Form.Label>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="id_card" maxLength="13" placeholder={setLanguage === 'TH' ? 'หมายเลขบัตรประชาชน' : "ID card or Identity card" } pattern="\d*" required/>
                            </Form.Group>
                            

                        </Form.Group>

                        <Form.Group  className='col-sm-5 marginGroup'>
                            <Form.Label>{setLanguage === 'TH' ? 'ผู้รับรอง' : 'Guarantor'}</Form.Label>
                            <Form.Group className='row'>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="guarantor_english_fname" maxLength="30" placeholder={setLanguage === 'TH' ? 'ชื่อ (อังกฤษ)' : "English frist name" }pattern="^[a-zA-Z]+$"  required/>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="guarantor_english_lname" maxLength="30" placeholder={setLanguage === 'TH' ? 'นามสกุล (อังกฤษ)' : "English last name"} pattern="^[a-zA-Z]+$"  required/>
                            </Form.Group>
                            <Form.Group className='row mb-2'>
                                <Form.Label>{setLanguage === 'TH' ? 'เบอร์โทรผู้รับรอง' : 'Guarantor phone'}</Form.Label>
                                <Form.Control  className="form-control marginInput" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="guarantor_phone" maxLength="10" placeholder={setLanguage === 'TH' ? 'เบอร์โทรผู้รับรอง' : "Guarantor phone"} pattern="^[0-9]+$" required/>
                                <Form.Label>{setLanguage === 'TH' ? 'ที่อยู่ ผู้รับรอง (ุถ้ากรณีไม่มีเว้นช่องกรอกข้อมูลให้ว่าง)' : 'Guarantor Address ( Please empty input if not have )'}</Form.Label>
                            </Form.Group>
                            { 
                                Race === 'eu' ? 
                                <>
                                    <Form.Group>
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="Guarantor_StreetAddress"
                                            maxLength="100"
                                            placeholder={setLanguage === 'TH' ? 'ที่อยู่ถนน / เลขที่บ้าน' : 'Street Address / House Number'}
                                            pattern="^[a-zA-Z0-9]+$"
                                            required
                                        />
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="Guarantor_PostalCode"
                                            maxLength="10"
                                            placeholder={setLanguage === 'TH' ? 'รหัสไปรษณีย์' : 'Postal Code'}
                                            pattern="^[a-zA-Z0-9]+$"

                                        />
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="Guarantor_City"
                                            maxLength="50"
                                            placeholder={setLanguage === 'TH' ? 'เมือง / ตำบล' : 'City / Town'}
                                            pattern="^[a-zA-Z0-9]+$"

                                        />
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="Guarantor_State"
                                            maxLength="50"
                                            placeholder={setLanguage === 'TH' ? 'รัฐ / จังหวัด / ภูมิภาค (ถ้ามี)' : 'State / Province / Region (optional)'}
                                            pattern="^[a-zA-Z0-9]+$"
                                            
                                        />
                                        <Form.Control
                                            className="form-control marginInput col"
                                            type="text"
                                            name="Guarantor_Country"
                                            maxLength="50"
                                            placeholder={setLanguage === 'TH' ? 'ประเทศ' : 'Country'}
                                            pattern="^[a-zA-Z]+$"

                                        />
                                    </Form.Group>
                                </>
                            :
                                <>
                                    <Form.Group  className='row'>
                                        <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Guarantor_House_Number" maxLength="10"  placeholder={setLanguage === 'TH' ? 'บ้านเลขที่' : "House Number"} pattern={Race === 'eu' ? "^[a-zA-Z]+$":"[0-9]+$" } required/>
                                        <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Guarantor_Village" maxLength="4"  placeholder={setLanguage === 'TH' ? 'หมู่ที่' : "Village"} pattern='^[0-9]+$' required/>
                                        <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Guarantor_Street" maxLength="20"  placeholder={setLanguage === 'TH' ? 'ถนน' : "Street"} pattern="^[a-zA-Z]+$" required/>
                                    </Form.Group>
                                    <Form.Group  className='row'>
                                        <div className="col-6">
                                            <Form.Control placeholder={setLanguage === 'TH' ? 'ตําบล' : "Sub-district"} name='Guarantor_Sub_district'  className="form-control mb-3 " pattern="^[a-zA-Z]+$" />
                                        </div>
                                        <div className="col-6">
                                            <Form.Control placeholder={setLanguage === 'TH' ? 'อำเภอ' : "District"} name='Guarantor_District' className="form-control mb-3 " pattern="^[a-zA-Z]+$" />
                                        </div>
                                        <div className="col-6">
                                            <Form.Control placeholder={setLanguage === 'TH' ? 'จังหวัด' : "Province"} name='Guarantor_Province' className="form-control mb-3" pattern="^[a-zA-Z]+$" />
                                        </div>
                                        <div className="col-6">
                                        <Form.Control placeholder={setLanguage === 'TH' ? 'รหัสไปรษณีย์' : "Zip Code"} name='Guarantor_Zip_code'  className="form-control mb-3" pattern={Race === 'eu' ? "^[a-zA-Z]+$":"[0-9]+$" } />
                                        </div>
                                    </Form.Group>
                                </>
                            }
                            <Form.Label>{setLanguage === 'TH' ? 'อีเมลล์ & รหัสผ่าน' : 'Email & Password'}</Form.Label>
                            <Form.Group  className='row'>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="email" name="email" maxLength="30" minLength="8" placeholder={setLanguage === 'TH' ? 'อีเมลล์' : "Email"} required/>
                                <Form.Control  
                                    className={`form-control Input ${PasswordFail === false?'':'InputFlase-Register'} ${ShowinfoPassword === true?'':'marginInput'}`} 
                                    aria-label="Sizing example input" id="passwordHelpBlockInput"aria-describedby="passwordHelpBlock" type="password" name="password" placeholder={setLanguage === 'TH' ? 'รหัสผ่าน' : "Password"} required 
                                    onFocus={() => setShowinfoPassword(true)} onBlur={() => setShowinfoPassword(false)} 
                                />
                                    {
                                        ShowinfoPassword === true?
                                            PasswordFail === false ?
                                                <Form.Label id="passwordHelpBlock" className="form-text marginText fade-in Text-Register" >
                                                    {setLanguage === 'TH' ? 'คุณต้องกรอกรหัสผ่าน 8-20 ตัวอักษร ภาษาอังกฤษหรือตัวเลข และห้ามใช้ช่องว่างหรืออิโมจิ' : 'Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.'}
                                                </Form.Label>
                                                :
                                                <Form.Label id="passwordHelpBlock" className="form-text marginText TextFlase-Register fade-in">
                                                    {setLanguage === 'TH' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match. Please re-enter your password.'}
                                                </Form.Label>
                                        :
                                        <></>
                                    }
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="password" name="password_confirmation"  maxLength="30" minLength="8" placeholder={setLanguage === 'TH' ? 'ยืนยันรหัสผ่าน' : "Confirm Password"} required/>
                            </Form.Group>
                            <Form.Label>{setLanguage === 'TH' ? 'บัญชีธนาคาร' : "Payment"}</Form.Label>
                            <Form.Group  className='row'>                            
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="bank_id" maxLength="11" minLength="11" placeholder={setLanguage === 'TH' ? 'ไอดีบัญชีธนาคาร' : "Bank id" } pattern='^[0-9]+$'required/>
                                <Form.Select  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="bank_type" maxLength="30" minLength="1" placeholder={setLanguage === 'TH' ? 'ประเภทธนาคาร' : "Bank type"} required>
                                    <option value="" disabled>{setLanguage === 'TH' ? 'เลือกประเภทธนาคาร' : "Select Bank Type"}</option>
                                    <option value="SCB">SCB / ไทยพาณิชย์</option>
                                    <option value="KTB">KTB / กรุงไทย</option>
                                    <option value="BBL">BBL / กรุงเทพ</option>
                                    <option value="KBANK">KBANK / กสิกรไทย</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group  className='row'>
                                <Form.Label>{setLanguage === 'TH' ? 'ระดับวงเงิน' : "Financial statement"}</Form.Label>
                                <Form.Select  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="number" name="financial_statement"  max="999999" min="10000" placeholder={setLanguage === 'TH' ? 'ระดับวงเงิน' : "Financial statement"} required>
                                    <option value="" disabled>{setLanguage === 'TH' ? 'เลือกระดับวงเงิน' : "Select Financial statemen"}</option>
                                    <option value={10000}>Lower - 10,000</option>
                                    <option value={15000}>10,001 - 25,000</option>
                                    <option value={50000}>25,001 - 50,000</option>
                                    <option value={75000}>50,001 - 75,000</option>
                                    <option value={100000}>75,001 - Over</option>
                                </Form.Select>
                            </Form.Group>
                        </Form.Group>
                        <Form.Group className='d-flex align-items-center'>
                            <Form.Check  className="marginInput mb-3" aria-label="Checkbox for following terms and conditions" aria-describedby="inputGroup-sizing-default"  name="policy" required/>
                            <Form.Label className="marginText mb-2" >{setLanguage === 'TH' ? 'ฉันยอมรับกับ' : "I agree with"} <a href="#_" style={{color: '#343a40'}}>{setLanguage === 'TH' ? 'นโยบายการใช้งาน' : "Policy & Data private"}</a></Form.Label>
                        </Form.Group>
                    </Form.Group>
                    <Button variant="btn btn-success btn-submit-Register" type="submit" >
                        {setLanguage === 'TH' ? 'ตกลง' : "Submit"}
                    </Button>
                </Form>
        </>
    )
}







export default RegisterForm;
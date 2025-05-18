import axios from "axios";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";

function RegisterEmployee({handleClose , setWaiting , setLogin , setLanguage}) {
    const [PasswordFail, setPasswordFail] = useState(false)
    const [ShowinfoPassword , setShowinfoPassword ] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(event.target.password.value !== event.target.password_confirmation.value){
            setPasswordFail(false)
            setPasswordFail(true)
        }
        else{
            const formData = {
                id_card : event.target.id_card.value,
                thai_fname: event.target.Thai_fname.value,
                thai_lname: event.target.Thai_lname.value,
                english_fname: event.target.English_fname.value,
                english_lname: event.target.English_lname.value,
                address: event.target.address.value,
                birthday: event.target.birthday.value,
                religion: event.target.religion.value,
                sex: event.target.sex.value,
                age: parseInt(event.target.age.value),
                phone: event.target.phone.value,
                line_id: event.target.line_id.value,
                email: event.target.email.value,
                password: event.target.password.value,
                password_confirmation: event.target.password_confirmation.value,
                status: setLogin.status
            };

            console.log('Registration check:', formData);
            setWaiting(true)

            const token = JSON.parse(sessionStorage.getItem('token_id'));
            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/register/employee/${setLogin.id}`, formData,{ 
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  } 
                );
                if(response.data[422]){
                    alert('Registration Failled : '+response.data[422]);
                    setWaiting(false)
                }
                else if(response.data[401]){
                    alert('Registration Failled : '+response.data[401]);
                    setWaiting(false)
                    sessionStorage.removeItem('window')
                    window.location.reload();
                }
                else{
                    const image = response.data.image;
                    const image_src = 'data:image/jpeg;base64,' + image;
                    
                    sessionStorage.setItem('token',JSON.stringify(response.data.user))
                    sessionStorage.setItem('token_bank',JSON.stringify(response.data.bank))
                    sessionStorage.setItem('token_image',JSON.stringify(image_src))
                    setWaiting(false)
                    sessionStorage.removeItem('window')
                    console.log('Registration successful:', response.data);
                    window.location.reload(); // refresh window for back to home page
                }
    
                
            } catch (error) {
                setWaiting(false)
                alert('Registration Failled : Server is broken register later. ');
                console.error('Registration error:', error.response.data);
                
            }
        }
    };

    return(
        <>
           <Form onSubmit={handleSubmit} className="container">
                    <Form.Group  className='row'>
                        <Form.Group  className='col-6'>
                            <Form.Label>{setLanguage === 'TH' ? 'ชื่อ - นามสกุล' : 'Name'}</Form.Label>
                            <Form.Group  className='row'>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Thai_fname" maxLength="30"  placeholder={setLanguage === 'TH' ? "ชื่อ (ไทย)" : 'Thai frist Name'} pattern="[\u0E00-\u0E7F\s]+"  required/>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Thai_lname" maxLength="30" placeholder={setLanguage === 'TH' ? "นามสกุล (ไทย)" : 'Thai last Name'} pattern="[\u0E00-\u0E7F\s]+"  required/>
                            </Form.Group>
                            <Form.Group  className='row'>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="English_fname" maxLength="30"  placeholder={setLanguage === 'TH' ? 'ชื่อ (อังกฤษ)' : "English Frist Name"} pattern="^[a-zA-Z]+$" required/>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="English_lname" maxLength="30" placeholder={setLanguage === 'TH' ? 'นามสกุล (อังกฤษ)' : "English Last Name" }pattern="^[a-zA-Z]+$" required/>
                            </Form.Group>
                            <Form.Group  className='row'>
                                <Form.Label>{setLanguage === 'TH' ? 'ที่อยู่' : 'Address'}</Form.Label>
                                <textarea  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="address" maxLength="255" placeholder={setLanguage === 'TH' ? 'กรอกที่อยู่' : "Input Address"} required></textarea>
                            </Form.Group>
                            <Form.Label>{setLanguage === 'TH' ? 'รายละเอียด' : 'Detail'}</Form.Label>
                            <Form.Group  className='row'>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="date" name="birthday" placeholder={setLanguage === 'TH' ? 'วันเกิด' : "Birthday"} required/>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="number" name="age" max="100" min="1" placeholder={setLanguage === 'TH' ? 'อายุ' : "Age"} required/>
                            </Form.Group>
                            <Form.Group  className='row'>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="phone"  maxLength="10" placeholder={setLanguage === 'TH' ? 'เบอร์โทร' : "Phone"} required/>
                                <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="line_id" placeholder={setLanguage === 'TH' ? 'ไลน์ไอดี' : "Line_id" }maxLength="10" minLength="1" required/>
                                <Form.Control  className="form-control marginInput " aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="id_card" maxLength="13" placeholder={setLanguage === 'TH' ? 'หมายเลขบัตรประชาชน' : "ID crad or  Identity card" }required/>
                                <Form.Select  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="sex" maxLength="10" placeholder={setLanguage === 'TH' ? 'เพศ' : "Sex"} required>
                                    <option value="" disabled>{setLanguage === 'TH' ? 'เลือกเพศ' : 'Select Sex'}</option>
                                    <option value="Male">{setLanguage === 'TH' ? 'ชาย' : 'Male'}</option>
                                    <option value="Female">{setLanguage === 'TH' ? 'หญิง' : 'Female'}</option>
                                </Form.Select>
                                <Form.Control  className="form-control marginInput " aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="religion" maxLength="10" placeholder={setLanguage === 'TH' ? 'ศาสนา' : "Religion"} required/>
                            </Form.Group>
                        </Form.Group>

                        <Form.Group  className='col-sm-5 marginGroup'>
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
                          </Form.Group>
                    </Form.Group>
                    <Button variant="btn btn-warning btn-close-Register" onClick={handleClose}>
                        {setLanguage === 'TH' ? 'ยกเลิก' : 'Close'}
                    </Button>
                    <Button variant="btn btn-success btn-submit-Register" type="submit" style={{margin: 10}}>
                        {setLanguage === 'TH' ? 'ตกลง' : 'Submit'}
                    </Button>
                </Form>
        </>
    )
}





export default RegisterEmployee;
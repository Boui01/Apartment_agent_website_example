import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import './Profile.css'
import axios from "axios";
import HistoryForm from "../History/History";
import DetectText from "../../../Function/DetectText";
import FormateID from "../../../Function/FormatID";
import DeleteText from "../../../Function/DeleteText";
import { useNavigate } from "react-router-dom";


function ProfileForm ({ setLogin , setState , outState , setLanguage }) {
    const [history , setHistory] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if(setState === 'reservation'){
            setHistory(true)
        }
    },[setState])

    return(
        <>
            <video autoPlay loop muted className="videoBackground">
                <source src="..\Video\Profile.mp4" type="video/mp4"  />
            </video>     
            {!history ?
                <>
                    <Modal show={true} className="Modal_Profile">
                        <Modal.Header>
                            <Button type="button" className="btn btn-success" onClick={() => navigate('/')}>{ setLanguage === 'TH' ? 'กลับ' : 'Back'}</Button>
                        </Modal.Header>
                        <Modal.Body>
                            <Profile setLogin={setLogin} outHistory={() => setHistory(true)} setLanguage={setLanguage}/>
                        </Modal.Body>
                    </Modal>
                </>
                :
                <>
                    <HistoryForm setLogin={setLogin} outPage={setHistory} setState={setState} outState={outState} setLanguage={setLanguage}/>
                </>                
            }
        </>
    )
}
function Profile( { setLogin , outHistory , setLanguage } ) {
    const [Click , setClick ] = useState('')
    const [Popup , setPopup] = useState(false)
    const [refresh , setRefresh] = useState(0)
    const [User , setUser] = useState(sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem("token")) : setLogin)
    const [session_image, setSession_image] = useState(sessionStorage.getItem('token_image') ? JSON.parse(sessionStorage.getItem('token_image')) : '')
    const [session_bank, setSession_bank] = useState(sessionStorage.getItem('token_bank') ? JSON.parse(sessionStorage.getItem('token_bank')) : '')
 
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('success!')
    }
    const handleEdite = (position) => {
        setClick(position)
        setPopup(true)
        console.log('Position : ' , position)
    }
    const handelHistory = () => {
        outHistory()
    }


    useEffect(() => {
        if( refresh === 'image'){
            setSession_image(sessionStorage.getItem('token_image') ? JSON.parse(sessionStorage.getItem('token_image')) : '')
        }
        if( refresh === 'bank'){
            setSession_bank(sessionStorage.getItem('token_bank') ? JSON.parse(sessionStorage.getItem('token_bank')) : '')
        }
        else{
            setUser(sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem("token")) : setLogin);
        }
        setRefresh()
    },[refresh ,setLogin])

    
    return(
        <Form onSubmit={handleSubmit}>
            <div>
                <div className="block-image-Profile">
                    <img src={session_image} className="Image_Profile" alt="..."/>
                    <div className="block-edite-img"  onClick={() => handleEdite(["image" , ''])}>
                        <img src="/Icon/edite.svg" className="Button-Edite-img" alt="..."/>
                    </div>
                </div>
                <h5 className="fw-light" style={{textAlign:"center"}}>{User.status}</h5>
                { User.status === 'user' ?
                    <div className="row align-items-start">
                        <div className="col-sm-6">
                            <h2 className="HeadText-Profile">{ setLanguage === "TH" ? "โปรไฟล์" : "Profile"}</h2>
                            <div className="ContentText">
                                <div className="row align-items-start">
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "ชื่อ(อังกฤษ)" : "Frist Name"}</label>
                                        <p className="text-user"> 
                                            {User.fname}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["english_fname" , User.fname])} alt="..."/>
                                        </p>
                                    </div>
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "นามสกุล(อังกฤษ)" : "Last Name"}</label>
                                        <p className="text-user"> 
                                            {User.lname}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["english_lname" , User.lname])} alt="..."/>
                                        </p>
                                    </div>
                                </div>
                                <div className="row align-items-start">
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "ไลน์" : "Line ID"}</label>
                                        <p className="text-user"> 
                                            {User.line_id}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["line_id" , User.line_id])} alt="..."/>
                                        </p>
                                    </div>
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "เบอร์โทร" : "Phone"}</label>
                                        <p className="text-user">
                                            {FormateID(User.phone)}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["phone" , User.phone])} alt="..."/>
                                        </p>
                                    </div>
                                </div>
                                <div className="row align-items-start">
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "ศาสนา" : "Religion"}</label>
                                        <p className="text-user">
                                            {User.religion}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["religion" , User.religion])} alt="..."/>
                                        </p>
                                    </div>
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "เพศ" : "Sex"}</label>
                                        <p className="text-user">
                                            { setLanguage === "TH" ? User.sex === "Male" ? "ชาย" : "หญิง" : User.sex}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["sex" , User.sex])} alt="..."/>
                                        </p>
                                    </div>

                                </div>
                                <div className="row align-items-start">
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "วันเกิด" : "Birthday"}</label>
                                        <p className="text-user"> 
                                            {User.birthday.toLocaleString()}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["birthday" , User.birthday.toLocaleString()])} alt="..."/>
                                        </p>
                                    </div>
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "อายุ" : "Age"}</label>
                                        <p className="text-user"> 
                                            {User.age}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["age" , User.age])} alt="..."/>
                                        </p>
                                    </div>
                                </div>
                                <div className="row align-items-start">
                                    <div className="col-11">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "ที่อยู่" : "Address"}</label>
                                        <p className="text-user-address"> 
                                            {User.address}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["address" , User.address])} alt="..."/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div> 


                        <div className="col-sm-6">
                            <div className="ContentText">
                                <h2 className="fw-semibold HeadText-Profile-secondary">{ setLanguage === "TH" ? "ชําระเงิน" : "Payment"}</h2>
                                <div className="row align-items-start">
                                    <div className={ setLanguage === "TH" ? "col-6" : "col-7"}>
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "เลขบัญชีธนาคาร" : "Bank id"}</label>
                                        <p className="text-user">
                                            {FormateID(session_bank.id_bank)}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["id_bank", session_bank.id_bank ])} alt="..."/>
                                        </p>
                                    </div>
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "ประเภทธนาคาร" : "Bank type"}</label>
                                        <p className="text-user">
                                            {session_bank.type}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["type" , session_bank.type ])} alt="..."/>
                                        </p>
                                    </div>
                                </div>
                                <div className="row align-items-start">
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "ระดับวงเงิน" : "Financial statement"}</label>
                                        <p className="text-user">
                                            { (User.financial_statement-25000) <= 0 ? 'Lower' : User.financial_statement >= 75001 ? 
                                                (75000).toLocaleString() :(User.financial_statement-25000).toLocaleString()+ ' ' } 
                                            -  
                                            {' ' + User.financial_statement >= 75001 ? 'Over' : User.financial_statement <=10000 ? 
                                                (10000).toLocaleString() : User.financial_statement.toLocaleString()}
                                            
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["financial_statement" , User.financial_statement ])} alt="..."/>
                                        </p>
                                    </div>
                                </div>
                                <h2 className="HeadText-Profile-secondary">{ setLanguage === "TH" ? "บุคคลรับรอง" : "Guarantor"}</h2>
                                <div className="row align-items-start">
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "ชื่อ" : "Frist Name"}</label>
                                        <p className="text-user">
                                            {User.guarantor_english_fname}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["guarantor_english_fname" , User.guarantor_english_fname ])} alt="..."/>
                                        </p>
                                    </div>
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "นามสกุล" : "Last Name"}</label>
                                        <p className="text-user">
                                            {User.guarantor_english_lname}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["guarantor_english_lname" , User.guarantor_english_lname ])} alt="..."/>
                                        </p>
                                    </div>
                                </div>
                                <div className="row align-items-start">
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "ที่อยู่" : "Address"}</label>
                                        <p className="text-user-address">
                                            {User.guarantor_address}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["guarantor_address" , User.guarantor_address])} alt="..."/>
                                        </p>
                                    </div>
                                    <div className="col">
                                        <label className="fw-semibold">{ setLanguage === "TH" ? "เบอร์โทร" : "Phone"}</label>
                                        <p className="text-user">
                                            {FormateID(User.guarantor_phone)}
                                            <img src="/Icon/edite.svg" className="Button-Edite" onClick={() => handleEdite(["guarantor_phone" , User.guarantor_phone])} alt="..."/>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <></>
                }
                <div className="row align-items-start">
                    <div className="col ps-sm-5" style={{margin: '1% 0%'}}>
                        <Button onClick={handelHistory} className="btn btn-warning custom-history-Profile">{ setLanguage === "TH" ? "ประวัติ" : "History"}</Button>  
                    </div>  
                </div>  
            </div>
            <PopupEditeProfile setShow={Popup} outShow={() => setPopup(false)} position={Click} setLogin={User} setRefresh={setRefresh} setLanguage={setLanguage}/>
        </Form>
                    
    )
}

function PopupEditeProfile ({setShow , outShow , position , setLogin , setRefresh , setLanguage}) {
    const [EditeValue , setEdteValue] = useState(position[1])

    const handleConfirm = async (e) => {
        e.preventDefault()
        const token = JSON.parse(sessionStorage.getItem('token_id'))

        if(position[0] === 'image'){
                const formData = new FormData();
                formData.append('image', EditeValue);
                formData.append('position', 'user');
                
                axios.post(`http://127.0.0.1:8000/api/image/upload/${setLogin.id}`,formData,{
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }) 
                .then(response => {
                    console.log('Image uploaded successfully:', response.data);
                    // convert image to show 
                    const image = response.data.image;
                    const image_src = 'data:image/jpeg;base64,' + image;

                    sessionStorage.setItem('token_image', JSON.stringify(image_src));
                    setRefresh('image')
                  })
                .catch(error => {
                console.log('Error uploading image:', error);
                });
                outShow()
        }
        else if(position[0] === 'id_bank' || position[0] === 'type'){
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/bank/${setLogin.id}`,{position : position[0],value : EditeValue },{
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  }             
                ); 
                sessionStorage.setItem('token_bank', JSON.stringify(response.data.bank));
                console.log('Edite Success :', response.data); 
                outShow() 
                setEdteValue('')
                setRefresh('bank')          
            }
            catch (error) {              
                console.error('Error:', error);
            }
        }
        else{
            try {
                const response = await axios.put(`http://127.0.0.1:8000/api/user/${setLogin.id}`,{position : position[0],value : EditeValue}, 
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      }
                    }
                ); 
                if (response.data[422]) {
                    alert( setLanguage === 'TH' ? 'ไม่สามารถแก้ไขข้อมูลได้' : 'Data can not updated!')
                    console.log('Error data can not updated : ' , response.data)
                }
                else{
                    sessionStorage.setItem('token', JSON.stringify(response.data.data));
                    console.log('Edite Success :', response.data); 
                    outShow() 
                    setEdteValue('')
                    setRefresh('default') 
                }         
            }
            catch (error) {              
                console.error('Error:', error);
            }
        }
    }


    const handeleEdite = (e) => {
        if(position[0] === 'image'){
            const file = e.target.files[0];
            const maxSize = 65535; // 1 MB in bytes
        
            if (file && file.size > maxSize) {
                alert('File size exceeds the limit of 1 MB');
                setEdteValue();
            } else {
                setEdteValue(file)
            }
        }
        else if(position[0] === 'financial_statement' || position[0] === 'age'){
            setEdteValue(parseInt(e.target.value))
        }
        else if(position[0] === 'id_bank' || position[0] === 'phone' || position[0] === 'guarantor_phone'){
            setEdteValue(DeleteText(e.target.value , '-' , ''))
        }
        else{
            setEdteValue(e.target.value)
        }
        console.log('Edite value : ' , EditeValue)
        
    }




    return(
        <Modal show = {setShow} onHide={outShow} className="Modal-Popup">
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleConfirm}>
                    <Form.Label>{
                        setLanguage === 'TH' 
                            ? (
                            position[0] === 'image' ? 'อัพโหลดรูปภาพ' :
                            position[0] === 'english_fname' ? 'แก้ไข ชื่อ(อังกฤษ)' :
                            position[0] === 'english_lname' ? 'แก้ไข นามสกุล(อังกฤษ)' :
                            position[0] === 'line_id' ? 'แก้ไขไลน์' :
                            position[0] === 'phone' ? 'แก้ไขเบอร์โทร' :
                            position[0] === 'religion' ? 'แก้ไขศาสนา' :
                            position[0] === 'sex' ? 'แก้ไขเพศ' :
                            position[0] === 'birthday' ? 'แก้ไขวันเกิด' :
                            position[0] === 'age' ? 'แก้ไขอายุ' :
                            position[0] === 'address' ? 'แก้ไขที่อยู่' :
                            position[0] === 'id_bank' ? 'แก้ไขเลขบัญชีธนาคาร' :
                            position[0] === 'type' ? 'แก้ไขประเภทธนาคาร' :
                            position[0] === 'financial_statement' ? 'แก้ไขระดับวงเงิน' :
                            position[0] === 'guarantor_english_fname' ? 'แก้ไขชื่อผู้รับรอง (อังกฤษ)' :
                            position[0] === 'guarantor_english_lname' ? 'แก้ไขนามสกุลผู้รับรอง (อังกฤษ)' :
                            position[0] === 'guarantor_address' ? 'แก้ไขที่อยู่ผู้รับรอง' :
                            position[0] === 'guarantor_phone' ? 'แก้ไขเบอร์โทรผู้รับรอง' :
                            'ค่าปริยายภาษาไทย'  // Default for Thai
                            )
                            : (
                            position[0] === 'image' ? 'Upload Image' :
                            position[0] === 'english_fname' ? 'Edit English First Name' :
                            position[0] === 'english_lname' ? 'Edit English Last Name' :
                            position[0] === 'line_id' ? 'Edit Line ID' :
                            position[0] === 'phone' ? 'Edit Phone Number' :
                            position[0] === 'religion' ? 'Edit Religion' :
                            position[0] === 'sex' ? 'Edit Gender' :
                            position[0] === 'birthday' ? 'Edit Birthday' :
                            position[0] === 'age' ? 'Edit Age' :
                            position[0] === 'address' ? 'Edit Address' :
                            position[0] === 'id_bank' ? 'Edit Bank Account Number' :
                            position[0] === 'type' ? 'Edit Bank Type' :
                            position[0] === 'financial_statement' ? 'Edit Financial Statement' :
                            position[0] === 'guarantor_english_fname' ? 'Edit Guarantor English First Name' :
                            position[0] === 'guarantor_english_lname' ? 'Edit Guarantor English Last Name' :
                            position[0] === 'guarantor_address' ? 'Edit Guarantor Address' :
                            position[0] === 'guarantor_phone' ? 'Edit Guarantor Phone Number' :
                            'Default English'  // Default for English
                            )
                        }

                    </Form.Label>
                    {position[0] === 'age' ? 
                        <Form.Control defaultValue={position[1]} type="number" max="100" min="1" name="text" onChange={handeleEdite} required></Form.Control>
                    : position[0] === 'financial_statement' ?
                        <Form.Select defaultValue={position[1]} className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="number" name="financial_statement"  max="999999" min="10000" onChange={handeleEdite} value={EditeValue} placeholder="Financial statement" required>
                            <option value="" disabled>{ setLanguage === 'TH' ? "เลือกระดับการเงิน" :'Select Financial statemen' }</option>
                            <option value={10000}>{ setLanguage === 'TH' ? "ต่ำ - 10,000" :'Lower - 10,000' }</option>
                            <option value={15000}>10,001 - 25,000</option>
                            <option value={50000}>25,001 - 50,000</option>
                            <option value={75000}>50,001 - 75,000</option>
                            <option value={100000}>{ setLanguage === 'TH' ? "75,001 - สูง" :'75,001 - Over' }</option>
                        </Form.Select>
                    : position[0] === 'image' ?
                        <Form.Control defaultValue={position[1]} type="file" onChange={handeleEdite} required></Form.Control>
                    : position[0] === 'id_bank' ?
                        <Form.Control defaultValue={position[1]} type="text" maxLength="11" minLength="11" onChange={handeleEdite} value={EditeValue} required></Form.Control>
                    : position[0] === 'type' ?
                        <Form.Select  defaultValue={position[1]} className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="bank_type" maxLength="30" minLength="1" placeholder="Bank_type" onChange={handeleEdite} value={EditeValue} required>
                            <option value="" disabled>{ setLanguage === 'TH' ? "เลือกประเภทบัญชี" :'Select Bank Type' }</option>
                            <option value="SCB">SCB / ไทยพาณิชย์</option>
                            <option value="KTB">KTB / กรุงไทย</option>
                            <option value="BBL">BBL / กรุงเทพ</option>
                            <option value="KBANK">KBANK / กสิกรไทย</option>
                        </Form.Select>
                    : position[0] === 'birthday' ?
                        <Form.Control type="date" defaultValue={position[1]} onChange={handeleEdite} required></Form.Control>
                    : position[0] === 'sex' ?
                        <Form.Select defaultValue={position[1]}  onChange={handeleEdite} required>
                            <option value="" disabled>{ setLanguage === 'TH' ? "เลือกเพศ" :'Select sex' }</option>
                            <option value="male">{ setLanguage === 'TH' ? "ชาย" :'Male' }</option>
                            <option value="female">{ setLanguage === 'TH' ? "หญิง" :'Female' }</option>
                        </Form.Select>
                    : position[0] === 'english_fname' || position[0] === 'english_lname' || position[0] === 'guarantor_english_fname' || position[0] === 'guarantor_english_lname' ?
                        <Form.Control name="text" defaultValue={position[1]} onChange={handeleEdite}   maxLength="30" pattern="[a-zA-Z]+$" required></Form.Control>
                    : DetectText([position[0]],'phone',2) ?
                        <Form.Control name="text" defaultValue={position[1]} onChange={handeleEdite} value={EditeValue} maxLength="10" minLength="10" required></Form.Control>
                    :
                        <Form.Control defaultValue={position[1]}  onChange={handeleEdite}  maxLength="255" pattern="^[a-zA-Z0-9]+$" required></Form.Control>                    
                    }

                    <Button type="button" className="btn btn-secondary Button-Popup" onClick={() => outShow()}>{ setLanguage === 'TH' ? "ยกเลิก" :'Close' }</Button>
                    <Button type="submit" className="btn btn-warning Button-Popup">{ setLanguage === 'TH' ? "ตกลง" :'Confirm' }</Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
export default ProfileForm;
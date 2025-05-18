import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import './ApartmentAdd.css'
import React from 'react'
import PopupSuccess from '../../PopupSuccess/PopupSuccess';

function ApartmentAddForm({ setLogin, setStatus , setLanguage }) {
    const [showModal, setShowModal] = useState(false);

    const handleAdd = (e) => {
        e.preventDefault();
        setShowModal(true);
    }
    return (
        <>
            <form onSubmit={handleAdd} className="col-2 block-btn-plus-Apartment-Add">
                <button type="submit" className="custom-btn-plus-Apartment-Add animation-btn-plus-Apartment-Add" >
                    <img src='.\Icon\plus-circle.svg' className="img-btn-plus-Apartment-Add" alt="..."/>
                </button>
            </form>
            <ApartmentAdd setShowModal={showModal} outShowModal={() => setShowModal(false)} setLogin={setLogin} setStatus={setStatus} setLanguage={setLanguage}/>
        </>
    )
}


function ApartmentAdd({ setShowModal, outShowModal, setLogin, setStatus , setLanguage }) {
    const [stateAdd, setStateAdd] = useState( (setLogin === 'admin' || setLogin === 'employee') ? 'Service' : 'Apartment');
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin ? setLogin : null;
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''
    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const [ModalSuccessMessage, setModalSuccessMessage] = useState('');
    const [service, setService] = useState([])
    const [dataService,setDataService] = useState([
            'Free filtered water',
            'Gym',
            'Swimming Pool',
            'Parking', 
            'Free Laundry', 
            'Free Internet', 
            'Parcel Delivery', 
            'Shuttle Service', 
            'Community Activities',
            'Recreation Areas',
            'Co-working Spaces'

    ])

    useEffect(() => {
        const freshdata = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/services`);
                setDataService(response.data.data);
            }
            catch (error) {
                console.error('There was an error!', error);
            }
        }
        freshdata();
    },[service])

    // console.log('Edite value : ',service)
    const handleSubmit = async (event) => {
        event.preventDefault();

        if( stateAdd === 'Apartment'){

            if( event.target.image.files[0].size > 65535){
                alert( setLanguage === "TH" ? "ไฟล์รูปภาพมีขนาดใหญ่เกินไป ควรมีขนาดไม่เกิน 1 MB" : 'Please choose other image| You size image it over 1 MB')  
            }
            else{
                const list = {
                    card_id: Login.id,
                    name: event.target.name.value,
                    thai_name: event.target.thai_name.value,
                    address:   event.target.House_number.value+' '+'moo.'+ event.target.Village.value + ' district.'  + event.target.district.value + ' subdistrict.'+ event.target.subdistrict.value + ' street.' + event.target.Street.value + 'province. ' + event.target.province.value + ' zipcode.' + event.target.postalCode.value,
                    service: service,
                    description: event.target.description.value,
                    thai_description: event.target.thai_description.value,
                    bedroom: parseInt(event.target.bedroom.value),
                    bathroom: parseInt(event.target.bathroom.value),
                    total_room: parseInt(event.target.total_room.value),
                    pet: parseInt(event.target.pet.value),
                    rule: event.target.rule.value,
                    score: 0,
                    price: parseInt(event.target.price.value),
                }

                const formData = new FormData();
                formData.append('image', event.target.image.files[0]);
                formData.append('position', 'apartment');
                outShowModal();


                // Data Apartment
                try {
                    if (list && list.card_id !== null) {
                        console.log('Data sent : ', list)
                        const response = await axios.post(`http://127.0.0.1:8000/api/data/`, list,{ 
                            headers: {
                              Authorization: `Bearer ${token}`,
                            }
                          } 
                        )
                        if (response.data[402] !== undefined) {
                            alert( setLanguage === 'TH' ? 'ข้อมูลไม่สำเร็จ โปรดลองใหม่อีกครั้ง' : "Data can't add!")
                            setService([])
                        }
                        else {
                            // Image Apartments
                            axios.post(`http://127.0.0.1:8000/api/image/upload/${response.data.data.id_apartment}`,formData,{
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'multipart/form-data',
                                },
                            }) 
                            .then(response2 => {
                                setShowModalSuccess(true)
                                setModalSuccessMessage(setLanguage === 'TH' ? 'ข้อมูลเพิ่มสำเร็จ โปรดรออนุมัติจากผู้ดูแล.' : 'Data add success, Plase wait admin approve.')
                                console.log('Data sent : ', response.data.data,'Image uploaded successfully:', response2.data)
                                setService([])
                            })
                            .catch(error => {
                                console.log('Error uploading image:', error);
                            });

                        }

                    }
                }
                catch (error) {
                    console.error('There was an error!', error);
                }

            }
        }

        else if (stateAdd === 'Service'){
            const list = {
                name : event.target.sname.value ,
                thai_name : event.target.sTname.value
            }
            outShowModal();

            try {
                if (list) {
                    console.log('Data sent : ', list)
                    const response = await axios.post(`http://127.0.0.1:8000/api/service`,{list : list , status_user : Login.status},{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    if (response.data[402] !== undefined) {
                        alert("Data can't add!")
                        setService([])
                    }
                    else {
                        alert('Data add success!')
                        console.log('Data sent : ', response.data)
                        setService([])
                        setStatus(true)
                    }

                }
            }
            catch (error) {
                console.error('There was an error!', error);
            }
        }
    }

    const handleService = (value) => {
        setService((prev) => {
            const prev_filter = prev.filter(p => p !== value)
            const check = prev.findIndex(p => p === value)
            return check === -1 ? [...prev,value] : prev_filter
        })
        console.log("service check : ", service,value)
    }

    const handleTextChange = (event , type) => {
        const val = event.target.value

        if(type === 'en'){
            const check = /^[a-zA-Z\s]+$/.test(val)
            if(check){
                event.target.value = val
            }
            else if(!check && val !== ''){
                alert(`${setLanguage === 'TH' ? 'กรุณาใส่ภาษาอังกฤษ' : 'Please enter English language'}`)
                event.target.value = event.target.value.slice(0, -1)
            }
        }
        else if(type === 'th'){
            const check = /^[\u0E00-\u0E7F\s]+$/.test(val)
            if(check){
                event.target.value = val
            }
            else if(!check  && val !== ''){
                alert(`${setLanguage === 'TH' ? 'กรุณาใส่ภาษาไทย' : 'Please enter Thai language'}`)
                event.target.value = event.target.value.slice(0, -1)
            }
        }

    }


    return (
        <>
        <Modal show={setShowModal} onHide={outShowModal} className="modal-main">
            <ModalHeader className="modal-header">
                <Button className={`${ stateAdd === 'Apartment' ? 'btn-warning custom-btn-Apartment-Add-checked animation-btn-Apartment-Add-Right' : 'custom-btn-Apartment-Add' }`} onClick={() => setStateAdd('Apartment')}>{setLanguage === 'TH' ? 'อพาร์ทเมนท์' : 'Apartment'} </Button>
                {Login.status === 'employee' || Login.status === 'admin' ? 
                    <Button className={`${stateAdd === 'Service' ? 'btn-warning custom-btn-Apartment-Add-checked animation-btn-Apartment-Add-Right' :  '  custom-btn-Apartment-Add'}`} onClick={() => setStateAdd('Service')}>{setLanguage === 'TH' ? 'บริการ' : 'Service'}</Button>
                :
                    <></>
                }
                </ModalHeader>
            <ModalBody>
                <Form onSubmit={handleSubmit}>
                    {stateAdd === 'Apartment' ? 
                        <Form.Group  className="row">
                            <Form.Group className="col">
                                <Form.Label>{setLanguage === 'TH' ? 'ชื่อ (ภาษาอังกฤษ)' : 'Name'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="name" placeholder={setLanguage === 'TH' ? 'ชื่อ อพาร์ทเม้นท์ (ภาษาอังกฤษ)' : 'Enter English Name'} pattern="^[a-zA-Z\s]+$" onChange={(event) => handleTextChange(event , 'en')} required /> 
                                <Form.Label>{setLanguage === 'TH' ? 'ชื่อ (ภาษาไทย)' : 'Thai Name'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="thai_name" placeholder={setLanguage === 'TH' ? 'ชื่อ อพาร์ทเม้นท์ (ภาษาไทย)' : 'Enter Thai Name'} pattern="[\u0E00-\u0E7F\s]+" onChange={(event) => handleTextChange(event , 'th')} required />                              
                                <Form.Label>{setLanguage === 'TH' ? 'บริการ' : 'Service'}</Form.Label>
                                <div className={`row ${setLanguage === 'TH' ? "row-cols-2" : "row-cols-3"} `}>
                                    { dataService.map((item, index) => (
                                        <Button type="button" key={index}  className={`btn btn-${!service.includes(index+1) ? 'outline-warning btn-service-off ' : 'warning btn-service-on'} col`} onClick={() => handleService(item.id_service)}>{setLanguage === 'TH' ? item.thai_name : item.name}</Button>
                                        )
                                    )
                                    }
                                </div>
                                <Form.Label>{setLanguage === 'TH' ? 'รายละเอียด (ภาษาอังกฤษ)' : 'Description'}</Form.Label>
                                <Form.Control as="textarea" className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="description"  maxLength={255} minLength={1}  placeholder={setLanguage === 'TH' ? 'กรอกข้อมูลรายละเอียดเพิ่มเติม (  ภาษาอังกฤษ )' : "Enter Description ( english )"} pattern="^[a-zA-Z\s]+$" onChange={(e) => handleTextChange(e, "en")}  required />
                                <Form.Label>{setLanguage === 'TH' ? 'รายละเอียด (ภาษาไทย)' : 'Thai Description'}</Form.Label>
                                <Form.Control as="textarea" className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="thai_description"  maxLength={255} minLength={1}  placeholder={setLanguage === 'TH' ? 'กรอกข้อมูลรายละเอียดเพิ่มเติม ( ภาษาไทย  )' : "Enter Description ( thai )"} pattern="[\u0E00-\u0E7F\s]+" onChange={(e) => handleTextChange(e, "th")}  required />
                                <Form.Label>{setLanguage === 'TH' ? 'กฎ' : 'Rule'}</Form.Label>
                                <Form.Label style={{color : 'red' , fontSize : '14px' , marginLeft : '5px'}}>*{ setLanguage === 'TH' ? 'กรอกกฎเพิ่มเติมเป็นภาษาอังกฤษ' : 'Please fill the form rule is english language only.'}</Form.Label>
                                <Form.Control as="textarea" className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="rule" maxLength={255} minLength={1}  placeholder={setLanguage === 'TH' ? 'กรอกกฎเพิ่มเติม' : "Enter Rule Special"} pattern="^[a-zA-Z\s]+$"  onChange={(e) => handleTextChange(e, "en")} required />
                            </Form.Group>
                            <Form.Group className="col">
                                <Form.Label>{setLanguage === 'TH' ? 'ที่อยู่' : 'Address'}</Form.Label>
                                <Form.Group  className='row ' style={{marginLeft : '0px'}}>
                                    <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="House_number" maxLength="10"  placeholder={setLanguage === 'TH' ? 'บ้านเลขที่' : "House Number"} pattern="^[0-9]+\/?[0-9]*$" required/>
                                    <Form.Control  className="form-control marginInput col" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Village" maxLength="4"  placeholder={setLanguage === 'TH' ? 'หมู่ที่' : "Village"} pattern="^[0-9]+$" required/>
                                    <Form.Control className="form-control marginInput col" placeholder={setLanguage === 'TH' ? 'รหัสไปรษณีย์' : "Zip Code"}  pattern="^[0-9]+$" required name="postalCode"/>                                
                                </Form.Group>   
                                <Form.Group   style={{marginLeft : '0px'}}>
                                
                                    <Form.Label >{ setLanguage === 'TH' ? 'ถนน' : 'Street'}</Form.Label>   
                                    <Form.Label style={{color : 'red' , fontSize : '14px' , marginLeft : '5px'}}>*{ setLanguage === 'TH' ? 'กรอกถนนเป็นภาษาอังกฤษ' : 'Please fill the form street only english.'}</Form.Label>
                                    <Form.Control  className="form-control marginInput mb-3 col-2" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="Street" maxLength="20"  placeholder={setLanguage === 'TH' ? 'ถนน' : "Street"} pattern="^[a-zA-Z\s]+$" onChange={(e) => handleTextChange(e, "en")} required/>                                    
                                    
                                    <Form.Label >{ setLanguage === 'TH' ? 'ตำบล' : 'Sub-district'}</Form.Label>
                                    <Form.Label style={{color : 'red' , fontSize : '14px' , marginLeft : '5px'}}>*{ setLanguage === 'TH' ? 'กรอกตําบลเป็นภาษาอังกฤษ' : 'Please fill the form sub-district only english.'}</Form.Label>                                  
                                    <Form.Control className="col-6 form-control mb-3 "  placeholder={setLanguage === 'TH' ? 'ตําบล' : "Sub-district"} pattern="^[a-zA-Z\s]+$" onChange={(e) => handleTextChange(e, "en")} required name="subdistrict"/>                             
                                    
                                    <Form.Label >{ setLanguage === 'TH' ? 'อำเภอ' : 'District'}</Form.Label>
                                    <Form.Label style={{color : 'red' , fontSize : '14px' , marginLeft : '5px'}}>*{ setLanguage === 'TH' ? 'กรอกอำเภอเป็นภาษาอังกฤษ' : 'Please fill the form district only english.'}</Form.Label>
                                    <Form.Control className="form-control mb-3 col-6"  placeholder={setLanguage === 'TH' ? 'อำเภอ' : "District"} pattern="^[a-zA-Z\s]+$" onChange={(e) => handleTextChange(e, "en")} required name="district"/>                                   
                                    
                                    <Form.Label >{ setLanguage === 'TH' ? 'จังหวัด' : 'Province'}</Form.Label>
                                    <Form.Label style={{color : 'red' , fontSize : '14px' , marginLeft : '5px'}}>*{ setLanguage === 'TH' ? 'กรอกจังหวัดเป็นภาษาอังกฤษ' : 'Please fill the form province only english.'}</Form.Label>
                                    <Form.Control className="form-control mb-3 col-6" placeholder={setLanguage === 'TH' ? 'จังหวัด' : "Province"} pattern="^[a-zA-Z\s]+$" onChange={(e) => handleTextChange(e, "en")} required name="province"/>                                    
                                </Form.Group>    
 

                                <Form.Label>{setLanguage === 'TH' ? 'จำนวนห้องนอน' : 'Bedroom'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="number" name="bedroom" max={10} min={1} placeholder={setLanguage === 'TH' ? 'กรอกจำนวนห้องนอน' : "Enter Bedroom" }  required />
                                <Form.Label>{setLanguage === 'TH' ? 'จำนวนห้องน้ำ' : 'Bathroom'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="number" name="bathroom" max={10} min={1} placeholder={setLanguage === 'TH' ? 'กรอกจำนวนห้องน้ำ' : "Enter Bathroom" } required />
                                <Form.Label>{setLanguage === 'TH' ? 'จำนวนห้อง' : 'Total room'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="number" name="total_room" max={10} min={1} placeholder={setLanguage === 'TH' ? 'กรอกจำนวนห้อง' : "Enter Total_room" } required />
                                <Form.Label>{setLanguage === 'TH' ? 'ราคา' : 'Price'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="number" name="price" max={999999} min={1000} placeholder={setLanguage === 'TH' ? 'กรอกราคา' : "Enter Price" } required />
                                <Form.Label>{setLanguage === 'TH' ? 'สัตว์' : 'Pet'}</Form.Label>
                                <Form.Select className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="number" name="pet"  minLength={1} required >
                                    <option value={1}>{setLanguage === 'TH' ? 'ยินยอม' : 'Yes'}</option>
                                    <option value={0}>{setLanguage === 'TH' ? 'ไม่ยินยอม' : 'No'}</option>
                                </Form.Select>
                                <Form.Label>{setLanguage === 'TH' ? 'รูปภาพอพาร์ตเม้นท์' : 'Apartment Photo'}</Form.Label>
                                <Form.Control type="file" name="image" required/>
                            </Form.Group>
                        </Form.Group>
                    :
                        <Form.Group>
                            <Form.Label>{setLanguage === 'TH' ? 'บริการ' : 'Service'}</Form.Label>
                            <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="sname" placeholder={setLanguage === 'TH' ? 'กรอกชื่อบริการภาษาอังกฤษ' : "Enter Name" } pattern="^[a-zA-Z\s]+$" required />
                            <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" type="text" name="sTname" placeholder={setLanguage === 'TH' ? 'กรอกชื่อบริการภาษาไทย' : "Enter Thai Name" } pattern="[\u0E00-\u0E7F\s]+" required />                        
                        </Form.Group>
                    }
                    <Button className="btn-cancle-Apartment-Add" onClick={() => outShowModal()}>{setLanguage === 'TH' ? 'ยกเลิก' : 'Cancle'}</Button>
                    <Button type="submit" className="btn-submit-Apartment-Add" disabled = { stateAdd === 'Apartment' &&  (Login.status === 'admin' && stateAdd === 'Apartment' ? true : false )}>{setLanguage === 'TH' ? 'ตกลง' : 'Submit'}</Button>
                </Form>
            </ModalBody>
        </Modal>
        <PopupSuccess show={showModalSuccess} onHide={() => (setShowModalSuccess(false) ,setStatus(true))} message={ModalSuccessMessage} setLanguage={setLanguage} />
        </>
    )
}
export default ApartmentAddForm;
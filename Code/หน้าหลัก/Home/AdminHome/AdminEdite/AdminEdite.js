import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, Modal, ModalBody, ModalHeader } from "react-bootstrap";
import DetectPrevSame from '../../../../Function/DetectPrevSame';


function AdminEdite({ setShowModal , outShowModal , setValue  , setId , setLogin , setLanguage}) {
    const [service , setService] = useState([])
    const [service_selected , setService_selected] = useState([])
    const [dataApartment , setDataApartment] = useState()




    useEffect(()=>{
        const fetchData = async () => {

            if( setShowModal === true){
                // get service all
                try{
                    const response = await axios.get(`http://127.0.0.1:8000/api/services`); 
                    if(response.data[422] || response.data[404]){
                        console.log('response-service : ' , response.data)
                    }
                    else{
                        console.log('response-service : ' , response.data.data)
                        setService(response.data.data)
                    }
                }
                // Error service all
                catch(error){
                    console.error('Error response-service!', error);
                }
                
                // get data already selected
                try{
                    const response3 = await axios.get(`http://127.0.0.1:8000/api/data/${setId}`); 
                    if(response3.data[422] || response3.data[404]){
                        console.log('error-response-apartment : ' , response3.data)
                    }
                    else{
                        console.log('response-apartment : ' , response3.data)
                        setDataApartment(response3.data.data)
                        setService_selected(response3.data.service.map((item) => item.service_id))
                    }                
                }
                // Error service already selected
                catch(error){
                    console.error('Error response-apartment!', error);
                }
            }
        }
        fetchData()

    },[setShowModal])
    
    const handleSubmit = (event) => {
        event.preventDefault();
        const list = {
            id_apartment : setId,
            name : event.target.name.value,
            thai_name : event.target.thai_name.value,
            address : event.target.address.value,
            service : service_selected,
            description : event.target.description.value,
            thai_description : event.target.thai_description.value,
            bedroom : parseInt(event.target.bedroom.value),
            bathroom : parseInt(event.target.bathroom.value),
            total_room : parseInt(event.target.total_room.value),
            score : parseInt(event.target.score.value),
            pet : parseInt(event.target.pet.value),
            rule : event.target.rule.value,
            price : parseInt(event.target.price.value),
        }
        console.log('Edite value : ',list)
        setValue(list)
        outShowModal();
    }

    const handleServiceSelected  = (event) => {
        console.log('Check service_selected : ',DetectPrevSame(service_selected,event,'n_l',null))
        setService_selected( DetectPrevSame(service_selected,event,'n_l',null) )
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
            else if(!check && val !== ''){
                alert(`${setLanguage === 'TH' ? 'กรุณาใส่ภาษาไทย' : 'Please enter Thai language'}`)
                event.target.value = event.target.value.slice(0, -1)
            }
        }
        else if(type === 'address'){
            const check = /^[A-Za-z0-9\s\/]*$/.test(val)
            if(check){
                event.target.value = val
            }
            else if(!check && val !== ''){
                alert(`${setLanguage === 'TH' ? 'กรุณาใส่ภาษาอังกฤษ' : 'Please enter English language'}`)
                event.target.value = event.target.value.slice(0, -1)
            }
        }

    }
    return(
        <>
            <Modal show={setShowModal} onHide={outShowModal} className="modal-edtie-admin-home">
                <ModalHeader closeButton >
                    <h2>{setLanguage === 'TH' ? 'แก้ไขอพาร์ทเม้นท์' : 'Edite'}</h2>
                </ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="row" controlId="formBasic">
                            <Form.Group className="col" controlId="formBasic">
                                <Form.Group className="" controlId="formBasic">
                                    <Form.Label>{setLanguage === 'TH' ? 'ชื่ออพาร์ทเม้นท์' : 'Name'}</Form.Label>
                                    <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.name}  type="text" name="name" pattern="^[a-zA-Z\s]+$" placeholder={setLanguage === 'TH' ? 'ชื่อ อพาร์ทเม้นท์ (ภาษาอังกฤษ)' : 'Enter English Name'} onChange={(e) => handleTextChange(e, "en")}   required/>
                                    <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.thai_name} type="text" name="thai_name" placeholder={setLanguage === 'TH' ? 'ชื่อ อพาร์ทเม้นท์ (ภาษาไทย)' : 'Enter Thai Name'} onChange={(e) => handleTextChange(e, "en")}  pattern="[\u0E00-\u0E7F\s]+" required />                              
                                </Form.Group>                           
                                <Form.Group className="">
                                    <Form.Label >{setLanguage === 'TH' ? 'รายละเอียดอพาร์ทเม้นท์' : 'Service'}</Form.Label>
                                    <Form.Group className={`row ${setLanguage === 'TH' ? "row-cols-3" : "row-cols-3"} `} controlId="formBasic" style={{marginLeft : '1%'}}>
                                        {service.map((s,index) => (
                                            <Button key={index} className={`custom-btn-service-Admin-Home${service_selected.includes(s.id_service) ? '-active' : ''}`} onClick={() => handleServiceSelected(s.id_service)}>{setLanguage === 'TH' ? s.thai_name : s.name}</Button>
                                        ))}
                                    </Form.Group>
                                </Form.Group>
                                <Form.Group className="" controlId="formBasic">
                                    <Form.Label>{setLanguage === 'TH' ? 'ที่อยู่อพาร์ทเม้นท์' : 'Address'}</Form.Label>
                                    <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.address}  type="text" name="address" placeholder="Enter Address" onChange={(e) => handleTextChange(e, "address")}required />
                                </Form.Group>

                                <Form.Label>{setLanguage === 'TH' ? 'กฎ' : 'Rule'}</Form.Label>
                                <Form.Control as="textarea" className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.rule} type="text" name="rule" maxLength={255} minLength={1}  placeholder={setLanguage === 'TH' ? 'กรอกกฎเพิ่มเติม' : "Enter Rule Special"}  onChange={(e) => handleTextChange(e, "en")}   required />
                            </Form.Group>
                            <Form.Group className="col" controlId="formBasic">
                                <Form.Label>{setLanguage === 'TH' ? 'รายละเอียด (ภาษาอังกฤษ)' : 'Description'}</Form.Label>
                                <Form.Control as="textarea" className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.description} type="text" name="description"  maxLength={255} minLength={1}  placeholder={setLanguage === 'TH' ? 'กรอกข้อมูลรายละเอียดเพิ่มเติม (  ภาษาอังกฤษ )' : "Enter Description ( english )"} pattern="^[a-zA-Z\s]+$" onChange={(e) => handleTextChange(e, "en")}  required />
                                <Form.Label>{setLanguage === 'TH' ? 'รายละเอียด (ภาษาไทย)' : 'Thai Description'}</Form.Label>
                                <Form.Control as="textarea" className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.thai_description} type="text" name="thai_description"  maxLength={255} minLength={1}  placeholder={setLanguage === 'TH' ? 'กรอกข้อมูลรายละเอียดเพิ่มเติม ( ภาษาไทย  )' : "Enter Description ( thai )"} pattern="[\u0E00-\u0E7F\s]+" onChange={(e) => handleTextChange(e, "th")}  required />
                                <Form.Label>{setLanguage === 'TH' ? 'จํานวนห้อง' : 'Bedroom'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.bedroom} type="number" name="bedroom" placeholder="Enter Bedroom" required/>
                                <Form.Label>{setLanguage === 'TH' ? 'จํานวนห้องนอน' : 'Bathroom'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.bathroom} type="number" name="bathroom" placeholder="Enter Bathroom" required/>
                                <Form.Label>{setLanguage === 'TH' ? 'จํานวนห้อง' : 'Total_room'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.total_room}  type="number" name="total_room" placeholder="Enter Total_room" required/>
                                {  setLogin.status === 'admin' ?
                                    <>            
                                        <Form.Label>{setLanguage === 'TH' ? 'คะแนน' : 'Score'}</Form.Label>
                                        <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.score} type="number" name="score" placeholder="Enter Score" required/>
                                    </> 
                                    :
                                    <>
                                        <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"  type="number" name="score" defaultValue={dataApartment?.score} placeholder="Enter Score" hidden/>
                                    </>
                                }
                                <Form.Label>{setLanguage === 'TH' ? 'สัตว์เลี้ยง' : 'Pet'}</Form.Label>
                                <Form.Select className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.pet} type="number" name="pet" placeholder="Enter Pet" required>
                                        <option value={0}> No </option>
                                        <option value={1}> Yes </option>        
                                </Form.Select>
                                <Form.Label>{setLanguage === 'TH' ? 'ราคา' : 'Price'}</Form.Label>
                                <Form.Control className="form-control marginInput Input" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={dataApartment?.price}  type="number" name="price" placeholder="Enter Price" required/>
                            </Form.Group>
                        </Form.Group>
                        <Button type="submit" variant="outline-warning" style={{marginTop : 10}}>{setLanguage === 'TH' ? 'ยืนยัน' : 'Submit'}</Button>
                    </Form>
                </ModalBody>
        </Modal>
    </>
    )
}

export default AdminEdite;
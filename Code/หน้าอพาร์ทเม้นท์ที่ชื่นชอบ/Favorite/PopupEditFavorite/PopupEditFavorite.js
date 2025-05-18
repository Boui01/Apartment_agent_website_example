import axios from "axios"
import { useEffect, useState } from "react"
import { Form, Modal } from "react-bootstrap"
import CreateNumToList from "../../../Function/CreateNumToList" 
import './PopupEditFavorite.css'

function PopupEditFavorite({ setModal , outModal  , setEdit , setLogin , token , outStatus , setLanguage}) {
    const list_column = ['room','people','other','rental_date','objective_rental','pet']
    const [room , setRoom] = useState([])
    const [select , setSelect] = useState('')
    const [value , setValue] = useState('')

    useEffect(() => {
        const freshdata = async () => {
            if( setModal === true ){
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/data/room/${setEdit.apartment_id}`,{ 
                        params : {},
                        headers: {
                        Authorization: `Bearer ${token}`,
                        }
                    } 
                    )
                    if(response.data[404] || response.data[422]){
                        console.log('Data error room :',response.data)
                    }
                    else{
                        console.log('Data room :', response.data);
                        setRoom(CreateNumToList(response.data.data  , undefined , undefined , 'Manual'))
                    }
                }
                catch (error) {
                    console.error('Data error room :',error)
                }
            }
        }
        freshdata()
    }, [setModal])

    const handleEdit =  async ()  => {
        console.log('Edit : ', select , value)
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/favorite/${setLogin.id}`,{ id: setEdit.id_favorite ,  position : select , value : value},{ 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            )
            if(response.data[404] || response.data[422]){
                console.log(response.data)
            }
            else{
                console.log('Data Edit :', response.data);
                outModal();
                outStatus();
                setSelect('');
                setValue('');
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const handleSelect = (e) => {
        setSelect(e)
        setValue('')
    }

    return (
        <>
            <Modal show={setModal} onHide={() => outModal()} className="modal-edit-favorite">
                <Modal.Header closeButton>
                    <Modal.Title>{setLanguage === 'TH' ? 'แก้ไขข้อมูลอพาร์ทเม้นท์' : 'Edit Apartment'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="Modal-body-PopupEditFavorite">
                    <Form.Select aria-label="Default select example" className="form-control mb-3" value={select} onChange={(e) => handleSelect(e.target.value)}>
                        <option disabled>{setLanguage === 'TH' ? 'เปิดเมนูตัวเลือกที่จะแก้ไข' : 'Open this select menu'}</option>
                        {list_column.map((item) => (
                            <option value={item}>{
                                setLanguage === 'TH' ?
                                    item === 'room' ? 'จำนวนห้อง' : 
                                    item === 'people' ? 'จำนวนคน' : 
                                    item === 'other' ? 'ข้อมูลเพิ่มเติม' : 
                                    item === 'rental_date' ? 'วันที่เช่า' : 
                                    item === 'objective_rental' ? 'วัตถุประสงค์การเช่า' : 
                                    item === 'pet' ? 'สัตว์เลี้ยง' :
                                    ''
                                :
                                    item === 'room' ? 'Room' : 
                                    item === 'people' ? 'People' : 
                                    item === 'other' ? 'Other' : 
                                    item === 'rental_date' ? 'Rental Date' : 
                                    item === 'objective_rental' ? 'Objective Rental' : 
                                    item === 'pet' ? 'Pet' :
                                    ''
                            }</option>
                        ))}
                    </Form.Select>
                    {
                        select === 'rental_date' ?
                            <Form.Control type="date" className="form-control" value={value} onChange={(e) => setValue(e.target.value)} />
                        : select === 'objective_rental' ? 
                            <Form.Select type="text" placeholder={setLanguage === 'TH' ? 'แก้ไขวัตถุประสงค์การเช่า' : "Edit Objective Rental"} className="form-control" value={value} onChange={(e) => setValue(e.target.value)} >
                                <option value="">{setLanguage === 'TH' ? 'เลือกวัตถุประสงค์การเช่า' : "Select Objective"}</option>
                                <option value="business">Business - ธุรกิจ</option>
                                <option value="populate">Populate - อยู่อาศัย</option>
                                <option value="commercial">Commercial - การพาณิชย์</option>
                            </Form.Select>
                        : select === 'pet' ?
                            <Form.Select type="text" placeholder="Edit Pet" className="form-control" value={value} onChange={(e) => setValue(e.target.value)} >
                                <option value="">{setLanguage === 'TH' ? 'เลือกประเภทสัตว์เลี้ยง' : "Select Pet"}</option>
                                <option value="not_pet">{setLanguage === 'TH' ? 'ไม่มีสัตว์เลี้ยง' : "Don't have pet"}</option>
                                <option value="cat">{setLanguage === 'TH' ? 'เแมว' : "Cat"}</option>
                                <option value="dog">{setLanguage === 'TH' ? 'สุนัข' : "Dog"}</option>
                                <option value="other">{setLanguage === 'TH' ? 'อื่นๆ' : "Other"}</option>
                            </Form.Select>
                        : select === 'other' ?
                            <textarea type="text" placeholder={setLanguage === 'TH' ? 'แก้ไขข้อมูลเพิ่มเติม' : "Edit Other"} className="form-control" value={value} onChange={(e) => setValue(e.target.value)} />
                        : select  === 'room'?
                            room.map((item , index) => (
                                <Form.Check
                                    className="custom-check-box-room-PopupEditFavorite"
                                    inline
                                    key={index} // Adding a unique key for each radio button
                                    type="radio"
                                    label={index+1} // The label for the radio button
                                    value={index+1} // The value of the radio button
                                    checked={value === index+1} // Checks if the current value is selected
                                    onChange={(e) => setValue( Number(e.target.value))} // Updates the value on change
                                />
                            ))
                        : select === 'people' ?
                            <Form.Control type="number" placeholder={setLanguage === 'TH' ? 'แก้ไขจำนวนคน' : "Edit People"} className="form-control" value={value} onChange={(e) => setValue(e.target.value)} />
                        :
                            <Form.Control type="text" placeholder={setLanguage === 'TH' ? 'แก้ไขจำนวนคน' : "Edit Favorite"} className="form-control" value={value} onChange={(e) => setValue(e.target.value)} />
                    }
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-warning" onClick={handleEdit} disabled={select === '' || value === ''}>Confirm</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default PopupEditFavorite
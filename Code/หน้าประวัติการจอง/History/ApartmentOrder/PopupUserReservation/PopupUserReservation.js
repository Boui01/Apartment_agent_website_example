
import { Button, Modal } from "react-bootstrap";
import './PopupUserReservation.css';
import DetectNew from "../../../../../Function/DetectNew";

function PopupUserReservation( {setPopup , outPopup, setReservation , setShowInfo , setLogin ,outStatus , setLanguage} ){


    return(
        <>
            <Modal show={setPopup} onHide={outPopup} className='Modal-Main-PopupUserReservation'> 
                <Modal.Header  className='Modal-Main-PopupUserReservation-Head'>
                    <div data-bs-theme="dark" className="position-absolute top-10 btn-close-modal-main-PopupUserApartment-Head" onClick={() => outPopup()}>
                        <button type="button" className="btn-close " aria-label="Close"></button>
                    </div>
                    <h2>{setLanguage === 'TH' ? 'รายการสมาชิกจองห้องเช่า' : 'User reservation'}</h2>                
                </Modal.Header>                                 
                <Modal.Body>
                    <table className="table  text-center">
                        <thead className="custom-table-head-PopupUserReservation">
                            <tr style={{position: 'sticky' , top : 0 , backgroundColor : 'white'}}>
                                <th scope="col">{setLanguage === 'TH' ? 'ชื่อสมาชิก' : 'English fname'}</th>
                                <th scope="col">{setLanguage === 'TH' ? 'นามสกุล' : 'English lname'}</th>
                                <th scope="col">{setLanguage === 'TH' ? 'วันที่เช่า' : 'Rental date'}</th>
                                <th scope="col">{setLanguage === 'TH' ? 'ห้อง' : 'Room'}</th>
                                <th scope="col">{setLanguage === 'TH' ? 'จำนวนคน' : 'People'}</th>
                                <th scope="col">{setLanguage === 'TH' ? 'สัตว์เลี้ยง' : 'Pet'}</th>
                                <th scope="col">{setLanguage === 'TH' ? 'วัตถุประสงค์เช่า' : 'Objective rental'}</th>
                                <th scope="col">{setLanguage === 'TH' ? 'เพิ่มเติม' : 'Other'}</th>
                                <th scope="col">{setLanguage === 'TH' ? 'สถานะ' : 'Status'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {  setReservation.length > 0 ?
                                <>                                  
                                    {
                                        setReservation.map((item , index )=> (
                                            setShowInfo === item.apartment_id && 
                                            DetectNew(item.reservation_date , 2 , 1) && 
                                            item.status === 1 
                                                ?
                                                <tr key={index}  className={`custom-table-active-PopupUserReservation table-warning`}>
                                                    <th>
                                                        { <b style={{color : "#ff9900"}}> { setLanguage === 'TH' ? 'ใหม่ ' : 'New ' }</b>}
                                                        { setLanguage === 'TH' ? item.user.english_fname : item.user.english_fname}
                                                    </th>
                                                    <th>{ setLanguage === 'TH' ? item.user.english_lname : item.user.english_lname}</th>
                                                    <td style={{ width: '100px' }}>{item.rental_date}</td>
                                                    <td>{ item.room}</td>
                                                    <td>{ item.people}</td>
                                                    <td>{ setLanguage === 'TH' ? 
                                                                (item.pet === "dog" ? 'สุนัข' : 
                                                                item.pet === "cat" ?  'แมว' :
                                                                item.pet === "other" ? 'สัตว์เลี้ยงอื่นๆ' : 
                                                                'ไม่มีสัตว์เลี้ยง')
                                                            : 
                                                                item.pet}</td>
                                                    <td>{ setLanguage === 'TH' ? 
                                                                (item.objective_rental ===  "business" ? "ธุรกิจ" :
                                                                item.objective_rental === "populate" ? "อยู่อาศัย" :
                                                                item.objective_rental === "commercial" ? "การพาณิชย์" :
                                                                'ไม่มีวัตถุประสงค์')
                                                            : 
                                                                item.objective_rental
                                                        }</td>
                                                    <td>{ item.other}</td>
                                                    <td>{ setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</td>
                                                </tr>
                                            : 
                                                <></>
                                        ) )
                                    }
                                    {
                                        setReservation.map((item , index )=> (
                                            setShowInfo === item.apartment_id && 
                                             DetectNew(item.reservation_date , 1 , 1)  &&
                                             item.status === 1 
                                                ?
                                                <tr key={index}  className={`custom-table-active-PopupUserReservation table-active`}>
                                                    <th>
                                                        { setLanguage === 'TH' ? item.user.english_fname : item.user.english_fname}
                                                    </th>
                                                    <th>{ setLanguage === 'TH' ? item.user.english_lname : item.user.english_lname}</th>
                                                    <td width = '100px' >{ item.rental_date}</td>
                                                    <td width = '10px'>{ item.room}</td>
                                                    <td width = '90px'>{ item.people}</td>
                                                    <td width = '90px'>{ setLanguage === 'TH' ? 
                                                                (item.pet === "dog" ? 'สุนัข' : 
                                                                item.pet === "cat" ?  'แมว' :
                                                                item.pet === "other" ? 'สัตว์เลี้ยงอื่นๆ' : 
                                                                'ไม่มีสัตว์เลี้ยง')
                                                            : 
                                                                item.pet}</td>
                                                    <td width = '150px'>{ setLanguage === 'TH' ? 
                                                                (item.objective_rental ===  "business" ? "ธุรกิจ" :
                                                                item.objective_rental === "populate" ? "อยู่อาศัย" :
                                                                item.objective_rental === "commercial" ? "การพาณิชย์" :
                                                                'ไม่มีวัตถุประสงค์')
                                                            : 
                                                                item.objective_rental
                                                        }</td>
                                                    <td width = '100px'>{ item.other}</td>
                                                    <td>{ setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</td>
                                                </tr>
                                            : 
                                                <></>
                                        ) )
                                    }
                                </>
                                :
                                   <tr>
                                        <td>{ setLanguage === 'TH' ? 'ไม่มีการจอง' : 'No reservation'}</td>
                                   </tr>
                                }
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
        </>
    )
}



export default PopupUserReservation
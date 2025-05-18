import axios from "axios"
import { useEffect, useState } from "react"
import './ReservationOrder.css';
import DetectNew from "../../../../Function/DetectNew"
import DetectRule from "../../../../Function/DetectRule";
import PopupUserApartment from "./PopupUserApartment/PopupUserApartment";

function ReservationOrderForm({ setLogin,setRefresh , setLanguage }) {
    return(
        <>
            <div className="content-Reservation">
                <h2>{setLanguage === 'TH' ? 'รายการการจองห้องเช่า' : 'ReservationOrder'}</h2>
                <ReservationOrder setLogin={setLogin} setRefresh={setRefresh} setLanguage={setLanguage}/>
            </div>
        </>
    )
}
function ReservationOrder( { setLogin,setRefresh , setLanguage } ){
    const [Active , setActive] = useState()
    const [Reservation, setReservation] = useState([])
    const [popup , setPopup] = useState(false)
    const [apartment, setApartment] = useState([])
    const token = JSON.parse(sessionStorage.getItem('token_id'))

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response =  await axios.post(`http://127.0.0.1:8000/api/user/dashboard/reservations/${setLogin.id}`,{}, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  }   
                );
                console.log(response.data);
                setReservation(response.data.data);
            }
            catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        fetchData();
    },[setRefresh,setLogin])

    const handleActive = (id , apartment) => {
        setActive((prev) => prev ? DetectRule(prev,id,null,id) : id)
        setPopup(true)
        setApartment(apartment)
    }
    const handleClosePopup = () =>{
        setPopup(false)
        setActive()
    }


    return (
        <>
            <table className="table">
                <thead className="table-secondary " >
                    <tr>
                    <th scope="col">{setLanguage === 'TH' ? 'ลำดับ' : 'ID'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'ชื่อ' : 'Name'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'เวลา' : 'Time'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'สถานะ' : 'Status'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'ห้อง' : 'Room'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'จำนวนคน' : 'People'}</th>
                    <th scope="col">{setLanguage === 'TH' ? 'เพิ่มเติม' : 'Other'}</th>
                    </tr>
                </thead>
                <tbody >
                    {
                        Reservation.length === 0 ?
                        <tr>
                            <td colSpan="7">{setLanguage === 'TH' ? 'ไม่มีการจองห้องเช่า' : 'No Reservation'}</td>
                        </tr>
                        :
                        <></>
                    }
                    {  
                        Reservation.map( (r,index) =>(
                            DetectNew(r.reservation_date,2,1) ?
                                <tr className={`custom-button-table-ReservationOrder  ${DetectRule(Active,r.id_reservation ,'custom-button-table-ReservationOrder-active' , 'table-warning')}`} 
                                    onClick={() => handleActive( r.id_reservation,r.apartment )}
                                    key={index} 
                                >
                                    <th scope="row">
                                        {Active ? Active === r.id_reservation ?
                                        '':                                   
                                        <b style={{color : "#ff9900"}}>{setLanguage === 'TH' ? 'ใหม่' : 'New'} </b>:
                                        <b style={{color : "#ff9900"}}>{setLanguage === 'TH' ? 'ใหม่' : 'New'} </b> 
                                        }
                                        {index+1}
                                    </th>
                                    <td >{setLanguage === 'TH' ? r.apartment.thai_name : r.apartment.name}</td>
                                    <td >{r.reservation_date}</td>
                                    <td >{r.status === 0 ? (setLanguage === 'TH' ? 'รอการยืนยัน' : 'Waitting') : (setLanguage === 'TH' ? 'ยืนยันแล้ว' : 'Confirm')}</td>
                                    <td>{r.room}</td>
                                    <td>{r.people}</td>
                                    <td>{r.other}</td>
                                </tr>
                            :
                            <></>
                            )
                        )
                    }
                    {   
                        Reservation.map( (r,index) =>(
                            DetectNew(r.reservation_date,1,1) ?
                                <tr className={`custom-button-table-ReservationOrder  ${DetectRule(Active,r.id_reservation ,'custom-button-table-ReservationOrder-active' , '')}`} 
                                    onClick={() => handleActive( r.id_reservation,r.apartment )}
                                    key={index} 
                                >
                                    <th scope="row">{index+1} </th>
                                    <td>{setLanguage === 'TH' ? r.apartment.thai_name : r.apartment.name}</td>
                                    <td>{r.reservation_date}</td>
                                    <td >{r.status === 0 ? (setLanguage === 'TH' ? 'รอการยืนยัน' : 'Waitting') : (setLanguage === 'TH' ? 'ยืนยันแล้ว' : 'Confirm')}</td>
                                    <td>{r.room}</td>
                                    <td>{r.people}</td>
                                    <td>{r.other}</td>
                                </tr>
                            :
                            <></>
                            )
                        )
                    }
                    <tr></tr>
                </tbody>
            </table>
            <PopupUserApartment setPopup = {popup} outPopup = {handleClosePopup}  setShowInfo = {apartment} setLanguage = {setLanguage} />
        </>
    )
}





export default ReservationOrderForm;
import { useEffect, useState } from 'react';
import './ApartmentOrder.css';
import axios from 'axios';
import PopupUserReservation from './PopupUserReservation/PopupUserReservation';
import ToastPopup from './ToastPopup/ToastPopup';


function ApartmentOrderForm ( { setLogin , setLanguage }){
    return (
        <>  
            <div className="content-Apartment">
                <h2>{setLanguage === 'TH' ? 'รายการอพาร์ทเม้นท์' : 'ApartmentOrder'}</h2>
                <ApartmentOrder setLogin={setLogin} setLanguage={setLanguage}/>
            </div>
        </>
    )
}

function ApartmentOrder( {setLogin , setLanguage} ) {
    const [apartment, setApartment] = useState([])
    const [reservation, setReservation] = useState([])
    const [showInfo , setShowInfo] = useState()
    const [popup , setPopup] = useState(false)
    const [hover , setHover] = useState()
    const [toast , setToast] = useState(false)
    const [status , setStatus] = useState(false)

    useEffect(() => {
        const token = JSON.parse(sessionStorage.getItem('token_id'))

        const fetchData = async () => {
            try{
                const response =  await axios.post(`http://127.0.0.1:8000/api/user/dashboard/apartments/${setLogin.id}`,{}, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  }   
                );
                console.log('apartment-dashboard : ',response.data);
                setApartment(response.data.data);
                setReservation(response.data.reservation);
                setStatus(false);
            }
            catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        fetchData();
    },[setLogin , status])

    const handleShowInfo = (e) => {
        setPopup(true)
        setShowInfo( e )
    }

    const handleHover = (e,t) => {
        setHover(e)
        setToast(t)
    }


    return (
        <>
            <table className="table">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">{ setLanguage === 'TH' ? 'ลำดับ' : 'ID'}</th>
                        <th scope="col">{ setLanguage === 'TH' ? 'ชื่ออพาร์ทเม้นท์' : 'Apartment'}</th>
                        <th scope="col">{ setLanguage === 'TH' ? 'ราคา' : 'Price'}</th>
                        <th scope="col">{ setLanguage === 'TH' ? 'ที่อยู่' : 'Address'}</th>
                        <th scope='col'>{ setLanguage === 'TH' ? 'สถานะ' : 'Status'}</th>
                    </tr>
                </thead>
                <tbody>
                    {   
                        apartment.length === 0 ? <tr><td colSpan={5}>{ setLanguage === 'TH' ? 'ไม่พบข้อมูล' : 'No data'}</td></tr> :
                        apartment.map( (a,index) =>(
                            <>
                                <tr onClick={() => handleShowInfo(a.id_apartment)} key={index} 
                                    className={` custom-table-ApartmentOrder`}  
                                    onMouseOver={() => handleHover(a.id_apartment,true)} 
                                    onMouseOut={() => handleHover(null,false)}
                                >
                                    <th scope="row">{index+1}</th>
                                    <td>{a.name}</td>
                                    <td>{a.price}</td>
                                    <td>{a.address}</td> 
                                    <td>{setLanguage === 'TH' ? a.status === 0 ? 'ไม่ยืนยัน' : 'ยืนยัน' : a.status === 0 ? 'Inactive' : 'Active'}</td>
                                </tr>
                                    { hover === a.id_apartment && toast?
                                            <ToastPopup setReservation={reservation} setApartment={a.id_apartment} setToast={toast} setLanguage={setLanguage}/>        
                                        :
                                            <></>
                                    }
                            </>
                            )
                        )
                    }
                </tbody>
            </table>                      
     
            <PopupUserReservation setPopup={popup} outPopup={() => setPopup(false)} setReservation={reservation} setShowInfo={showInfo}  setLogin={setLogin} outStatus={setStatus} setLanguage={setLanguage}/>

        </>
    )
}












export default ApartmentOrderForm;
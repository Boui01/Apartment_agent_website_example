import { useEffect, useState } from 'react';
import './History.css';
import ApartmentOrderForm from './ApartmentOrder/ApartmentOrder';
import ReservationOrderForm from './ReservationOrder/ReservationOrder';
import PaymentOrderForm from './PaymentOrder/PaymentOrder';
import { Button } from 'react-bootstrap';

function HistoryForm({ setLogin , outPage , setState , outState , setLanguage }) {
    return(
        <>
            <History setLogin={setLogin} outPage={outPage} setState={setState} outState={outState} setLanguage={setLanguage}/>
        </>
    )
}
function History({ setLogin , outPage , setState , outState , setLanguage }) {
    const [active,setActive] = useState('apartments');
    const [refresh , setRefresh] = useState();
    const User = sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem('token')) : setLogin;

    useEffect(() => {
        if(setState === 'reservation'){
            setActive('reservations');
            setRefresh('reservation');
            outState();
        }
    },[setState])

    const handleActive = (e) =>{
        setActive(e)
    }
    return(
        <>
            <div className='Block-background'>
                <div className='content-background'>
                    <div className='row nav-head'>
                        <div className={`col-5 col-sm-3 ${active === 'apartments' ? 'Active' : ''}`} onClick={() => handleActive('apartments')}>{setLanguage === 'TH' ? 'อพาร์ทเม้นท์' : 'Apartment'}</div>
                        <div className={`col-5 col-sm-4 ${active === 'reservations' ? 'Active' : ''}`} onClick={() => handleActive('reservations')}>{setLanguage === 'TH' ? 'การจองห้องเช่า' : 'Reservation'}</div>
                        <div className={`col-5 col-sm-4 ${active === 'payments' ? 'Active' : ''}`} style={{width : '32.5%'}} onClick={() => handleActive('payments')}>{setLanguage === 'TH' ? 'การชำระเงิน' : 'Payment'}</div>
                    </div>
                </div>
                {active === 'apartments' ?
                <>
                    <ApartmentOrderForm setLogin={User} setLanguage={setLanguage}/>
                </>
                : active === 'reservations' ?
                    <>
                        <ReservationOrderForm setLogin={User} setRefresh={refresh}  setLanguage={setLanguage}/>
                    </>
                :
                    <>
                        <PaymentOrderForm setLogin={User} setLanguage={setLanguage}/>
                    </>
                }
                <Button className='btn btn-warning custom-button-back-History' onClick={() => outPage(false)}>{setLanguage === 'TH' ? 'กลับ' : 'Back'}</Button>
            </div>
        </>
    )
}

export default HistoryForm;
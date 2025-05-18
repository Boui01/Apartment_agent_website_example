import './ToastPopup.css'
const ToastPopup = ( {setReservation,setApartment,setToast , setLanguage }  ) => {

    return (
        <div className='row custom-toast-history-main'>
            {setReservation.map((item,index) => (
                item.apartment_id === setApartment && item.status === 1?
                    <div key={index} className='col-5'>
                        <div className={`custom-toast-history ps-2 ${setToast ? 'd-block' : 'd-none'} `} style={{backgroundColor : 'rgba(240, 248, 255, 0)'  , marginTop : '2%'}}>
                            <div id="liveToast"  className="toast show" role="alert" aria-live="assertive"  aria-atomic="true"  >
                                <div className="toast-header custom-toast-header" >
                                    <img src="./Icon/chat.svg" className="rounded me-2" alt="..." />
                                    <strong className="me-auto">{ setLanguage === 'TH' ? 'สมาชิกจองห้องเช่า' : 'User reservation'}</strong>
                                    <small>{item.reservation_date}</small>
                                </div>
                                <div className="toast-body">
                                    {   item.id_reservation + ' ' + 
                                        (setLanguage === 'TH' ?
                                            item.user.english_fname + ' - ' + 
                                            item.user.english_lname+ 
                                            ' | วันที่เช่า : '
                                        :
                                            item.user.english_fname + ' - ' + 
                                            item.user.english_lname+ 
                                            ' | Date : ' ) +
                                        item.rental_date
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                :  index+1 === setReservation.leangth ?
                    <div key={index} className='col-5'>
                            <div className={`custom-toast-history  ps-2 ${setToast ? 'd-block' : 'd-none'}`} style={{backgroundColor : 'rgba(240, 248, 255, 0)'  , marginTop : '2%'}} >
                                <div id="liveToast"  className="toast show" role="alert" aria-live="assertive"  aria-atomic="true"  >
                                    <div className="toast-header custom-toast-header">
                                        <img src="./Icon/chat.svg" className="rounded me-2" alt="..." />
                                        <strong className="me-auto">{ setLanguage === 'TH' ? 'สมาชิกจองห้องเช่า' : 'User reservation'}</strong>
                                    </div>
                                    <div className="toast-body">
                                        <p>{ setLanguage === 'TH' ? 'ไม่มีการจอง' : 'No reservation'} </p>
                                    </div>
                                </div>
                            </div>
                    </div>
                :
                    <></>
                
                
            ))
            }
        </div>
    );
  };

  export  default ToastPopup;
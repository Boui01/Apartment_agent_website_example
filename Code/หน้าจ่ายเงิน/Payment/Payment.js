import axios from "axios";
import { useEffect, useState } from "react";
import './Payment.css'
import FormateID from "../../Function/FormatID";
import PopupConfirm from "../PopupConfirm/PopupConfirm";
import Bank from "../Bank/Bank";

function Paymentform ( {setLogin , setPaymentPage , setLanguage} ){
    return(
        <div>
            <video autoPlay loop muted className="videoBackground-payment">
                <source src="..\Video\Profile.mp4" type="video/mp4"  />
            </video>   
            <Payment setLogin={setLogin} setPaymentPage={setPaymentPage} setLanguage={setLanguage}/>
        </div>
    )
}


function Payment( {setLogin, setPaymentPage , setLanguage}){
    const [data,setData] = useState([]);         // data all get from backend
    const [service , setService] = useState([]);
    const [image , setImage] = useState([]);
    const [selectedItems , setSelectedItems] = useState([]);
    const [payment , setPayment] = useState([]); // data for payment
    const [refresh , setRefresh] = useState(false);

    const [totalPrice, setTotalPrice] = useState(0);
    const [success , setSuccess] = useState(false);// data for confirm playment

    const session_login = sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem('token')) : setLogin;
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : '';

    const [modalConfirm , setModalConfirm] = useState(false);
    const [modalBank , setModalBank] = useState(false);

  ///////////////////////// Reset //////////////////////////
    //sessionStorage.removeItem('selected_payment');

 ///////////////////////// Use Effect //////////////////////////
    useEffect(() => {
        const fetchData = async () => {
            if(success){
                try {
                    console.log('Data send : ', payment)
                    const response = await axios.put(`http://127.0.0.1:8000/api/payment/user/${session_login.id}`,{ payments : payment},{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    sessionStorage.removeItem('selected_payment')
                    console.log("payment :  " , response.data)
                    setPayment([])
                    setSuccess(false)
                    setRefresh(true)
                }
                catch (error) {
                    console.log(error)
                }
            }

        }
        fetchData();

    }, [success,payment,setPaymentPage /* Don't put session_login follow warn react has show console.log a lot */]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get(`http://127.0.0.1:8000/api/payment/${session_login.id}`,{
                    params: {},
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  } 
                )
                if(response.data[422] || response.data[404]){
                    console.log('Check Get payment failed : ', response.data)
                }
                else{   
                    console.log("Check Get payment success : " , response.data)
                    setData(response.data.data.filter(item => payment.find(item2 => item.id_payment === item2.id_payment) === undefined))
                    setService(response.data.service)
                    setImage(response.data.image)
                    setRefresh(false)
                }
            }
            catch(error){
                console.log(error)
            }

        }
        fetchData();
    }, [refresh]);

    useEffect(() => {
        setTotalPrice(payment.reduce((total, item) => total + item.apartment.price, 0));
    },[payment])




    const handleSuccess = () => {
        setModalBank(false)
        setSuccess(true)
        const change_status = payment.map(item => ({...item , status_user : 1}) )
        setPayment( change_status )
    }


    const handleOndeleteAll = () => {
        setPayment([])
        setRefresh(true)
    }
    const handleOnConfirm = () => {
       setModalBank(true)
    }

    const handleOnCheckboxList = (val) =>{
        const { value, checked } = val.target;
        const filter_detail = data.find(item => item.id_payment.toString() === value);
        setSelectedItems((prevSelected) => {
            // make new value with check value not already in "selected"
            const updatedSelected = checked ? [...prevSelected, filter_detail] : prevSelected.filter(item => item.id_payment.toString() !== value);
            console.log("Data Paymentlist : ", updatedSelected)
            return updatedSelected;
        });
    }

    const handleOnDeletepayment = (data) =>{
        setPayment( prev => prev.filter(item => item.id_payment !== data.id_payment) )
        setData(prev => [...prev , data] )
    }

    const handleSelectedPayment = (data) => {
        setData( (prev) => prev.filter(item => item.id_payment !== data.id_payment) )
        setPayment( [...payment, data] )
        console.log("payment : " , data)
    }
    const handleSelectListPlayment = () => {
        setData( prev => prev.filter(item => !selectedItems.some(item2 => item.id_payment === item2.id_payment)) )
        setSelectedItems([])
        setPayment( selectedItems)
    }
    return(
        <div className=" block-all-payment">  

            <div >                  

                        <>
                        <ul className="block-list-payment">
                            <div className="block-head-Edite-list-payment row">
                                <h4>{setLanguage === 'TH' ? 'รวมราคาทั้งหมด(บาท) : ' : 'Total Price(TBH) : '}${totalPrice}</h4>
                                <button className="btn custom-btn-delete-all-payment"  onClick={() => setModalConfirm(true)}>{setLanguage === 'TH' ? 'ลบทั้งหมด' : 'Delete All'}</button>
                            </div>

                            <h2 className="text-head-payment-page">{setLanguage === 'TH' ? 'ทำการชำระเงิน' : 'Payment'}</h2>
                            {
                            payment.length > 0 ?
                             payment.map((item, index) => ( 
                                <div key={index} className="list-payment">
                                    <div>                   
                                        <h6 >{setLanguage === 'TH' ? 'รายการที่ : ' : 'ID : '}{index +1 }</h6>
                                        <p>{setLanguage === 'TH' ? 'ชื่ออพาร์ทเม้น : ' + item.apartment.thai_name : 'Name : '+ item.apartment.name}</p>  
                                        <p>{setLanguage === 'TH' ? 'บริการ : ' : 'Service : '}{service.filter( s => s.payment_id === item.id_payment).map( s => (setLanguage == 'TH' ? s.service.services.thai_name  :  s.service.services.name) + ' | ')}</p>
                                        <p>{setLanguage === 'TH' ? 'ราคา(บาท) : ' : 'Price(THB) : '}${item.apartment.price}</p>
                                        <p>{setLanguage === 'TH' ? 'เพิ่มเติม : ' + item.apartment.thai_description : 'Other : ' + item.apartment.description}</p>
                                    </div>  

                                    <div style={{marginRight : "10%",marginBottom : 20 }}>
                                        <div className="accordion accordion-flush" id="accordionFlushExample">
                                            <div className="accordion-item" style={{borderBottomLeftRadius : '10px' , borderBottomRightRadius : '10px'}}>
                                                <h2 className="accordion-header ">
                                                    <button className="accordion-button collapsed custom-block-detail" type="button" data-bs-toggle="collapse" data-bs-target={`#${item.id_payment}`} aria-expanded="false" aria-controls="flush-collapseTwo">
                                                        {setLanguage === 'TH' ? 'รายละเอียด ' : 'Detail'}
                                                    </button>
                                                </h2>
                                                <div  id={`${item.id_payment}`}  className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body border"  style={{borderBottomLeftRadius : '10px' , borderBottomRightRadius : '10px'}}>
                                                        <p>{setLanguage === 'TH' ? 'จำนวนห้อง :  ' : 'Room : '} {item.reservation.room}</p>
                                                        <p>{setLanguage === 'TH' ? 'จำนวนคน : ' : 'People : '}{item.reservation.people}</p>
                                                        <p>{setLanguage === 'TH' ? 'ข้อมูลเพิ่มเติม : ' : 'Other : '}{item.reservation.other}</p>   
                                                        <p>{setLanguage === 'TH' ? 
                                                                'สัตว์เลี้ยง :  '+ 
                                                                (item.reservation.pet === "dog" ? 'สุนัข' : 
                                                                item.reservation.pet === "cat" ?  'แมว' :
                                                                item.reservation.pet === "other" ? 'สัตว์เลี้ยงอื่นๆ' : 
                                                                'ไม่มีสัตว์เลี้ยง')
                                                            : 
                                                                'Pet : '+item.reservation.pet}
                                                        </p>
                                                        <p>{setLanguage === 'TH' ? 'วันที่จอง : ' : 'Date : '}{item.reservation.rental_date.toLocaleString() }</p>
                                                        <p>{setLanguage === 'TH' ? 
                                                                'วัตถุประสงค์ : ' +
                                                                (item.reservation.objective_rental ===  "business" ? "ธุรกิจ" :
                                                                item.reservation.objective_rental === "populate" ? "อยู่อาศัย" :
                                                                item.reservation.objective_rental === "commercial" ? "การพาณิชย์" :
                                                                'ไม่มีวัตถุประสงค์')
                                                            : 
                                                                'Objective : '+item.reservation.objective_rental}
                                                        </p>     
                                                        <div className="block-image-payment">
                                                            <img className="image-payment" src={`data:image/jpeg;base64,${image[item.apartment_id]}`} alt="..."/>
                                                        </div>                                               
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                    </div> 
                                    <button className="btn custom-btn-delete-payment" onClick={() => handleOnDeletepayment(item) }>{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</button>
                                </div>   
                                ))
                                :
                                <p>{setLanguage === 'TH' ? 'ไม่มีการชำระเงิน' : 'No Payment'}</p> 
                            }
                            <div className="line-between-payment-wait"></div>
                            <h2 className="text-head-payment-page">{setLanguage === 'TH' ? 'กำลังรอชำระเงิน' : 'Waiting'}</h2>
                            {data.length > 0 ?
                             data.map((item, index) => ( 
                                <div key={index} className="list-payment">
                                    <div>                   
                                        <h6 >{setLanguage === 'TH' ? 'รายการที่ : ' : 'ID : '}{index +1 }</h6>
                                        <p>{setLanguage === 'TH' ? 'ชื่ออพาร์ทเม้น : '+ item.apartment.thai_name : 'Name : ' + item.apartment.name}</p>  
                                        <p>{setLanguage === 'TH' ? 'บริการ : ' : 'Service : '}{service.filter( s => s.payment_id === item.id_payment).map( s => (setLanguage === 'TH' ? s.service.services.thai_name :  s.service.services.name) + ' | ' )}</p>
                                        <p>{setLanguage === 'TH' ? 'ราคา(บาท) : ' : 'Price(THB) : '}${item.apartment.price}</p>
                                        <p>{setLanguage === 'TH' ? 'เพิ่มเติม : '+ item.apartment.thai_description : 'Other : ' + item.apartment.description}</p>
                                    </div>  

                                    <div style={{marginRight : "10%",marginBottom : 20 }}>
                                        <div className="accordion accordion-flush" id="accordionFlushExample">
                                            <div className="accordion-item" style={{borderBottomLeftRadius : '10px' , borderBottomRightRadius : '10px'}}>
                                                <h2 className="accordion-header ">
                                                    <button className="accordion-button collapsed custom-block-detail" type="button" data-bs-toggle="collapse" data-bs-target={`#${item.id_payment}`} aria-expanded="false" aria-controls="flush-collapseTwo">
                                                        {setLanguage === 'TH' ? 'รายละเอียด ' : 'Detail'}
                                                    </button>
                                                </h2>
                                                <div  id={`${item.id_payment}`}  className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body border"  style={{borderBottomLeftRadius : '10px' , borderBottomRightRadius : '10px'}}>
                                                        <p>{setLanguage === 'TH' ? 'จำนวนห้อง :  ' : 'Room : '} {item.reservation.room}</p>
                                                        <p>{setLanguage === 'TH' ? 'จำนวนคน : ' : 'People : '}{item.reservation.people}</p>
                                                        <p>{setLanguage === 'TH' ? 'ข้อมูลเพิ่มเติม : ' : 'Other : '}{item.reservation.other}</p>   
                                                        <p>{setLanguage === 'TH' ? 
                                                                'สัตว์เลี้ยง :  '+ 
                                                                (item.reservation.pet === "dog" ? 'สุนัข' : 
                                                                item.reservation.pet === "cat" ?  'แมว' :
                                                                item.reservation.pet === "other" ? 'สัตว์เลี้ยงอื่นๆ' : 
                                                                'ไม่มีสัตว์เลี้ยง')
                                                            : 
                                                                'Pet : '+item.reservation.pet}
                                                        </p>
                                                        <p>{setLanguage === 'TH' ? 'วันที่จอง : ' : 'Date : '}{item.reservation.rental_date.toLocaleString() }</p>
                                                        <p>{setLanguage === 'TH' ? 
                                                                'วัตถุประสงค์ : ' +
                                                                (item.reservation.objective_rental ===  "business" ? "ธุรกิจ" :
                                                                item.reservation.objective_rental === "populate" ? "อยู่อาศัย" :
                                                                item.reservation.objective_rental === "commercial" ? "การพาณิชย์" :
                                                                'ไม่มีวัตถุประสงค์')
                                                            : 
                                                                'Objective : '+item.reservation.objective_rental}
                                                        </p>     
                                                        <div className="block-image-payment">
                                                            <img className="image-payment" src={`data:image/jpeg;base64,${image[item.apartment_id]}`} alt="..."/>
                                                        </div>                                               
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                    </div> 
                                    {/*<button className="btn custom-btn-delete-payment" onClick={() => handleOnDeletepayment(item) }>Delete</button> */}
                                    { selectedItems.includes(item.id_payment) ? (                       
                                            <></>
                                        )
                                        : 
                                        (
                                            <button className="btn custom-btn-select-payment" onClick={() => handleSelectedPayment(item) }>{setLanguage === 'TH' ? 'ชำระเงิน' : 'Playment'}</button>
                                        )
                                    }
                                    
                                </div>   
                                )) 
                                :
                                <label>{setLanguage === 'TH' ? 'ไม่มีการชำระเงินในปัจจุบัน' : "Payment haven't  in current."}</label> 
                            }
                            {selectedItems.length > 0 ? (
                                <button
                                    className="btn custom-btn-select-payment"
                                    onClick={handleSelectListPlayment}
                                >
                                    {setLanguage === 'TH' ? 'ชำระเงิน' : "Playment"}
                                    {'\n'+'(' + selectedItems.length + ')'}
                                </button>
                            ) : (
                                <></>
                            )}
                        </ul>
                        <div className="block-funtion-payment">
                            <h1 className="head-text-payment-function">{setLanguage === 'TH' ? 'ชำระเงิน' : "Playment"}</h1>
                            <div className="block-form-payment-function-payment">
                                <div className="row align-items-start">
                                    <div className="col-7">
                                        <label className="fw-semibold">{setLanguage === 'TH' ? 'ชื่อ ภาษาไทย' : "Thai Name"}</label>
                                        <p className="text-user">
                                            นาย ณัฐพล อัศวาภิรมย์
                                        </p>
                                    </div>
                                    <div className="col">
                                        <label className="fw-semibold">{setLanguage === 'TH' ? 'ชื่อ ภาษาอังกฤษ' : "English Name"}</label>
                                        <p className="text-user">
                                            Natthapol Assawapirom
                                        </p>
                                    </div>
                                    <div className="col-7">
                                        <label className="fw-semibold">{setLanguage === 'TH' ? 'ไอดีบัญชีธนาคาร' : "Bank id"}</label>
                                        <p className="text-user">
                                            123-456-78910
                                        </p>
                                    </div>
                                    <div className="col">
                                        <label className="fw-semibold">{setLanguage === 'TH' ? 'ประเภทธนาคาร' : "Bank type"}</label>
                                        <p className="text-user">
                                            SCB
                                        </p>
                                    </div>
                                </div>
                                <button className="btn custom-btn-confirm-payment" style={{marginLeft: 15}} onClick={() => handleOnConfirm() } disabled={payment.length === 0}>{setLanguage === 'TH' ? 'ตกลง' : "Confirm"}</button>
                            </div>
                        </div>
                        </>

                
            </div> 

            <PopupConfirm setModal={modalConfirm} outModal={() => setModalConfirm(false)} resulte={() => handleOndeleteAll()} setLanguage={setLanguage} />
            <Bank showModal={modalBank} outModal={() => setModalBank(false)} setMoney={totalPrice} setSuccess={handleSuccess} setLanguage={setLanguage}/>
        </div>
    )
}



export default Paymentform;

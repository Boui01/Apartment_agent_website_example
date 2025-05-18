import { useEffect, useState } from "react"
import './PaymentOrder.css'
import axios from "axios"
import DetectNew from "../../../../Function/DetectNew"
function PaymentOrderForm ( {setLogin , setLanguage} ){
    return (
        <>
            <div className="content-Payment">
                <h2>{ setLanguage === 'TH' ? 'รายการการชำระเงิน' : 'PaymentOrder'}</h2>
                <PaymentOrder setLogin={setLogin} setLanguage={setLanguage}/>
            </div>
        </>
    )
}

function PaymentOrder( {setLogin , setLanguage} ){

    const [apartment, setApartment] = useState([])
    const token = JSON.parse(sessionStorage.getItem('token_id'))
    
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response =  await axios.post(`http://127.0.0.1:8000/api/user/dashboard/payments/${setLogin.id}`,{}, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  }   
                );
                console.log(response.data);
                setApartment(response.data.data);
            }
            catch (error) {
                console.error('Error fetching data: ', error);
            }
        }
        fetchData();
    },[setLogin])
    return (
        <>
            <table className="table">
                <thead className="table-secondary">
                    <tr>
                        <th scope="col">{setLanguage === 'TH' ? 'ลำดับ' : 'ID'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'ชื่อ' : 'First Name'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'นามสกุล' : 'Last Name'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'อพาร์ทเม้นท์' : 'Apartment'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'ราคา' : 'Price'}</th>
                        <th scope="col">{setLanguage === 'TH' ? 'สถานะ' : 'Status'}</th>
                    </tr>
                </thead>
                <tbody>
                    {apartment.length > 0 ?
                    <>
                        {   
                            apartment.map( (a,index) =>(
                                    a.status_user === 1 && DetectNew(a.updated_at,2,1)?
                                    <tr className={`table-warning`} 
                                        key={index} 
                                    >
                                        <th scope="row">
                                            <b style={{color : "#ff9900"}}>
                                                {setLanguage === 'TH' ? 'ใหม่ ' : 'New '}
                                            </b> 
                                            {index+1}
                                        </th>
                                        <td>{ setLanguage === 'TH' ? a.employee.thai_fname : a.employee.english_fname}</td>
                                        <td>{ setLanguage === 'TH' ? a.employee.thai_lname : a.employee.english_lname}</td>
                                        <td>{a.apartment.name}</td>
                                        <td>{a.price}</td>
                                        <td>{a.status_employee ? (setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm') : (setLanguage === 'TH' ? 'รอ' : 'Waitting')}</td>
                                    </tr>
                                    :
                                    <></>
                                )
                            )
                        }
                        {   
                            apartment.map( (a,index) =>(
                                    a.status_user === 1 && DetectNew(a.updated_at,1,1)?
                                    <tr>
                                        <th scope="row">{index+1}</th>
                                        <td>{ setLanguage === 'TH' ? a.employee.thai_fname : a.employee.english_fname}</td>
                                        <td>{ setLanguage === 'TH' ? a.employee.thai_lname : a.employee.english_lname}</td>
                                        <td>{a.apartment.name}</td>
                                        <td>{a.price}</td>
                                        <td>{a.status_employee ? (setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm') : (setLanguage === 'TH' ? 'รอ' : 'Waitting')}</td>
 
                                    </tr>
                                    :
                                    <></>
                                )
                            )
                        }
                    </>
                    :
                    <>
                        <tr><td colSpan={6}>{setLanguage === 'TH' ? 'ไม่พบข้อมูล' : 'No data found'}</td></tr>
                    </>
                }
                    <tr></tr>
                </tbody>
            </table>
        </>
    )
}

export default PaymentOrderForm;
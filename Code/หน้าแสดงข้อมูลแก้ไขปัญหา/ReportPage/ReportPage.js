import axios from "axios";
import { useEffect, useState } from "react";
import './ReportPage.css'
import { useNavigate } from "react-router-dom";
import PopupError from '../../PopupError/PopupError';
function ReportPage ({ setLogin , setLanguage }){
    const [search , setSearch] = useState();
    const [data, setData] = useState([]);
    const [sendProblem , setSendProblem] = useState(false);
    const [delaySearch , setDelaySearch] = useState(false);
    const [modalError , setModalError] = useState(false);
    const [modalErrorDetail , setModalErrorDetail] = useState();

    const navigator = useNavigate();
    const Login = sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem('token')) : setLogin;
    const token  = JSON.parse(sessionStorage.getItem('token_id'));
    useEffect(() => {
        const feshdata = async () =>  {
            if(search && delaySearch === false){
                try {
                    const response = await axios.post(`http://127.0.0.1:8000/api/problem/find/${search}`,{},{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    if(response.data[404] || response.data[422]){
                        console.log('error-response-search : ', response.data)
                        setModalError(true)
                        setModalErrorDetail({text : 'Search-Error' , detail : response.data})       
                    }
                    else{
                        console.log('response-search : ', response.data.data)
                        setData(response.data.data)
                        setDelaySearch(true)

                        setTimeout(() => {
                            setDelaySearch(false)
                            console.log('Waitting process search on!')
                        }, 2000);
                    }

                }
                catch (error) {
                    console.log('error : ', error)
                }
            }
            else if(sendProblem){
                try {
                    const response = await axios.post(`http://127.0.0.1:8000/api/problem/${Login.id}`, {search : search} ,{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    if(response.data[404] || response.data[422]){
                        console.log('error-response-create-problem : ', response.data)

                        setModalError(true)
                        setModalErrorDetail({text : 'Problem-Create' , detail : response.data})     
                    }
                    else{
                        console.log('response-create-problem  : ', response.data)
                        alert('Create problem success!')
                        setSearch('')
                        setSendProblem(false)
                    }
                }
                catch (error) {
                    console.log('error : ', error)
                }
            }
            else if(!search && delaySearch === false){
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/api/problems`,{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    if(response.data[404] || response.data[422]){
                        console.log('error-response-problem : ', response.data)
                    }
                    else{
                        console.log('response-problem : ', response.data.data)
                        setData(response.data.data)
                    }
                }
                catch (error) {
                    console.log('error-response-problem ', error)
                }
            }
        }

        feshdata();

    },[sendProblem  , search , delaySearch]);



    return(
        <>
            <div className="block-main-ReportPage">
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">{setLanguage === "TH" ? "กรอกปัญหาที่ค้นหา" : "Input problem"}</label>
                    <input type="text" className="form-control" id="search" aria-describedby="emailHelp" value={search} onChange={(e) => setSearch(e.target.value)} />
                    { data.length > 0 ?<div id="emailHelp" className="form-text">{setLanguage === "TH" ? "ถ้ามีปัญหา ที่มีวิธีการแก้ไขจะแสดงขึ้น" : "If has this problem it will show data fix up."}</div> : <></>}
                </div>
                <div >
                    {data.length > 0?                   
                        data.map( (item,index) => (
                                <div key={index}>
                                    <div className="block-content-ReportPage ">
                                        <div className="accordion " id="accordionExample">
                                            <div className="accordion-item">
                                                <h2 className="accordion-header">
                                                    <button className="accordion-button collapsed  block-content-ReportPage-info" type="button" data-bs-toggle="collapse" data-bs-target={`#${item.id_problem}`} aria-expanded="false" aria-controls="collapse">
                                                            <div className="block-img-content-info-ReportPage">
                                                                <img className="img-ReportPage" src={'./Image/Home_ImageSlide_2.jfif'} alt=""/>
                                                            </div>
                                                            <div className="">
                                                                <p>{item.content}</p>
                                                                <p className="text-soft-ReportPage ">{setLanguage === "TH" ? item.user.thai_fname +'-'+item.user.thai_lname: item.user.english_fname +'-'+item.user.english_lname}</p>
                                                            </div>
                                                    </button>
                                                </h2>
                                                <div id={`${item.id_problem}`} className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body bg-solve-ReportPage">
                                                        <p>{item.solve}</p>
                                                        <div className="text-soft-ReportPage ">
                                                            <label style={{position : "absolute" , right : 10}}>Type : {item.type}</label>
                                                            <label>{setLanguage === "TH" ? "ชื่อแอดมิน : " + item.employee.thai_fname +'-'+item.employee.thai_lname : "Admin Name : " + item.employee.english_fname +'-'+item.employee.english_lname}</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                    :
                        <>
                            <div className="block-non-content-ReportPage">
                                {!Login ? 
                                <p className="text-soft-ReportPage " style={{color:'red'}}>{setLanguage === "TH" ? "คุณต้องเข้าสู่ระบบก่อนส่งปัญหาให้แอดมิน" : "You must login for send problem to Admin"}</p> 
                                : 
                                <p className="text-soft-ReportPage ">{setLanguage === "TH" ? "คุณต้องการส่งปัญหาให้แอดมินหรือไม่ ( ใส่ปัญหาในช่องค้นหา )" : "Do you need send problem to Admin? ( input to search for sent problem )"}</p>}
                                <button className="btn btn-warning" onClick={() => setSendProblem(true)} style={{marginLeft : '1%' , marginTop : 5}} disabled={!Login || !search || (Login ? (Login.status === 'admin' || Login.status === 'employee') ? true : false : true)}>{setLanguage === "TH" ? "ส่งปัญหา" : "Send problem"}</button>
                            </div>
                        </>
                    }
                </div>
                <button className="btn btn-warning btn-contact" onClick={() => navigator('/AdminContact')}>
                    <img src="./Icon/admin.svg" alt="" width={30}/>
                </button>
            </div>  
            <PopupError modalError={modalError} setModalError={setModalError} setDetail={modalErrorDetail}/>
        </>
    )
}

export default ReportPage;
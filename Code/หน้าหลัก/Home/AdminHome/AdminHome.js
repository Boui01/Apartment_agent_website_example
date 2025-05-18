import axios from "axios";
import { useEffect, useState } from "react";
import './AdminHome.css'
import AdminEdite from "./AdminEdite/AdminEdite";
import AdminDelete from "./AdminDelete/AdminDelete";
import PopupSuccess from "../../PopupSuccess/PopupSuccess";
import PopupError from "../../PopupError/PopupError";

function AdminHomeForm({setId , setLogin , outStatus , setLanguage}) {
    return (
        <>
            <div>
                <div className="row align-items-start" style={{margin:'7% 0% 7% 0%'}}>
                    <AdminHome setId={setId} setLogin={setLogin} outStatus={() => outStatus()} setLanguage={setLanguage}/>
                </div>
            </div>
        </>
    )
}



function AdminHome({setId ,  setLogin , outStatus , setLanguage}) {
    const [Edite,setEdite] = useState(false);
    const [Delete,setDelete] = useState(false);
    const [Confirm,setConfirm] = useState(false);

    const [EditeValue,setEditeValue] = useState()
    const [DeleteId,setDeleteId] = useState()

    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin;
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : '';

    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const [ModalSuccessMessage, setModalSuccessMessage] = useState('');

    const [showModalError, setShowModalError] = useState(false);
    const [ModalErrorMessage, setModalErrorMessage] = useState('');

    useEffect(()=>{
        const fetchData = async () => {
            try{
                if(EditeValue){
                    console.log('Data sent : ',EditeValue)
                    const response = await axios.put(`http://127.0.0.1:8000/api/data/${EditeValue.id_apartment}`,EditeValue,{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    ); 
                    if(response.data[422] || response.data[404]){
                        setShowModalError(true)
                        setModalErrorMessage({ 422 : setLanguage === 'TH' ? 'ไม่สามารถแก้ไขข้อมูลได้' : 'Data can not updated!'})
                        console.log('Error data can not updated : ' , response.data)
                    }
                    else{
                        setShowModalSuccess(true)
                        setModalSuccessMessage(setLanguage === 'TH' ? 'แก้ไขข้อมูลสําเร็จ' : 'Data update success! ')

                        setEditeValue()
                    }
                }
                else if(DeleteId && Confirm === true) {
                    const response = await axios.delete(`http://127.0.0.1:8000/api/data/${DeleteId}`,{
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      }
                    );
                    console.log(response.data.data)

                    setShowModalSuccess(true)
                    setModalSuccessMessage(setLanguage === 'TH' ? 'ลบข้อมูลสําเร็จ' : 'Data delete success! ')

                    setEditeValue()
                }
            }
            catch(error){
                console.error('There was an error!', error);
            }
        }
        fetchData()
    },[EditeValue,Confirm,DeleteId])

    const handleEdite = (e) => {
        e.preventDefault();
        setEdite(true) ;
        console.log("Edite Work!")
    }


    const handleDelete = (e) =>{
        e.preventDefault();
        setDelete(true) ;
        setDeleteId(setId);
        console.log("Delete Work!")
    }

    return(
        <>
            <form className="col-4" onSubmit={handleEdite}>
                <button type="submit" className="btn btn-outline-warning">{ setLanguage === "TH" ? "แก้ไข " : "Edite"}</button>
            </form>
            <AdminEdite setShowModal={Edite} outShowModal={() => setEdite(false)} setValue={setEditeValue} setId={setId} setLogin={Login} setLanguage={setLanguage}/>

            <form className="col-4" onSubmit={handleDelete}>
                <button type="submit" className="btn btn-danger">{ setLanguage === "TH" ? "ลบ " : "Delete"}</button>
            </form>
            <AdminDelete setShowModal={Delete} outShowModal={() => setDelete(false)} result={setConfirm} setLanguage={setLanguage}/>
            <PopupSuccess show={showModalSuccess} onHide={() => (setShowModalSuccess(false) , outStatus())} message={ModalSuccessMessage} setLanguage={setLanguage}/>
            <PopupError setModal={showModalError} outModal={() => (setShowModalError(false) , outStatus())} setDetail={ModalErrorMessage} setLanguage={setLanguage}/> 
        </>
    )
}




export default AdminHomeForm;
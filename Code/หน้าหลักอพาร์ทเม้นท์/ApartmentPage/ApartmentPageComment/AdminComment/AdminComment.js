import { useEffect, useState } from "react"
import './AdminComment.css'
import axios from "axios"
import PopupAdminEdit from "./PopupAdminEdit/PopupAdminEdit"
function AdminComment({id_comment , outStatus , setLanguage}) {
    const [Confirm , setConfirm] = useState(false)
    const [ModalEdite , setModalEdite] = useState(false)
    const [State , setState] = useState('')
    const [Edite , setEdite] = useState()
    const [Delete , setDelete] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            if (Confirm === true && Delete) {
                try{
                    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''
                    const res = await axios.delete(`http://127.0.0.1:8000/api/comment/${id_comment}` , {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                    if (res.data[404] || res.data[422]) {
                        console.log('Error response delete comment : ',res.data)
                        setConfirm(false)
                        setDelete()
                        setState('')
                        setModalEdite(false)  
                        outStatus(true)
                    }
                    else{                    
                        console.log('response delete comment : ',res.data)
                        setConfirm(false)
                        setDelete()
                        setState('')
                        setModalEdite(false)   
                        outStatus(true)
                    }

                }
                catch(error){
                    console.error('Error response delete comment : ',error)
                }
            }
            else if (Confirm === true && Edite) {
                try{
                    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''
                    const res = await axios.put(`http://127.0.0.1:8000/api/comment/edite/${id_comment}`,Edite , {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    })
                    if (res.data[404] || res.data[422]) {
                        console.log('Error response edite comment : ',res.data)
                        setConfirm(false)
                        setEdite(null)
                        setState('')
                        setDelete()
                        setModalEdite(false)  
                        outStatus(true)
                    }
                    else{                    
                        console.log('response edite comment : ',res.data)
                        setConfirm(false)
                        setEdite(null)
                        setState('')
                        setDelete()
                        setModalEdite(false)   
                        outStatus(true)
                    }

                }
                catch(error){
                    console.error('Error response edite comment : ',error)
                }
            }

        }
        fetchData()
    },[Confirm])


    const handleEdite = () => {
        setModalEdite(true)
        setState('edit')
    }
    const handleDelete = () => {
        setModalEdite(true)
        setState('delete')
    }

    return (
        <>
            <button className="btn custom-btn-comment-admin btn-edit mt-5" onClick={handleEdite}>{setLanguage === 'TH' ? 'แก้ไข' : 'Edit'}</button>
            <button className="btn custom-btn-comment-admin btn-delete mt-5" onClick={handleDelete}>{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</button>
            <PopupAdminEdit setModal={ModalEdite} outModal={setModalEdite} setState={State} outEdite={setEdite} outConfirm={setConfirm} outDelete={setDelete} setLanguage={setLanguage}/>
        </>
    )
}



export default AdminComment
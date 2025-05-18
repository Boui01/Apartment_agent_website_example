import axios from "axios"
import { useEffect, useState } from "react"
import './ApartmentPageComment.css'
import DetectRule from "../../../Function/DetectRule"
import AdminComment from "./AdminComment/AdminComment"
import ReactTimeago from "react-timeago"


function ApartmentPageComment( {setApartmentId , setLogin , setPagestate , setLanguage} ) {
    const [comment, setComment] = useState([])
    const [newComment , setNewComment] = useState()
    const [updateComment, setUpdateComment] = useState()
    const [remember , setRemember ] = useState([])
    const [status , setStatus] = useState(false)
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''


    useEffect(() => {
        const fetchData = async () => {
            console.log('sent Comment : ' , newComment , updateComment)
            if(newComment){
                try {
                    const response = await axios.post(`http://127.0.0.1:8000/api/comment/${setApartmentId}` , newComment,{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    );
                    setNewComment()
                    console.log('commentNew : ',response.data.data)
                } catch (error) {
                    console.error('Error:', error)
                }
            }
            else if(updateComment){
                try {
                    const response = await axios.put(`http://127.0.0.1:8000/api/comment/${setLogin.id}` , updateComment,{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    );
                    setUpdateComment()
                    console.log('comment-update-New : ',response.data)
                } catch (error) {
                    console.error('Error-comment-update-New:', error)
                }
            }

            try {
                const response = await axios.post(`http://127.0.0.1:8000/api/comment/find/${ setLogin !== undefined ?setLogin.id : 0 }`, {apartmentId : setApartmentId});
                setComment(response.data.data)
                setRemember(response.data.remember)
                setStatus(false)
                console.log('comment : ',response.data)
            } catch (error) {
                console.error('Error:', error)
            }
            
        }
        fetchData()
    },[newComment , updateComment , setLogin , setApartmentId , status])

    const handleComment = (e) => {
        e.preventDefault()
        const data = { description : e.target.comment.value,
                       card_id : sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')).id : setLogin.id,
                    }
        setNewComment(data)
    }

    const handleUpdateComment = (id , position , value) => {
        if(position === 'L'){
            const list = {
                id_comment : id,
                update : value+1,
                position : 'comment_like'
            }
            setUpdateComment(list)
        }
        else if(position === 'U'){
            const list = {
                id_comment : id,
                update : value+1,
                position : 'comment_unlike'
            }
            setUpdateComment(list)
        }
    }


    return(
        <>
            <div className="container-comment mt-5 border-left border-right">
                    <h2 className="text-comment-head">{setLanguage === 'TH' ? 'ความคิดเห็น' : 'Comment'} <br/></h2>
                    {setLogin ?
                        <form onSubmit={handleComment}>
                            <div className="d-flex justify-content-center pt-3 pb-2"> 
                                    <img src={'./Image/Home_ImageSlide_1.jfif'} width="50px" style={{borderRadius : 25 , marginRight : '1%'}} alt="..."/>
                                    <input type="text" name="comment" placeholder={setLanguage === 'TH' ? "เพิ่มความคิดเห็น" : "+ Add your comment"} className="form-control addtxt" required/> 
                                    <button type="submit" className="btn btn-outline-secondary px-3 py-2" style={{marginLeft : '1%'}} disabled={setLogin.status !== 'user'}>{setLanguage === 'TH' ? 'ส่ง' : 'Confirm'}</button>
                            </div>
                        </form>
                        :
                        <></>
                    }
                    {comment.length > 0 ?
                        <>
                            {comment.map((item, index) => (
                                <div key={index} className="row">
                                    <div className="col d-flex justify-content-right py-2">
                                        <div className="second py-2 px-2"> <span className="text1">{item.description}</span>
                                            <div className="d-flex justify-content-between py-1 pt-2">
                                                <div>
                                                    <img src="https://i.imgur.com/AgAC1Is.jpg" width="18" alt="..."/>
                                                    <span className="text2">{ item.users.english_fname+' '+item.users.english_lname}</span>
                                                </div>
                                                <div style={{textAlign : 'right'}}>
                                                    <div >
                                                        <span className={`text3 text-comment-under 
                                                                ${  DetectRule(remember.length > 0 ? remember[0].comment_id : '' , item.id_comment , true , false) ? 
                                                                    DetectRule(remember.length > 0 ? remember[0].like : '' , 1 , 'text-comment-under-active' ,'') :'' 
                                                                }`
                                                            } 
                                                            onClick={() => setLogin ? setLogin.status === 'user' ? handleUpdateComment(item.id_comment,'L',item.comment_like) : setPagestate(true) : setPagestate(true) }>{ setLanguage === 'TH' ? 'ชอบ' : 'Like'}</span>
                                                        <span className="text4">{item.comment_like }</span>
                                                        <span className="thumbup">
                                                            <i className="fa fa-thumbs-o-up"></i>
                                                        </span>
                                                        <span className={`text3 text-comment-under 
                                                            ${  DetectRule(remember.length > 0 ? remember[0].comment_id : '' , item.id_comment , true , false) ? 
                                                                DetectRule(remember.length > 0 ?  remember[0].unlike : '' , 1 , 'text-comment-under-active','') :'' 
                                                            }`
                                                        }                         
                                                        onClick={() => setLogin ? setLogin.status === 'user' ? handleUpdateComment(item.id_comment,'U',item.comment_unlike) : setPagestate(true): setPagestate(true)}>{ setLanguage === 'TH' ? 'ไม่ชอบ' : 'Unlike'}</span>
                                                        <span className="text4">{item.comment_unlike}</span>
                                                    </div>
                                                    <p className="text3" style={{fontSize : '12px' , position : 'relative', top : '10%' , marginBottom : 1}}>
                                                        {item.updated_at ? 'interpolation ' : ''}
                                                        <ReactTimeago date={item.created_at} />
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(setLogin ?  setLogin.status !== 'user' || (setLogin.status === 'user' && item.users.id_card === setLogin.id)  : false )? 
                                        <div className="col">
                                            <AdminComment id_comment = {item.id_comment} outStatus={setStatus} setLanguage={setLanguage}/>
                                        </div>
                                    :
                                    <></>
                                    }
                                </div>
                            ))
                            }

                        </>
                        
                    :
                        <>{ setLanguage === 'TH' ? 'ไม่มีความคิดเห็น' : 'No comment in this apartment'} </>
                    }
            </div>
        </>
    )
}

export default ApartmentPageComment
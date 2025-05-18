import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Favorite.css'
import PopupConfirm from "../PopupConfirm/PopupConfirm";
import PopupEditFavorite from "./PopupEditFavorite/PopupEditFavorite";
function Favoriteform ( {setnotification,setLogin ,setReservationPage , setLanguage} ){

    return(
        <div>
            <h1 className="head-text-favorite">{ setLanguage === "TH" ? 'ชื่นชอบ' : 'Favoriates'}</h1>
            <Favorite setNotification={setnotification} setLogin={setLogin} setReservationPage={setReservationPage} setLanguage={setLanguage}/>
        </div>
    )
}


function Favorite( {setNotification,setLogin ,setReservationPage , setLanguage} ){
    const selected = sessionStorage.getItem('selected')? [JSON.parse(sessionStorage.getItem('selected'))] : '[]';// data to selected
    const [selected_reservation , setSelectedreseRvation] = useState([]);// data to reservation
    const [data,setData] = useState([]);         // data all get from backend
    const [service,setService] = useState([])
    const [image,setImage] = useState([])
    const [favorite,setFavorite] = useState('get');// state to favorite
    const [favorite_delete , setFavoriteDelete] = useState();// data to favorite
    const [favorite_reservation , setFavoriteReservation] = useState([]);
    const [edit , setEdit] = useState();
    const [modalConfirm, setModalConfirm] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const navigate = useNavigate();
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''

    ///////////////////////// Reset //////////////////////////
    //sessionStorage.removeItem('selected');
    //sessionStorage.removeItem('selected_detail');
  
    //////////////////////////////// Use_Effects ////////////////////////////////
    useEffect(() => {
        const fetchData = async () => {
            if(favorite === 'get'){
                try {
                    const response = await axios.post(`http://127.0.0.1:8000/api/favorite/find/${Login.id}`,{},{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    if(response.data[422] || response.data[404]){
                        console.log('Check Get favorite failed : ', response.data)
                    }
                    else{
                        setData(response.data.data);
                        setService(response.data.service);
                        setImage(response.data.image);
                        setFavorite();// reset favorite status
                        console.log("Check Get favorite success : " , response.data)
                    }
                }  
                catch (error) {
                    console.log( "favorite-error : " , error)
                }
            }
            else if(favorite === 'del'){
                try{
                    console.log("Delete_value : " ,favorite_delete )
                    const response = await axios.delete(`http://127.0.0.1:8000/api/favorite/${Login.id}`,{data : {id_favorites : favorite_delete}, 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    console.log("favorite_delete : " , response.data)
                    console.log('Check Delete favorite success')
                    setFavorite('get');// reset favorite status
                    setFavoriteDelete();
                }
                catch (error) {
                    console.error('There was an error!', error);
                }
            }
            else if(favorite === 'reservation') {
                try{
                    const response = await axios.post(`http://127.0.0.1:8000/api/reservation/${Login.id}`,{reservations : favorite_reservation},{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    if(response.data[422] || response.data[404]){
                        console.log('Check Make reservation  failed : ', response.data)
                        setFavorite('get')
                        setFavoriteReservation([]);
                    }
                    else{
                        console.log("Check Make reservation success : " , response.data)
                        setReservationPage('reservation')
                        setFavorite('get')
                        setFavoriteReservation([]);
                    }
                }
                catch (error) {
                    console.log( "reservation -error : " , error)
                }
            }
        }
        fetchData();

    }, [favorite,Login,favorite_delete]);



    //////////////////////////////// Function ////////////////////////////////

    /////// Delete ////////
    const handleOndelete = (item) =>{
        const updatedSelected = selected.filter(id => id !== item.toString());// filter selected to have id equal to id need delete only
        const value_del = data.filter(id => id.id_favorite === item).map(item => item.id_favorite);

        updatedSelected[0] === undefined ? sessionStorage.setItem('selected',JSON.stringify(updatedSelected) ) : sessionStorage.removeItem('selected');
        setFavorite('del')
        setFavoriteDelete(value_del)
        setNotification(updatedSelected)
    }

    const handleOndeleteAll = () => {
        sessionStorage.removeItem('selected');
        const map_id = data.map(id => id.id_favorite);
        setFavorite('del')
        setFavoriteDelete(map_id)
        setNotification([])

    }

    /////// Edit ////////
    const handleOnedit  = (val) =>{
        setModalEdit(true)
        setEdit(val)
    }
    
    /////// Reservation ///////
    const handleOnCheckboxList = (val) =>{
        const { value, checked } = val.target;
        const filter_detail = data.find(item => item.id_favorite.toString() === value)

        setSelectedreseRvation((prevSelected) => {
          // make new value with check value not already in "selected"
            const updatedSelected = checked ? [...prevSelected, filter_detail] : prevSelected.filter(item => item.id_favorite !== filter_detail.id_favorite  );
            const updatedSelected_service_map = updatedSelected.map( (u1) => ({...u1,service :  service.filter( s => s.apartment_id === u1.apartment_id).map(s => s.services.name) }))
            updatedSelected.sort((a, b) => a - b);
            console.log("Data Reservationlist : ",updatedSelected_service_map) 
            return updatedSelected_service_map ;  
        });
    }
    const handleOnPlaymentList = () =>{
        setFavorite('reservation')
        setFavoriteReservation(selected_reservation)
    }
    const handleOnPlayment = (data) => {
        setFavorite('reservation')
        setFavoriteReservation([data])
    }

    return(
        <div>
             <video autoPlay loop muted className="videoBackground">
                <source src="..\Video\Profile.mp4" type="video/mp4"  />
            </video>     
            {data && data.length > 0 ? (
                    <>
                        <div className="block-nav-delete-head-favorite">
                            <button className="btn custom-btn-delete-all-favorite" style={{marginBottom : 20 }} onClick={() => setModalConfirm(true)}>{ setLanguage === "TH" ? 'ลบทั้งหมด' : 'Delete All'}</button>
                        </div>
                        <ul className="row">
                            {data.map((item, index) => ( 
                                <div key={index} className="block-list-favorite-main col-3">

                                    <div>                   
                                        <h6 >{ setLanguage === "TH" ? 'ไอดีอพาร์ทเม้นท์:' : 'Apartment ID:'} {item.apartment_id}</h6>
                                        <div className="form-check">
                                            <input className="form-check-input custom-check-favorite" type="checkbox" value={item.id_favorite} onChange={handleOnCheckboxList}  id="flexCheckDefault"/>
                                        </div>
                                        <p>{ setLanguage === "TH" ? 'ชื่ออพาร์ทเม้นท์ : ' : 'Name: '}{item.apartment.name}</p>  
                                        <p>{ setLanguage === "TH" ? 'บริการ : ' : 'Service: '}{service.filter( s => s.apartment_id === item.apartment_id).map( s => s.services.name + ' | ')}</p>
                                        <p>{ setLanguage === "TH" ? 'ราคา(บาท) : $'+ item.apartment.price : 'Price(baht) : $'+ item.apartment.price }</p>
                                        <p>{ setLanguage === "TH" ? 'เพิ่มเติม : ' : 'Other: '}{item.apartment.description}</p>
                                    </div>  

                                    <div style={{marginRight : "10%",marginBottom : 20 }}>
                                        <div className="accordion accordion-flush" id="accordionFlushExample">
                                            <div className="accordion-item" style={{borderBottomLeftRadius : '10px' , borderBottomRightRadius : '10px'}}>
                                                <h2 className="accordion-header ">
                                                    <button className="accordion-button collapsed custom-block-detail" type="button" data-bs-toggle="collapse" data-bs-target={`#${item.id_favorite}`} aria-expanded="false" aria-controls="flush-collapseTwo">
                                                        { setLanguage === "TH" ? 'รายละเอียด' : 'Detail'}
                                                    </button>
                                                </h2>
                                                <div  id={`${item.id_favorite}`}  className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                                    <div className="accordion-body border"  style={{borderBottomLeftRadius : '10px' , borderBottomRightRadius : '10px'}}>
                                                        <p>{ setLanguage === "TH" ? 'จำนวนห้อง : ' : 'Room: '}{item.room}</p>
                                                        <p>{ setLanguage === "TH" ? 'จำนวนคน : ' : 'People: '}{item.people}</p>
                                                        <p>{ setLanguage === "TH" ? 'ข้อมูลเพิ่มเติม : ' : 'Other: '}{item.other}</p>   
                                                        <p>{setLanguage === 'TH' ? 
                                                                'สัตว์เลี้ยง :  '+ 
                                                                (item.pet === "dog" ? 'สุนัข' : 
                                                                item.pet === "cat" ?  'แมว' :
                                                                item.pet === "other" ? 'สัตว์เลี้ยงอื่นๆ' : 
                                                                'ไม่มีสัตว์เลี้ยง')
                                                            : 
                                                                'Pet : '+item.pet}
                                                        </p>
                                                        <p>{ setLanguage === "TH" ? 'วันที่จอง : ' : 'Date: '}{item.rental_date.toLocaleString() }</p>
                                                        <p>{setLanguage === 'TH' ? 
                                                                'วัตถุประสงค์ : ' +
                                                                (item.objective_rental ===  "business" ? "ธุรกิจ" :
                                                                item.objective_rental === "populate" ? "อยู่อาศัย" :
                                                                item.objective_rental === "commercial" ? "การพาณิชย์" :
                                                                'ไม่มีวัตถุประสงค์')
                                                            : 
                                                                'Objective : '+item.objective_rental}
                                                        </p>  
                                                        <div className="block-image-favorite">
                                                            <img className="image-favorite" src={`data:image/jpeg;base64,${image[item.apartment_id]}`} alt="..."/>
                                                        </div>                                               
                                                    </div>
                                                </div>
                                            </div>
                                        </div> 
                                    </div>                                              
                                    <button className="btn custom-btn-delete-favorite" onClick={() => handleOndelete(item.id_favorite) }>{ setLanguage === "TH" ? 'ลบ' : 'Delete'}</button>
                                    <button className="btn custom-btn-edite-favorite" onClick={() => handleOnedit(item)}>{ setLanguage === "TH" ? 'แก้ไข' : 'Edit'}</button>
                                    {selected_reservation.length > 0?
                                    <>
                                        {selected_reservation.findIndex(id => id.id_favorite === item.id_favorite) === -1 ?
                                            <button className="btn custom-btn-reservation-favorite" style={{marginLeft: 15}} 
                                                onClick={() => handleOnPlayment(item) }>
                                                { setLanguage === "TH" ? 'จองอพาร์ทเม้นท์' : 'Reservation'}
                                            </button>
                                            :
                                            <></>
                                        }
                                    </>
                                    :
                                    <>
                                        <button className="btn custom-btn-reservation-favorite" style={{marginLeft: 15}} 
                                            onClick={() => handleOnPlayment(item) }>
                                            { setLanguage === "TH" ? 'จองอพาร์ทเม้นท์' : 'Reservation'}
                                        </button>
                                    </>
                                    }
                                    

                                </div>                                                                                     
                            ))}
                            {selected_reservation.length > 0?
                            <>                                        
                                <button className="btn custom-btn-Confirm-favorite"  
                                    onClick={() => handleOnPlaymentList() }>
                                    {'('+selected_reservation.length+') '}
                                    { setLanguage === "TH" ? 'ตกลง' : 'Confirm'}
                                </button>
                            </>
                            :
                            <></>
                            } 
                        </ul>
                    </>
                ) 
                :
                (
                    <p>{ setLanguage === "TH" ? 'ไม่มีข้อมูล' : 'No data'}</p>
                )
            } 
            <PopupConfirm setModal={modalConfirm} outModal={() => setModalConfirm(false)} resulte={() => handleOndeleteAll()} setLanguage ={setLanguage}/>
            <PopupEditFavorite setModal={modalEdit} outModal={() => setModalEdit(false)} setEdit={edit} setLogin = {Login} token={token} outStatus={() => setFavorite('get')} setLanguage={setLanguage} />
        </div>
    )
}



export default Favoriteform;

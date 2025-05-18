import axios from "axios"
import { useEffect, useState } from "react"
import './ApartmentPage.css'
import PopupInfo from "../Home/PopupInfo/PopupInfo"
import CreateNumToList from "../../Function/CreateNumToList"
import ApartmentPageComment from "./ApartmentPageComment/ApartmentPageComment"
import PopupConfirm from "../PopupConfirm/PopupConfirm"

function ApartmentPageForm( {setLogin , setNotification ,setPagestate , setReservationPage  , setLanguage } ) {
    const apartmentValue = JSON.parse(sessionStorage.getItem('apartmentPageValue'))
    const [next, setNext] = useState(0)
    const [Reservation ,setReservation] = useState([])
    const [clickReservation , setClickReservation] = useState([])
    const [unfavorite , setUnfavorite] = useState(false)
    const [favoriteDetail , setFavoriteDetail] = useState([])
    const [favorite , setFavorite] = useState(JSON.parse(sessionStorage.getItem('selected')) || ['[]'])
    const [showModel , setShowModel ] = useState(false)
    const [showModalConfirm , setShowModalConfirm] = useState(false)
    const [likeAparment , setLikeApartment] = useState(false)
    const [likeApartmentStatus , setLikeApartmentStatus] = useState(false)
    const [checkboxState , setCheckboxState] = useState(true)
    const Login = sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem('token')) : setLogin;
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : '';

                            ////// Effect ///////   
    //sessionStorage.removeItem('selected_detail');
    //sessionStorage.removeItem('selected');
    
    // Get favorite
    useEffect(() => {
        const fetchData = async () => {
            if( checkboxState === true ){                
                try{ 
                    // sent request
                    if(Login){
                        const response = await axios.post(`http://127.0.0.1:8000/api/favorite/find/${Login.id}`,{},{ 
                            headers: {
                              Authorization: `Bearer ${token}`,
                            }
                          } 
                        )
                        if(response.data[422] || response.data[404]){
                            console.log('Check Get favorite_apartmentPage failed : ', response.data)
                        }
                        else{
                            console.log('Check Get favorite_apartmentPage : ' , response.data)
                            // response
                            const favorites = response.data.data.map(item => item.apartment_id.toString())
                            const favorite_filter_emty = favorites[0] !== "" ? favorites : []
                            // set new value
                            sessionStorage.setItem('selected', JSON.stringify(favorite_filter_emty));
                            setFavorite(favorite_filter_emty)
                            setFavoriteDetail(response.data.data)
                            setNotification(favorite.length)
                            // set checkbox
                            setCheckboxState(false)
                        }
                    }
                    // check data log
                    console.log("session_Selected : ",sessionStorage.getItem('selected')); 
                }
                catch (error) {
                    console.error('Error check Get favorite_apartmentPage!', error);
                }
            }
    }
        fetchData();
    
      },[checkboxState]);


    // set like apartment and unfavorite 
    useEffect(() => {
        console.log('ApartmentValue : ' , apartmentValue)

        const freshdata = async () => {

            if(Login !== undefined){
                // set unfavorite
                if(unfavorite){
                    try{
                        console.log('delete sent : ',apartmentValue.data.id_apartment)
                        const response = await axios.delete(`http://127.0.0.1:8000/api/favorite/apartment/${Login.id}`,{
                            data :{apartment_ids : [apartmentValue.data.id_apartment] }, 
                            headers: {
                              Authorization: `Bearer ${token}`,
                            }
                          } 
                        )
                        console.log(response.data)
                        setUnfavorite(false)
                    }
                    // Error unfavorite
                    catch(error){
                            console.error(error)
                    }
                }

            }

        }
        freshdata()
    },[Login , apartmentValue , unfavorite ])



    // Get like apartment
    useEffect(() => {
        const freshdata = async () => {

            // set like apartment
            if(likeAparment && apartmentValue){
                try{
                    const response = await axios.post(`http://127.0.0.1:8000/api/data/like/${Login.id}`,{apartment_id : apartmentValue.data.id_apartment},{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    if(response.data[404] || response.data[422]){
                        console.log('erorr-response-like-apartment : ',response.data)
                        setLikeApartment(false)
                    }
                    else{
                        console.log('response-like-apartment : ',response.data)
                        setLikeApartmentStatus(response.data.status)
                        setLikeApartment(false)
                    }
                }
                catch(error){
                        console.error('error-response-like-apartment : ',error)
                }
            }

            // check like apartment
            if(Login && apartmentValue){
                try{
                    const response = await axios.post(`http://127.0.0.1:8000/api/data/like/find/${Login.id}`,{apartment_id : apartmentValue.data.id_apartment},{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    if(response.data[404] || response.data[422]){
                        console.log('erorr-response-check-like-apartment : ',response.data)
                    }
                    else{
                        console.log('response-check-like-apartment : ',response.data)
                        setLikeApartmentStatus(response.data.status)
                    }
                }
                catch(error){
                    console.error('error-response-check-like-apartment : ',error)
                }
            }
        }

        freshdata()
    },[likeAparment /* Don't put apartmentValue follow error react */])

    useEffect(() => {
        const freshdata = async () => {
            if(Reservation){
                try{
                    const response = await axios.post(`http://127.0.0.1:8000/api/reservation/${Login.id}`,{reservations : Reservation},{ 
                        headers: {
                          Authorization: `Bearer ${token}`,
                        }
                      } 
                    )
                    if(response.data[404] || response.data[422]){
                        console.log('erorr-response-reservation : ',response.data)
                    }
                    else{
                        console.log('response-reservation : ',response.data)
                        setReservation([])
                        setReservationPage()
                    }
                }
                catch(error){
                    console.error('error-response-reservation : ',error)
                }
            }
        }

        freshdata()
    },[Reservation])  
    
    
    
                            //////// function ///////   
    const handleReservation = () => {
        console.log('Check reservation : ' , favoriteDetail)
        const get = favoriteDetail.findIndex(item => item.apartment_id === apartmentValue.data.id_apartment )
        if (get !== -1){
            setShowModalConfirm(true)
        }else{
            // Make for get rooms
            setFavorite((prevSelected) => {
            // make new value with check value not already in "selected"
                const updatedSelected =[...prevSelected, apartmentValue.data.id_apartment.toString()] ;
                updatedSelected.sort((a, b) => a - b);
                return updatedSelected;
            })
            // set value
            setClickReservation([apartmentValue.data.id_apartment])
            setShowModel(true)
        }

    }

    const handleFavorite = () => {

        setFavorite((prevSelected) => {
            // make new value with check value not already in "selected"
            console.log('Check favorite : ' , prevSelected)
            const sameValue = prevSelected.includes(apartmentValue.data.id_apartment.toString()) // check equal value
            if (!sameValue){
                const updatedSelected = !prevSelected.includes('[]') ? [...prevSelected, apartmentValue.data.id_apartment.toString()] : [apartmentValue.data.id_apartment.toString()];
                updatedSelected.sort((a, b) => a - b);
                setShowModel(true)
                return updatedSelected;
               }
            else{
                const updatedSelected = prevSelected.filter(item => item !== apartmentValue.data.id_apartment.toString())
                sessionStorage.setItem('selected', JSON.stringify(updatedSelected))
                setUnfavorite(true)
                setNotification(updatedSelected.length)
                setShowModel(false)
                return updatedSelected;
               }   
          }); 

    }
    const handleLikeApartment = () => {
        setLikeApartment(true)
    }

    return(
        <>
            {next === 0 ?
                <div>
                    <div className="bg-img-next animation-left">
                        <div className="block-text-img-next">
                            <h2 className="text-img-next">{ setLanguage === 'TH' ? 'ชื่อ อพาร์ทเม้นท์' : "Apartment name"}</h2>
                            <p className="text-img-next">{ setLanguage === 'TH' ? apartmentValue.data.thai_name : apartmentValue.data.name}</p>
                            <button className="btn btn-success btn-img-next" onClick={() => setNext(1)}>{ setLanguage === 'TH' ? 'ต่อไป' : "Next"}</button>
                        </div>
                    </div>
                    <img src={'data:image/jpeg;base64,'+  apartmentValue.image[ apartmentValue.data.id_apartment ]} className="d-block w-100 block-img-next animation-left" alt="..." />
                </div>
            : next === 1 ?
                <div>
                    <div className="bg-img-next animation-up" style={{right : 0}}>
                        <div className="block-text-img-next">
                            <h2 className="text-img-next">{ setLanguage === 'TH' ? 'รายละเอียด' : "Description"}</h2>
                            <p className="text-img-next">{ setLanguage === 'TH' ? apartmentValue.data.thai_description : apartmentValue.data.description}</p>
                            <button className="btn btn-success btn-img-next" onClick={() => setNext(2)}>{ setLanguage === 'TH' ? 'ต่อไป' : "Next"}</button>
                        </div>
                    </div>
                    <img src={'data:image/jpeg;base64,'+  apartmentValue.image[ apartmentValue.data.id_apartment ]} className="d-block w-100 block-img-next animation-up" alt="..." />
                </div>
            : next === 2 ?
                <div>
                    <div className="bg-img-next animation-left">
                        <div className="block-text-img-next">
                            <h2 className="text-img-next">{setLanguage === 'TH' ? 'บริการ' : "Service"}</h2>
                            <p className="text-img-next">{apartmentValue.data.service}</p>
                            <label><img className="content-img" src="./Icon/bed.png" alt="bed"/> {apartmentValue.data.bedroom}</label>
                            <label style={{marginLeft : '1%'}}><img className="content-img" src="./Icon/shower.png" alt="shower"/> {apartmentValue.data.bathroom}</label>
                            <p className="text-img-next" style={{marginLeft : '1%'}} >{setLanguage === 'TH' ? 'ราคา' : "Price "} : {apartmentValue.data.price}</p>
                            <button className="btn btn-success btn-img-next" onClick={() => setNext(3)}>{ setLanguage === 'TH' ? 'ต่อไป' : "Next"}</button>
                        </div>
                    </div>
                    <img src={'data:image/jpeg;base64,'+  apartmentValue.image[ apartmentValue.data.id_apartment ]} className="d-block w-100 block-img-next animation-left" alt="..." />
                </div>
            :
                <>           
                    <button className="btn btn-warning btn-Reservation-fix" onClick={handleReservation} disabled={!(Login) || (Login !== undefined ? (Login.status === 'admin' || Login.status === 'employee') : false)}>
                        { setLanguage === 'TH' ? 'จองห้องพัก' : "Reservation"}
                    </button>
                    <div className="block-main animation-up">
                        <div className="block-head">
                            <div className="block-img-head-content row">
                                <div className="col">
                                    <img src={'data:image/jpeg;base64,'+  apartmentValue.image[ apartmentValue.data.id_apartment ]} className="d-block w-100 img-head-content-start zoom-Up" alt="..." />
                                </div>
                            </div>
                        </div>
                        <div style={{padding : 40 , backgroundColor : "#404040" , marginBottom : 20, boxShadow : '1px 5px 10px black'}}></div>
                        <div className="block-content">
                                <div className="head-content">
                                    <h1 className="head-text">{ setLanguage === 'TH' ? 'อพาร์ทเม้นท์' : "Apartment"}</h1>
                                </div>
                                <div className="body-content row">
                                    <h2 style={{textAlign : "center" , marginBottom : 20}}>{ setLanguage === 'TH' ? apartmentValue.data.thai_name : apartmentValue.data.name}</h2>
                                    <div className="block-content-decription col-7">
                                        <h5 style={setLanguage === 'TH' ? {fontWeight : 'bold' } : {}}>{ setLanguage === 'TH' ? 'รายละเอียด' : "Description"}</h5>
                                        <p style={{marginLeft : '1%'}}>{ setLanguage === 'TH' ? apartmentValue.data.thai_description : apartmentValue.data.description}</p>
                                        <h5 style={setLanguage === 'TH' ? {fontWeight : 'bold' } : {}}>{ setLanguage === 'TH' ? 'ที่อยู่อพาร์ทเม้นท์' : "Address"}</h5>
                                        <p style={{marginLeft : '1%'}}>{apartmentValue.data.address}</p>
                                    </div>
                                    <div className="col-5">
                                        <div className="block-img-favarite">
                                            { Login !== undefined ?
                                                <>
                                                    <button type="button" onClick={handleLikeApartment} className={`btn custom-btn-like_apartment-apartmentpage ${likeApartmentStatus ? 'active-like-apartment' : ''}`}  disabled={Login.status !== 'user'}>
                                                        { setLanguage === 'TH' ? 'ให้คะแนน' : "Like"}
                                                    </button>

                                                    <button onClick={handleFavorite} className={`btn ${ !favorite.includes( apartmentValue.data.id_apartment.toString()) ? 'custom-btn-favorite-apartmentpage' : 'custom-btn-unfavorite-apartmentpage'}`}  disabled={Login.status !== 'user'}>
                                                        {
                                                            setLanguage === 'TH' ?
                                                                !favorite.includes( apartmentValue.data.id_apartment.toString()) ? 'ชื่นชอบ' : 'เลิกชื่นชอบ'
                                                            :
                                                                !favorite.includes( apartmentValue.data.id_apartment.toString()) ?  'Favorite' : 'Unfavorite'
                                                        }
                                                    </button>
                                                </>
                                               :
                                                <></>
                                            }
                                        </div>
                                        <h5 style={setLanguage === 'TH' ? {fontWeight : 'bold' } : {}}>{ setLanguage === 'TH' ? 'บริการ' : "Service"}</h5>
                                        <p style={{marginLeft : '1%'}}>{apartmentValue.service.map( (s,index) => <li key={index}>{ setLanguage === 'TH' ? s.services.thai_name : s.services.name}</li>)}</p>
                                    </div>
                                    <div className="block-score col-7">

                                        <h5 style={setLanguage === 'TH' ? {fontWeight : 'bold' } : {}}>{ setLanguage === 'TH' ? 'ราคา' : "Price"} </h5>
                                        <p style={{marginLeft : '1%'}} >{apartmentValue.data.price}</p>
                                        <div className="stars-container">
                                            {CreateNumToList(   Math.floor(5-(apartmentValue.data.score/20))  ,
                                                <label>
                                                    <img className="content-img" src="./Icon/star-space.svg" alt="star" style={{marginLeft : 5}}/>
                                                </label>
                                                ,5
                                            )}
                                            {CreateNumToList(  !Number.isInteger(apartmentValue.data.score/20) ?  1 : 0 ,
                                                <label>
                                                    <img className="content-img" src="./Icon/star-half.png" alt="star" style={{marginLeft : 5}}/>
                                                </label>
                                                ,5
                                            )}
                                            {CreateNumToList( Math.floor(apartmentValue.data.score/20) ,
                                                <label>
                                                    <img className="content-img" src="./Icon/star.png" alt="star" style={{marginLeft : 5}}/>
                                                </label>
                                                ,5
                                            )}
                                            <h5>{ setLanguage === 'TH' ? 'คะแนน' : "Rating"} : </h5>
                                        </div> 
                                    </div>
                                    <div className="col-5">
                                        <h5 style={setLanguage === 'TH' ? {fontWeight : 'bold' } : {}}>{ setLanguage === 'TH' ? 'รายละเอียด' : "Detail"} </h5>
                                        <p style={{marginLeft : '1%'}}><img className="content-img" src="./Icon/bed.png" alt="bed"/> {apartmentValue.data.bedroom}</p>
                                        <p style={{marginLeft : '1%'}}><img className="content-img" src="./Icon/shower.png" alt="shower"/> {apartmentValue.data.bathroom}</p>
                                    </div>
                                </div>
                        </div>
                        <div style={{padding : 1 , backgroundColor : "rgba(88, 88, 88, 0.733)" , margin : '5% 2% 0% 2%'}}></div>
                        <ApartmentPageComment setApartmentId={apartmentValue.data.id_apartment} setLogin={Login} setPagestate={setPagestate} setLanguage={setLanguage}/>
                    </div>
                </>
            }
            <PopupInfo setShowModal={showModel} outShowModal={setShowModel} setSelected={favorite}  setNewChange ={[null]} setReservation={clickReservation} outReservation={() => setReservation([])} outCheckboxState={() => setCheckboxState(true)} setLogin={setLogin} setNotification={setNotification} setReservationPage={setReservationPage} setLanguage={setLanguage}/>
            <PopupConfirm setModal={showModalConfirm} outModal={() => setShowModalConfirm(false)} text={'Are you sure you want to reserve this apartment ?'} resulte={() => setReservation([ favoriteDetail.find(item => item.apartment_id === apartmentValue.data.id_apartment ) ])} />
        </>
    )
}




export default ApartmentPageForm


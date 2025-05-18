import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopupInfo from './PopupInfo/PopupInfo';
import PageChange from './PageChange/PageChange';
import ImageSlideForm from './ImageSlide/ImageSlide';
import NavbarSlide from './NavbarSlide/NavbarSlide';
import '../Home/Home.css';
import PopupExpandInfoForm from './PopupExpandInfo/PopupExpandInfo';
import AdminHomeForm from './AdminHome/AdminHome';
import ApartmentAddForm from './ApartmentAdd/ApartmentAdd';
import CreateNumToList from '../../Function/CreateNumToList';
import PopupExpandUserInfoForm from './PopupExpandUserInfo/PopupExpandUserInfo';
import { useNavigate } from 'react-router-dom';
import ReactTimeago from 'react-timeago';
import DetectNew from '../../Function/DetectNew';
import PopupConfirm from '../PopupConfirm/PopupConfirm';
import en from 'react-timeago/lib/language-strings/en';
import th from 'react-timeago/lib/language-strings/th';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

export default function Home( {setSearch , setnotification , setLogin , setApartmentPage ,setReservationPage , setLanguage}) {
  const session_Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin;
  const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : '';

  const [data, setData] = useState([]);
  const [dataAll, setDataAll] = useState([]);
  const [page,setPage] = useState(1);
  const [activeState , setActiveState] = useState('home_1');
  const [ReservationValue,setReservationValue] = useState()
  const [service , setService] = useState([])
  const [imageUser , setImageUser] = useState([])
  const [imageApartment , setImageApartment] = useState([])
  const [refresh , setRefresh] = useState(false);
  const [newData , setNewData] = useState([]);
  const [reservation , setReservation] = useState();

  const formatterTH = buildFormatter(th);
  const formatterEN = buildFormatter(en);
  //// Value language ////
  const [versionLanguage , setVersionLanguage] = useState("TH");

  //// Value select ////
  const [selected, setSelected] = useState([]);// Data selected in current refresh page

  //// Value favarite ////
  const [session_Selected_Get, setSessionSelectedGet] = useState([]);// Data for check new data session changeing

  //// Value Reservation ////
  const navigate = useNavigate()
 
  //// Value page ////
  const limit = 4;// limit show data in 1 page
  const [page_limit,outPagelimit ]= useState();// set show data follow page choose current

  //// Value Popup ////
  const [showModal, setShowModal] = useState(false);
  const [checkboxState , setCheckboxState] = useState(true);
  const [new_Change , setNewChange] = useState([]);
  const [clickReservation , setClickReservation] = useState(0);

  const [showModalExpand, setShowModalExpand] = useState(false);
  const [dataModalExpand , setDataModalExpand] = useState('');

  const [showModalExpandUser , setShowModalExpandUser] = useState(false);
  const [dataModalExpandUser , setDataModalExpandUser] = useState('');

  const [showModalConfirm , setShowModalConfirm] = useState(false);
  const [dataModalConfirm , setDataModalConfirm] = useState(false);



///////////////////////// Reset //////////////////////////
  //sessionStorage.removeItem('selected');
  //sessionStorage.removeItem('token');
  

//----------------------------------///////////     Data Home    /////////////---------------------------------------------------------//

                              ///// API //////
  useEffect(() => {
    const fetchData = async () => {

        try {
          if(setSearch && setSearch.length > 0) {
            const response = await axios.get(`http://127.0.0.1:8000/api/data/search/${setSearch}`); 
            if(response.data[404] || response.data[422]){
              console.log('Error Search Home 1 : ', response.data)
            }
            else{
              console.log('Search Home 1  :', response.data); 
        
              // set new value
              setData(response.data.data);
              setService(response.data.service)
              setDataAll(response.data.data)
              setNewData(response.data.data.filter(d => DetectNew(d.created_at,2,1) ))
    
              // convert image to show 
              const image = response.data.image;
              const image_user = response.data.image_user;
              setImageApartment(image)
              setImageUser(image_user)
            }         
          }
          else if(activeState === 'home_1'){
            const response2 = await axios.get('http://127.0.0.1:8000/api/data');
            if(response2.data[404] || response2.data[422]){
              console.log('Failled in find data Home 1  : ', response2.data )
              setData([]);
              setService([])
              setDataAll([]);
              setNewData([])
            }
            else{
              console.log('Data Home 1 :', response2.data);  
              // set new value
              setData(response2.data.data);
              setService(response2.data.service)
              setDataAll(response2.data.data);
              setNewData(response2.data.data.filter(d => DetectNew(d.created_at,2,1) ))

              // convert image to show 
              const image = response2.data.image;
              const image_user = response2.data.image_user;
              setImageApartment(image)
              setImageUser(image_user)
            }

          }

          else if(activeState === 'home_2'){
            const response2 = await axios.get(`http://127.0.0.1:8000/api/data/owner/${session_Login.id}`);
            if(response2.data[404] || response2.data[422]){
              console.log('Failled in find data Home 2 : ', response2.data )
              // set new value
              setData([]);
              setService([])
              setDataAll([]);
              
            }
            else{
              console.log('Data Home 2 :', response2.data);  
              // set new value
              setData(response2.data.data);
              setService(response2.data.service)
              setDataAll(response2.data.data);
              setNewData(response2.data.data.filter(d => DetectNew(d.created_at,2,1) ))

              // convert image to show 
              const image = response2.data.image;
              const image_user = response2.data.image_user;
              setImageApartment(image)
              setImageUser(image_user)
            }

          }  
          

          else if(activeState === 'home_3'){
            const response2 = await axios.get(`http://127.0.0.1:8000/api/data/other/${session_Login.id}`);
            if(response2.data[404] || response2.data[422]){
              console.log('Failled in find data Home 3 : ', response2.data )
              // set new value
              setData([]);
              setService([])
              setDataAll([]);
              
            }
            else{
              console.log('Data Home 3 :', response2.data);  
              // set new value
              setData(response2.data.data);
              setService(response2.data.service)
              setDataAll(response2.data.data);
              setNewData(response2.data.data.filter(d => DetectNew(d.created_at,2,1) ))

              // convert image to show 
              const image = response2.data.image;
              const image_user = response2.data.image_user;
              setImageApartment(image)
              setImageUser(image_user)
            }

          }  


          setRefresh(false)
          console.log('SessionLogin :', session_Login);  
        }
        catch (error) {
          console.error('Apartment data Home error! : ', error);

        }


      }    

    fetchData();

  }, [setSearch , page  , refresh , activeState]);






//--------------------------------------------///////////      Select Checkbox List    /////////////---------------------------------------------------------//

                                                      ///////////      API       /////////////
useEffect(() => {
  const fetchData = async () => {
      if( checkboxState === true){
        try{ 
            // sent request
            if(session_Login){
              const response = await axios.post(`http://127.0.0.1:8000/api/favorite/find/${session_Login.id}`,{},{ 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            )
              
              if(response.data[422] || response.data[404]){
                console.log('Check Get favorite_home failed : ', response.data)
              }
              else{
                console.log('Check Get favorite_home : ' , response.data.data.map(item => item.apartment_id.toString()))
                // response
                const favorites = response.data.data.map(item => item.apartment_id.toString())
                const favorite_filter_emty = favorites[0] !== "" ? favorites : []
                // set new value
                sessionStorage.setItem('selected', JSON.stringify(favorite_filter_emty));
                setSelected(favorite_filter_emty)
                setReservationValue(response.data.data)
                setCheckboxState(false);
              }
            }
            // check data log
            console.log("session_Selected : ",sessionStorage.getItem('selected')); 
        }
        catch (error) {
          console.error('There was an error!', error);
        }
    }
  }
  fetchData();

},[selected,clickReservation,checkboxState]);


/////// Reservation ////////
useEffect(() => {
  const freshdata = async () => {
    if(reservation && dataModalConfirm){
      try{
        const response = await axios.post(`http://127.0.0.1:8000/api/reservation/${session_Login.id}`,{reservations : reservation},{ 
          headers: {
            Authorization: `Bearer ${token}`,
          }
        } 
      )
        if(response.data[404] || response.data[422]){
          console.log('Reservation failed : ', response.data)
          setReservation();
        }
        else{
          console.log('Reservation : ', response.data.data)
          setReservation();
          setDataModalConfirm(false);
          // set window
          setReservationPage('reservation')
        }
      }
      catch (error) {
        console.error('There was an error!', error);
      }
    }
  }
  freshdata();
}, [ dataModalConfirm, reservation ]);




 ///////  Get real time   /////////
  useEffect(() => {
    const interval = setInterval(() => {
      const session_Data = sessionStorage.getItem('selected') || '[]';
      setSessionSelectedGet(session_Data)
    }, 200);

    return () => clearInterval(interval);
  }, []);


  ////// Notification ////////
  useEffect(() => {
        setnotification(session_Selected_Get.length);
      }, [ setnotification ,selected ]);
  
  ///////  Get Language   /////////
  useEffect(() => {
        setVersionLanguage(setLanguage);
  }, [setLanguage]);











                                                        ///////////      Function       /////////////
const handleCheckboxListChange = async (event)  => {
  const { value, checked } = event.target;// get value at input checkbox and "checked" mean checkbox "true or false"

  // Check is checkbox true or false for open popup
  if(checked){
    setShowModal(true);
  }
  else{
    // Send Delete to change checkbox false
    setSelected((prevSelected) => {
      const updatedSelected = prevSelected ? prevSelected.filter(id => id === value) : [];// filter value is id equal with click check false
      updatedSelected.sort((a, b) => a - b);
     if(updatedSelected.length > 0){  
        setNewChange(updatedSelected.map(item => item));// set for delete data detail in Popup page
      }
      else{
        setNewChange(["space"]);// for fix bug checking effect in popup 
      }

      return updatedSelected;
    });      
  }

  // make new value with check value not already in "selected"
  setSelected((prevSelected) => {
  
    const updatedSelected = checked ? [...prevSelected, value] : prevSelected.filter(item => item !== value  );
    updatedSelected.sort((a, b) => a - b);

    console.log('Check function Selected checkbox : ' , updatedSelected)
    return updatedSelected;  
  });
   
  console.log('Modal check  : ' , showModal   )
}









//-------------------------------------------------------------///////////      Reservation     /////////////---------------------------------------------------------//

                                                              ///////////      Function       /////////////
const handleReservation = (id) => {
  // check has data equal in data previous
  if(selected.findIndex(item => item === id.toString()) === -1){
    setSelected((prevSelected) => {
      // make new value with check value not already in "selected"
        const updatedSelected =[...prevSelected, id] ;
        updatedSelected.sort((a, b) => a - b);
        setSelected ( updatedSelected )
        return updatedSelected;
    })
    // set value
    setShowModal(true);// set show Popup detail
    setClickReservation([id])

  }
  else{
    setShowModalConfirm(true)
    setReservation( ReservationValue.filter( (p) => p.apartment_id.toString() === id) )
  }
};






//-------------------------------------------------------------///////////     PopuupExpandInfo    /////////////---------------------------------------------------------//
                                                              
                                                                ///////////      Function       /////////////////
const handleClickExpandInfo = (data) => {
      console.log("data : ",data)
      const service_filter = service.filter( s => s.apartment_id === data.id_apartment)
      setShowModalExpand(true);
      setDataModalExpand({data : data , service : service_filter});
      sessionStorage.setItem('apartmentPageValue', JSON.stringify({data : data , service : service_filter , image : imageApartment}));
    }
  
    const handleClickExpandInfoUser = (data) => {
      setShowModalExpandUser(true);
      setDataModalExpandUser( {data : data , image : imageUser});
    }



  ///////////////////////////// Main function ////////////////////////////////////////
  return (
    <>
      <div className="row Home-Page-Main"  >
        <ImageSlideForm setImage={  imageApartment }/>
        <div className='block-between-Imag-NavSlide'></div> 
        <NavbarSlide setLogin={session_Login} outActive={setActiveState} setLanguage={setLanguage}/> 
        <div className="col Home-Page-Right container ">
          <div className="scrollspy-example-2" data-bs-spy="scroll" tabIndex="0">
            <div id="Home_1 container" >
              <div className='row HeadClass' >
                  <h2 className={`${ versionLanguage === "TH" ?  "col-3" : "col-2"} h2HeadClass`}>{ versionLanguage === "TH" ? "ห้องพักอพาร์ทเม้นท์" : "Apartment"}</h2>
                  {session_Login ?  
                      <ApartmentAddForm setLogin ={setLogin} setStatus={setRefresh} setLanguage={setLanguage}/>
                    :
                    <></>
                  }
              </div>
              {data && data.length > 0 ? (
                <>
                  <div className='row row-cols-2 ListApartment-animation ListApartment-block'>
                    {newData.map((item, index) => (
            
                    index+1 > (page_limit - limit ) &&
                    index+1 <= page_limit &&
                     item.total_room > 0
                    ?

                      <div key = {index} className='MarginDefualt col-5'>
                        <div  className='ListApartment ' >
                          <label className='custom-label-new-home'>{ versionLanguage === "TH" ? "ใหม่" : "New"}</label>
                          <div onClick={()=>handleClickExpandInfo(item)} className='card-apartment-home'>
                            <div>

                              <div className='block-image-star-home'>
                                { CreateNumToList( Math.floor(5-(item.score/20)) ,
                                    <img src='./Icon/star-space.svg' className='image-star-home' alt='...'/>
                                    ,5).map( m => m) 
                                }
                                { CreateNumToList( !Number.isInteger(item.score/20) ? 1 : 0,
                                    <img src='./Icon/star-half.png' className='image-star-home' alt='...'/>,
                                    5).map( m => m) 
                                }
                                { CreateNumToList( Math.floor(item.score/20 ),
                                    <img src='./Icon/star.png' className='image-star-home' alt='...'/>,
                                    5).map( m => m) 
                                }
                              </div>
                            </div>
                            <h4>{ versionLanguage === "TH" ? item.thai_name : item.name}</h4>
                            <p style={{marginBottom : '3%', fontWeight : 'bold' }}>{ versionLanguage === "TH" ? "อพาร์ทเม้นท์ เลขที่: " : "Apartment No: "} {item.id_apartment}</p> 
                            <p>{ versionLanguage === "TH" ? "รายละเอียด : "+ item.thai_description : "Description : "+ item.description}</p>
                            <p>{ versionLanguage === "TH" ? "บริการ : " : "Service : "}{service.filter( s => s.apartment_id === item.id_apartment).map(s => setLanguage === "TH" ? s.services.thai_name+' | ' : s.services.name+' | ')}</p>
                            <h5>${item.price}</h5>
                            <label  style={{margin : '2%'}}><img src='./Icon/bed.png' width={20} alt='...'/> : {item.bedroom}</label>
                            <label><img src='./Icon/shower.png' width={20} alt='...'/> : {item.bedroom}</label>
                          </div>
                          <div className="card card-user-home" onClick={() => handleClickExpandInfoUser(item.user)}>
                              <div className="card-body card-body-user-home row">
                                <div className='col-sm-5 block-img-user-home'>
                                  <img src={'data:image/jpeg;base64,'+imageUser[item.card_id]} className='img-user-home' alt='...'/>  
                                </div>
                                <div className='col-7 block-text-user-home'>
                                  <p>{ versionLanguage === "TH" ? "เจ้าของ : " : "Name : " }{item.user.english_fname + ' ' + item.user.english_lname} </p>
                                  <p>{ versionLanguage === "TH" ? "ไลน์ : " : "Line : "}{item.user.line_id}  </p>
                                </div>
                              </div>
                          </div>

                          {session_Login ?   
                            <>            
                                <div className="form-check form-switch" style={{margin : '2%'}}>
                                  <input className="form-check-input check-input-home" role="switch" type="checkbox"
                                    value={item.id_apartment.toString()} onChange={handleCheckboxListChange}  
                                    checked={ selected.includes(item.id_apartment.toString()) } 
                                    disabled={session_Login ? session_Login.status !== 'user' : false}
                                />
                                  <button className="btn btn-warning MarginDefualt" type='submit' disabled={session_Login ? session_Login.status !== 'user' : false} onClick={() => handleReservation(item.id_apartment.toString())}>{ versionLanguage === "TH" ? "จองห้องเช่า " : "Reservation "}</button> 
                                </div>
                            </>
                            :
                            <>
                              <br></br>
                              <br></br>
                            </>
                          }
                          <div className="carousel slide block-imgSlide-apartment">
                              <img src={'data:image/jpeg;base64,'+imageApartment[item.id_apartment]} className="imgSlide-apartment" alt="..."/>
                          </div>
                          {
                            ( (setLogin ? setLogin.status : '') === 'admin' || (session_Login ? session_Login.status : '') === 'admin' ) || 
                              ( (setLogin ? setLogin.id_card : '') === item.card_id  || (session_Login ? session_Login.id : '') === item.card_id )?
                              <>
                                <AdminHomeForm setId={item.id_apartment} setLogin={setLogin} outStatus={setRefresh} setLanguage={setLanguage}/>
                              </>
                            :
                              <>
                              </>
                          }
                          <label className={`custom-label-time-home `}><ReactTimeago date={item.created_at} formatter={ setLanguage === "TH" ? formatterTH : formatterEN }/></label>
                        </div> 
                      </div>
                    :
                      <>
                      </>          
                          
                ))
                }
                    {data.map((item, index) => (
            
                        (index + 1 )+newData.length > (page_limit - limit) &&
                         (index + 1 )+newData.length <= page_limit && 
                          item.total_room > 0 &&
                          !newData.map(nd => nd.id_apartment).includes(item.id_apartment) 
                          ?

                          <div key = {index} className='MarginDefualt col-5'>
                            <div  className='ListApartment ' >
                              <div onClick={()=>handleClickExpandInfo(item)} style={{cursor : 'pointer'}} className='card-apartment-home'>
                                <div>

                                  <div className='block-image-star-home'>
                                    { CreateNumToList( Math.floor(5-(item.score/20)) ,
                                        <img src='./Icon/star-space.svg' className='image-star-home' alt='...'/>
                                        ,5).map( m => m) 
                                    }
                                    { CreateNumToList( !Number.isInteger(item.score/20) ? 1 : 0,
                                        <img src='./Icon/star-half.png' className='image-star-home' alt='...'/>,
                                        5).map( m => m) 
                                    }
                                    { CreateNumToList( Math.floor(item.score/20 ),
                                        <img src='./Icon/star.png' className='image-star-home' alt='...'/>,
                                        5).map( m => m) 
                                    }
                                  </div>
                                </div>
                                <h4>{ versionLanguage === "TH" ? item.thai_name : item.name}</h4>
                                <p style={{marginBottom : '3%', fontWeight : 'bold' }}>{ versionLanguage === "TH" ? "อพาร์ทเม้นท์ เลขที่: " : "Apartment No: "}{item.id_apartment}</p> 
                                <p>{ versionLanguage === "TH" ? "รายละเอียด : " : "Description : "}{versionLanguage === "TH" ? item.thai_description : item.description}</p>
                                <p>{ versionLanguage === "TH" ? "บริการ : " : "Service : "}{service.filter( s => s.apartment_id === item.id_apartment).map(s => versionLanguage === "TH" ? s.services.thai_name+' | ' : s.services.name+' | ')}</p>
                                <p>{ versionLanguage === "TH" ? "ที่อยู่ : " : "Address : "}{item.address}</p>
                                <h5>${item.price}</h5>
                                <label  style={{margin : '2%'}}><img src='./Icon/bed.png' width={20} alt='...'/> : {item.bedroom}</label>
                                <label><img src='./Icon/shower.png' width={20} alt='...'/> : {item.bedroom}</label>
                              </div>
                              <div className="card card-user-home" onClick={() => handleClickExpandInfoUser(item.user)}>
                                  <div className="card-body card-body-user-home row">
                                    <div className='col-sm-5 block-img-user-home'>
                                      <img src={'data:image/jpeg;base64,'+imageUser[item.card_id]} className='img-user-home' alt='...'/>  
                                    </div>
                                    <div className='col-7 block-text-user-home'>
                                    <p>{ versionLanguage === "TH" ? "เจ้าของ : " : "Name : " }{item.user.english_fname + ' ' + item.user.english_lname} </p>
                                      <p>{ versionLanguage === "TH" ? "ไลน์ : " : "Line : "}{item.user.line_id}  </p>
                                    </div>
                                  </div>
                              </div>

                              {session_Login ?   
                                <>            
                                    <div className="form-check form-switch" style={{margin : '2%'}}>
                                      <input className="form-check-input check-input-home" role="switch" type="checkbox"
                                        value={item.id_apartment.toString()} onChange={handleCheckboxListChange}  
                                        checked={ selected.includes(item.id_apartment.toString()) } 
                                        disabled={session_Login ? session_Login.status !== 'user' : false}
                                    />
                                      <button className="btn btn-warning MarginDefualt" type='submit' onClick={() => handleReservation(item.id_apartment.toString())} disabled={session_Login ? session_Login.status !== 'user' : false}>{ versionLanguage === "TH" ? "จองห้องเช่า " : "Reservation "}</button> 
                                    </div>
                                </>
                                :
                                <>
                                  <br></br>
                                  <br></br>
                                </>
                              }
                              <div className="carousel slide block-imgSlide-apartment">
                                  <img src={'data:image/jpeg;base64,'+imageApartment[item.id_apartment]} className="imgSlide-apartment" alt="..."/>
                              </div>
                              {
                                ( (setLogin ? setLogin.status : '') === 'admin' || (session_Login ? session_Login.status : '') === 'admin' ) || 
                                  ( (setLogin ? setLogin.id_card : '') === item.card_id  || (session_Login ? session_Login.id : '') === item.card_id )?
                                  <>
                                    <AdminHomeForm setId={item.id_apartment} setLogin={setLogin} outStatus={setRefresh} setLanguage={setLanguage}/>
                                  </>
                                :
                                  <>
                                  </>
                              }
                              <label className='custom-label-time-home'><ReactTimeago date={item.created_at} /></label>
                            </div> 
                          </div>
                        :
                          <>
                          </>          
                               
                    ))
                    }
                  </div>
                <PageChange setPage={page} setData ={setData} setDataAll={dataAll} setDataNum={dataAll} setLimit={limit} outPage={setPage} outSetPage={outPagelimit}  setLanguage={versionLanguage} />
              </>
                
              ) : (
                <p>{setLanguage === 'TH' ? 'ไม่พบข้อมูลอพาร์ทเม้นท์ ในปัจจุบัน' : 'No data available apartment in current.'}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <PopupInfo setShowModal={showModal} outShowModal={() => setShowModal(false)} setSelected={selected} setNewChange={new_Change} setReservation={clickReservation} outReservation={() => setClickReservation(0)} setLogin={setLogin} outCheckboxState={() => setCheckboxState(true)} setNotification={setnotification} setReservationPage={setReservationPage} setLanguage={versionLanguage}/>
      <PopupExpandInfoForm setData={dataModalExpand} setShowModalExpand={showModalExpand} outShownModalExpand={setShowModalExpand} outMore={setApartmentPage} setImage={imageApartment} setLanguage={setLanguage}/>
      <PopupExpandUserInfoForm setShowModal={showModalExpandUser} outShowModal={setShowModalExpandUser} setData={dataModalExpandUser} setImage={imageUser} setLanguage={setLanguage}/>
      <PopupConfirm setModal={showModalConfirm} outModal={setShowModalConfirm} text={ setLanguage === 'TH' ? 'คุณต้องการจองห้องเช่าอพาร์ทเม้นท์นี้ ใช่หรือไม่ ?' : 'Are you sure you want to reserve this apartment ?'} resulte ={() => setDataModalConfirm(true) } setLanguage={setLanguage} />
      
  </>
  );
  
};


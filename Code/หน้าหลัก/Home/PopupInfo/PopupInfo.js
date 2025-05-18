import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './PopupInfo.css'
import axios from 'axios';
import PopupError from '../../PopupError/PopupError';
import CreateNumToList from '../../../Function/CreateNumToList'


function PopupInfo ( {setShowModal , outShowModal , setSelected  , setNewChange , setReservation , outReservation ,setLogin , outCheckboxState , setNotification , setReservationPage , setLanguage } ){

    const [room, setRoom] = useState(1);
    const [ApartmentRoom , setApartmentRoom] = useState(0);
    const [people, setPeople] = useState(1);
    const [other, setOther] = useState('');
    const [objective_rental , setObjective_rental] = useState('');
    const [pet, setPet] = useState('');
    const [favorite, setFavorite] = useState(''); // state for favorites
    const [Reservaton, setReservaton] = useState({status : false , info : ''}); // state for Payment
    const [detail, setDetail] = useState([]); // state for detail
    const [sessionSelected ,setSessionSelected] = useState([]); // state for select
    const Login = sessionStorage.getItem('token')? JSON.parse(sessionStorage.getItem('token')) : setLogin
    const token = sessionStorage.getItem('token_id')? JSON.parse(sessionStorage.getItem('token_id')) : '';
    const navigate = useNavigate();

    const [ModalError , setModalError] = useState(false);
    const [ModalErrorDetail , setModalErrorDetail] = useState();

  ///////////////////////// Reset //////////////////////////
    //sessionStorage.removeItem('selected_detail');

  ///////////////////////// Use Effect //////////////////////////  

  // set favorite
    useEffect(() => {
      const freshdata = async () => {
            console.log('Check data popop home : ' , detail)
            if(favorite === 'add'){
                // check date
                const rental_date = new Date(detail[0].rental_date) 
                if( rental_date < new Date() ){
                  setModalError(true)
                  setModalErrorDetail({text : 'Date error!', detail : {422 : setLanguage === 'TH' ? 'กรุณาเลือกวันที่ให้ถูกต้อง' : 'Please choose date start correctly!'}})
                  setDetail([])
                  const filter_sessionSelected = sessionSelected.filter( s => s !== setSelected);
                  sessionStorage.setItem('selected',JSON.stringify(filter_sessionSelected));
                  setFavorite(); // reset favorite status
                }
                else{
                  // sent favorite
                  try {
                    const response = await axios.post(`http://127.0.0.1:8000/api/favorite/${Login.id}`,detail,{ 
                      headers: {
                        Authorization: `Bearer ${token}`,
                      }
                    } 
                  )
                    if(response.data[422] || response.data[404]){
                      console.log('Check Add favorite failed : ', response.data)
                      setModalError(true)
                      setModalErrorDetail({text:'Check Add favorite failed : ',detail : response.data})
                    }
                    else{
                      console.log("favorite : " , response.data)
                      console.log('Check Add favorite success')
                      setDetail([])
                      setFavorite(); // reset favorite status
                      // close window popup and set at this function for waiting for sent data success 
                      outShowModal();
                      outCheckboxState()
                    }
                  }
                  catch (error) {
                    console.error('Add favorite success error!', error);
                  }
                }
            }
            else if(favorite === 'del'){
                try{
                  console.log('Check deleted Selected : ' , sessionSelected)  
                  const response = await axios.delete(`http://127.0.0.1:8000/api/favorite/apartment/${Login.id}`,{
                    data :{apartment_ids : sessionSelected }, 
                    headers: {
                      Authorization: `Bearer ${token}`,
                    }
                  } 
                )
                  if(response.data[422] || response.data[404]){
                    console.log('Check Delete favorite failed : ', response.data)
                    setModalError(true)
                    setModalErrorDetail({text:'Check Delete favorite failed : ',detail : response.data})
                  }
                  else{
                    console.log("favorite_delete : " , response.data)
                    console.log('Check Delete favorite success')
                    setFavorite(); // reset favorite status
                    // close window popup and set at this function for waiting for sent data success 
                    outShowModal();
                    outCheckboxState()
                  }
                }
                catch (error) {
                  console.error('Delete favorite error!', error);
                }
                
            }

      }
      
      freshdata()

    },[ favorite /* Don't take follow warn react is 3 loop and add favorite 3 time*/ ])



    // set state reservation
    useEffect(() => {
      const freshdata = async () => {

        // check reservation state
        if(Reservaton.status){
          try {
            const list = []
            list.push( { 
                    apartment_id : Reservaton.info[0].apartment_id,
                    room : Reservaton.info[0].room,
                    people : Reservaton.info[0].people,
                    other : Reservaton.info[0].other,
                    rental_date: Reservaton.info[0].rental_date,
                    objective_rental: Reservaton.info[0].objective_rental,
                    pet: Reservaton.info[0].pet,
              } )

            console.log("list : " , list)
            const response = await axios.post(`http://127.0.0.1:8000/api/reservation/${ Login.id}`,{ reservations : list},{ 
                headers: {
                  Authorization: `Bearer ${token}`,
                }
              } 
            )
            if(response.data[422] || response.data[404]){
              console.log('Check reservation failed : ', response.data)
              setDetail([])
              setReservaton({ status : false , info : '' });
            }
            else{
              console.log("reservation get check : : " , response.data)
              setDetail([])
              setReservaton({ status : false , info : '' });
              outShowModal();
              // set window
              setReservationPage()
            }
          }
          // error reservation state
          catch (error) {
            console.error('There was an error!', error);
          }
        
        }
      }
      
      freshdata()
    },[Reservaton])


    


    // set checkbox change
    useEffect(() => {
      // check value change at click checkbox flase 
      if( setNewChange && setNewChange[0] !== "space" && setNewChange.length > 0 && setNewChange[0] !== null) {
        setSessionSelected( (prevSelected) => {
          const prevSelected_list = [...prevSelected];
          const updatedSelected = []

          // make value don't same previous value
          setNewChange.forEach(item => {  
            const matchedItem = prevSelected_list.find(item2 => item2 !== item); // find value previous isn't equal with setNewChange             
            if (matchedItem) {
              updatedSelected.push(matchedItem);
            } 
          })
          updatedSelected.sort((a, b) => a - b);

          sessionStorage.setItem('selected',JSON.stringify(updatedSelected))  
          setFavorite('del');

          return setNewChange;
        })
      }

      // error value change at click checkbox flase 
      else if(setNewChange[0] === "space"){
        // set value
        setDetail([])
        setFavorite('del');   
        sessionStorage.removeItem('selected')   
      }
      else{
        // for use other components    
      } 
    },[ setNewChange ])




    // get Room apartment 
    useEffect(() => {
      const freshdata = async () => {
          const filter_new_selecet = setSelected.filter(s => !sessionSelected.includes(s));
          console.log("filter_new_selecet Room : " , filter_new_selecet)
          if(filter_new_selecet.length > 0){           
            try {
              const response = await axios.get(`http://127.0.0.1:8000/api/data/room/${parseInt(filter_new_selecet[0][0])}`)
              if(response.data[422] || response.data[404]){
                console.log('Check get room failed : ', response.data)
              }
              else{
                console.log("room : " , response.data.data)
                setApartmentRoom(response.data.data)
              }
            }
            catch (error) {
              console.error('Check get room Error!', error);
            }
          }
        }
      
      freshdata()
    },[setSelected])



  // Set Notification
  useEffect(() => {
    if(sessionSelected){
      setNotification(sessionSelected)
    }
  },[outShowModal])





  // Session storage realtime
  useEffect(() => {
    const interval = setInterval(() => {
      const session_Data = sessionStorage.getItem('selected') || JSON.stringify(setSelected); 
      setSessionSelected(JSON.parse(session_Data))
    }, 200);

    return () => clearInterval(interval);
  }, []);



  ///////////////////////// Function //////////////////////////    
    const handleModelSubmit =  (event) => {
        event.preventDefault();
        console.log("setSelected-Popup : ",setSelected , setReservation , {
          room: room,
          people: people,
          other: other,
          rental_date: event.target.date.value,
          objective_rental: objective_rental,
          pet: pet,
        } , sessionSelected)

        // Check data is Array 

        // check status of click payment button or not

        if(setReservation[0] > 0){ 
            const data_demo = setReservation.map(item => ({
              id_favorite: 0,
              apartment_id: item,
              room: room,
              people: people,
              other: other,
              rental_date: event.target.date.value,
              objective_rental: objective_rental,
              pet: pet,
            }) ); 

          // set value
          setReservaton({status : true , info : data_demo})
          outReservation()

          //window.location.reload(); 
        }
        else{
          
          if(Array.isArray(setSelected)){
            const data_demo = setSelected.map(item => ({
              id: parseInt(item),
              room: room,
              people: people,
              other: other,
              rental_date: event.target.date.value,
              objective_rental: objective_rental,
              pet: pet,
            }) );

            setDetail( () => {
              const updatedDetail = [];
              data_demo.forEach(item => {
                  const index = sessionSelected.findIndex(prevItem => prevItem === item.id.toString()); // find position in list to id equal id
                  if ( index === -1 ) {
                    updatedDetail.push(item);
                  } 
                  
              });
              updatedDetail.sort((a, b) => a - b);

              console.log("Detail updated: ",updatedDetail)

              sessionStorage.setItem('selected',JSON.stringify(setSelected))


              return updatedDetail;// send value to "selected"           
            });
            setFavorite('add');

          } 

        }
    };
    
    const handleModalClose = () => {
      outShowModal();
      outCheckboxState()
      outReservation()
    };

    return(
        <>
          <Modal show={setShowModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{setLanguage === 'TH' ? 'ข้อมูลจองห้องเช่า' : 'Input Info'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleModelSubmit}>
              <Form.Group>
                  <Form.Label htmlFor="Room" className="form-label">{setLanguage === 'TH' ? 'จำนวนจองห้อง' : 'Room'}</Form.Label>
                  <Form.Group >
                    { ApartmentRoom > 0 ?
                      CreateNumToList(ApartmentRoom , null,ApartmentRoom.length,2
                      ).map( (item , index) => (
                        <Form.Group className="form-check form-check-inline" key={index}>
                          <Form.Check className="check-input-popup custom-checkbox " type="radio" name="inlineRadioOptions" id="Room" value={item} onChange={(e) => setRoom(Number(e.target.value))} required/>
                          <Form.Label className="form-check-label" htmlFor="inlineRadio1">{ item }</Form.Label>
                        </Form.Group>
                      ))

                    :
                    <></>
                    }
                  </Form.Group>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="People" className="form-label">{setLanguage === 'TH' ? 'จำนวนคน' : 'People'}</Form.Label>
                <Form.Control className="form-control form-control-popup" type='number' value={people} onChange={(e) => setPeople( parseInt(e.target.value ) > 0 ? parseInt(e.target.value ) : parseInt(1) ) }  max={10} min={1}  required/>
              </Form.Group>  
              <Form.Group className="mb-3">
                <Form.Label htmlFor="Objective_rental" className="form-label">{setLanguage === 'TH' ? 'วัตถุประสงค์' : 'Objective rental'}</Form.Label>
                <Form.Select className="form-control form-control-popup" type='text' value={objective_rental} onChange={(e) => setObjective_rental(e.target.value)} minLength={1}   maxLength={255} required>
                  <option value="" disabled>{setLanguage === 'TH' ? 'เลือกวัตถุประสงค์' : 'Select Objective'}</option>
                  <option value="business">Business - ธุรกิจ</option>
                  <option value="populate">Populate - อยู่อาศัย</option>
                  <option value="commercial">Commercial - การพาณิชย์</option>
                </Form.Select>
              </Form.Group> 
              <Form.Group className="mb-3">
                <Form.Label htmlFor="Rental date" className="form-label">{setLanguage === 'TH' ? 'วันที่เข้าจองห้อง' : 'Rental date'}</Form.Label>
                <Form.Control className="form-control form-control-popup" type='date'  name='date'  required/>
              </Form.Group> 
              <Form.Group className="mb-3">
                <Form.Label htmlFor="Pet" className="form-label">{setLanguage === 'TH' ? 'สัตว์เลี้ยง' : 'Pet'}</Form.Label>
                <Form.Select className="form-control form-control-popup" type='text' value={pet} onChange={(e) => setPet(e.target.value)} minLength={1} maxLength={255} required>
                  <option value="" disabled>{setLanguage === 'TH' ? 'เลือกสัตว์เลี้ยง' : 'Select Pet'}</option>
                  <option value="not_pet">{setLanguage === 'TH' ? 'ไม่มีสัตว์เลี้ยง' : "Don't have pet"}</option>
                  <option value="cat">{setLanguage === 'TH' ? 'แมว' : 'Cat'}</option>
                  <option value="dog">{setLanguage === 'TH' ? 'สุนัข' : 'Dog'}</option>
                  <option value="other">{setLanguage === 'TH' ? 'อื่นๆ' : 'Other'}</option>
                </Form.Select>
              </Form.Group> 
              <Form.Group className="mb-3">
                <Form.Label htmlFor="Other" className="form-label">{setLanguage === 'TH' ? 'เพิ่มเติม' : 'Other'}</Form.Label>
                <textarea className="form-control form-control-popup" aria-label="With textarea" value={other} onChange={(e) => setOther(e.target.value)} maxLength={255}></textarea>
              </Form.Group>
              <Button variant="secondary" onClick={handleModalClose}>
                {setLanguage === 'TH' ? 'ยกเลิก' : 'Close'}
              </Button>
              <Button variant="warning" type="submit" style={{margin: 10}}>
                {setLanguage === 'TH' ? 'ตกลง' : 'Submit'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>  
        <PopupError setModal={ModalError} outModal={() => setModalError(false)}  setDetail={ModalErrorDetail} setLanguage={setLanguage} /> 
      </>
    )
}

export default PopupInfo;
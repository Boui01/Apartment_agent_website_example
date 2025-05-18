import DetectNew from "../../../../Function/DetectNew"
import axios from "axios"

import { useEffect, useState } from "react"
import PopupdashboardHome from "../PopupdashboardHome/PopupdashboardHome"
import 'react-circular-progressbar/dist/styles.css';
import './DashboardHomeReservation.css'
import PopupCustomValue from "../PopupCustomValue/PopupCustomValue";
import DetectText from "../../../../Function/DetectText";
import ProgressChart from "../ProgressChart/ProgressChart";
import DatacreateChart from "../../DatacreateChart/DatacreateChart";


function DashboardHomeReservation ({setLogin,outStatus , setLanguage}) {
    const [Reservation,setReservation] = useState([])
    const [Active,setActive] = useState([])
    const [value , setValue] = useState([]);
    const [popup, setPopup] = useState(false)
    const [status, setStatus] = useState(false)
    const [selected , setSelected] = useState([])
    const [customPosition , setCustomPosition] = useState()
    const [customSearch , setCustomSearch] = useState()
    const [viewState , setViewState] = useState('All')
    const [data_chart , setData_chart] = useState([])
    const list_view = ['All' ,'Status' , 'Today' , 'This Month' , 'This Year' , 'Custom']
    const list_view_custom = ['ID User','User Name','Apartment Name','Room','People','Price']
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin
    const today = new Date()
    const rate_percentage_day = 10;
    const rate_percentage_month = 100;
    const rate_percentage_year = 1000;
    const percentage_day = (Reservation.filter( (item) => (new Date(item.reservation_date).getDate() === today.getDate())).length * 100) / rate_percentage_day;
    const percentage_month = (Reservation.filter( (item) => ( new Date(item.reservation_date).getMonth() === today.getMonth())).length * 100) / rate_percentage_month;
    const percentage_year = (Reservation.filter( (item) => (new Date(item.reservation_date).getFullYear() === today.getFullYear())).length * 100) / rate_percentage_year;

    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : ''


    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:8000/api/reservation/dashboard',{ 
                  params: { status_user: Login.status }, // Use 'params' for query parameters
                  headers: {
                    Authorization: `Bearer ${token}`,
                  }
                } 
              )
                if(response.data[422] || response.data[404]){
                    console.log("reservation-error : ",response.data)
                    setReservation([])
                    setActive([])
                    setStatus(false)
                }
                else{
                  setReservation(response.data.data)
                  setData_chart(DatacreateChart(response.data.data,'reservation_date' , setLanguage = setLanguage))
                  console.log("reservation : ",response.data.data)
                  if(status === true){
                      setActive((previous) => {
                        const filter = previous.filter(item => item !== selected.find(item2 => item === item2))// check value previous equal new data sent
                        const list = filter.length === 0 ? [] : filter // set new value at still data already
                        setValue(response.data.data.filter(check => check.id_reservation === list.find(check2 => check.id_reservation === check2))) // set for save value has already in list
                        return list;
                      })
                      outStatus(status)
                      setStatus(false) // update status to true to fetch data again after status change
                  }
                }
            }
            catch (err) {
                console.error(err)
            }
        }
        fetchData()
    },[status,outStatus ,selected])

    const handleActive = (item) => {
        setActive( (previous) => {
            const filter = previous ? previous.includes(item) :false;// check id same
            const filter_out = previous ? previous.find(id => id !== item) : undefined; // remove id same
            const newlist = filter ? filter_out === undefined ? [] : [filter_out] : previous ? [ ...previous,item] : [item];
            setValue(Reservation.filter(check => newlist.find(check2 => check.id_reservation === check2)))
            console.log('Item :', newlist);
            newlist.sort()
            return newlist;
    
        })

      }
    const handleSelectAll = () => {
      const list = []

      // Make for have change show data
      Reservation.map(item =>                             
        (viewState ===  'Status confirm' ? item.status === 1 : viewState === 'Status waitting' ? item.status === 0 : 
        viewState === 'Today' ? new Date(item.reservation_date).getDate() === today.getDate() :
        viewState === 'This Month' ? new Date(item.reservation_date).getMonth() === today.getMonth() :
        viewState === 'This Year' ? new Date(item.reservation_date).getFullYear() === today.getFullYear() :
        ( list_view_custom.includes(viewState) && customSearch && customPosition ) ? 
         ( customPosition.InItem ? 
           (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
             DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
           :
             item[customPosition.InItem][customPosition.position]  === customSearch   : item[customPosition.position] === customSearch ) : true)
       ?
        item.apartment !== null  && item.user !== null?
          list.push(item) : null
        :
          null
      )

      setActive(list.map(item => item.id_reservation))
      setValue(list)
      console.log("seleted all : ",list)
    }

    const handleConfirm = () => {
        setPopup(true)
      }


    return(
        <>
          <div style={{marginTop : '50px'}} className="block-main-dashboard-reservation">

           <div className="block-title-head-dashboard-reservation">
              <h2>{ setLanguage === 'TH' ? 'การจองห้องเช่า' : 'Reservation'}</h2>  
              <label className=" text-secondary mb-0" >{setLanguage === 'TH' ? 'จํานวนทั้งหมด' : 'Total'} : {Reservation.length} </label>
              <label className=" text-secondary" style={{marginLeft : '10px'}} > { setLanguage === 'TH' ? 'ใหม่' : 'New'} : {Reservation.filter( r => DetectNew(r.reservation_date , 2 , 1)).length}</label>
              <div className="block-list-view-dashboard" >
                <input type="checkbox" id="checkbox-list-view-dashboard-toggle" className="checkbox-list-view-dashboard" hidden/>
                <label htmlFor="checkbox-list-view-dashboard-toggle" className="button-list-view-dashboard" >
                {
                  setLanguage === 'TH' ? 
                    viewState === 'All' ? 'ทั้งหมด' :
                    viewState === 'Today' ? 'วันนี้' :
                    viewState === 'This Month' ? 'เดือนนี้' :
                    viewState === 'This Year' ? 'ปีนี้' :
                    viewState === 'Status' ? 'สถานะ' :
                    viewState === 'Status confirm' ? 'ยืนยัน' :
                    viewState === 'Status waitting' ? 'รอดําเนินการ' :
                    viewState === 'Custom' ? 'ตัวเลือก' :
                    viewState === 'ID User' ? 'รหัสสมาชิก' :
                    viewState === 'User Name' ? 'ชื่อ' :
                    viewState === 'Apartment Name' ? 'ชื่อหอพัก' :
                    viewState === 'Room' ? 'ห้อง' :
                    viewState === 'People' ? 'จํานวนคน' :
                    viewState === 'Price' ? 'ราคา' :

                    ''
                  :
                    viewState
                }
                </label>
                <ul>
                    {list_view.map((item) =>
                      <>
                        { (viewState === 'Status' || viewState === 'Status confirm' || viewState === 'Status waitting') && item  === 'Status' ?
                          <>
                            <li onClick={() => setViewState('All')}   className={`active`}>
                              { setLanguage === 'TH' ? 'สถานะ' : 'Status'}
                            </li>
                            <li onClick={() => setViewState('Status confirm')}   className={`custom-list-view-dashboard-child ${viewState === 'Status confirm' ? 'active' : ''}`}>
                              { setLanguage === 'TH' ? 'ยืนยัน' : 'Status confirm'}
                            </li>
                            <li onClick={() => setViewState('Status waitting')}   className={`custom-list-view-dashboard-child ${viewState === 'Status waitting' ? 'active' : ''}`}>
                              { setLanguage === 'TH' ? 'รอดําเนินการ' : 'Status waitting'}
                            </li>
                          </>
                        : ( viewState === 'Custom' || list_view_custom.includes(viewState) ) && item === 'Custom' ?
                          <>
                            <li onClick={() => setViewState('All')}   className={`active`}>
                              { setLanguage === 'TH' ? 'ตัวเลือก' : 'Custom'}
                            </li>
                            { list_view_custom.map((item2 , index2) => (
                                <li key={index2} onClick={() => setViewState(item2)}   className={`custom-list-view-dashboard-child ${viewState === item2 ? 'active' : ''}`}>
                                  {
                                    setLanguage === 'TH' ? 
                                      item2 === 'ID User' ? 'รหัสผู้ใช้งาน' :
                                      item2 === 'User Name' ? 'ชื่อผู้ใช้' :
                                      item2 === 'Apartment Name' ? 'ชื่ออพาร์ทเม้นท์' :
                                      item2 === 'Room' ? 'ห้อง' :
                                      item2 === 'People' ? 'จำนวนคน' :
                                      item2 === 'Price' ? 'ราคา' :
                                      ''
                                    : 
                                      item2
                                  }
                                </li>
                             ))
                            }
                            { customPosition && customSearch ?                              
                                <li onClick={() => (setViewState('All') , setCustomPosition() , setCustomSearch())}   className={`custom-list-view-dashboard-child`}>
                                  {  setLanguage === 'TH' ? 'ยกเลิก' :'Cancle' }
                                </li>
                                :
                                <></>
                            }
                          </>
                        :
                          <li onClick={() => setViewState(item)} key={item} className={`${viewState === item ? 'active' : ''}`}>
                              {
                                setLanguage === 'TH' ? 
                                item === 'All' ? 'ทั้งหมด' :
                                item === 'Today' ? 'วันนี้' :
                                item === 'This Month' ? 'เดือนนี้' :
                                item === 'This Year' ? 'ปีนี้' :
                                item === 'Status' ? 'สถานะ' :
                                item === 'Custom' ? 'ตัวเลือก' :
                                ''
                              :
                                item
                              }
                          </li>
                        }
                       </>
                    )}
                </ul>
              </div>
           </div>

          <ProgressChart data={data_chart} percentage_day={percentage_day} percentage_month ={percentage_month} percentage_year = {percentage_year} title={'Reservation'} setLanguage={setLanguage}/>
          
          {Reservation.length > 0 ? 
            <div className="block-btn-select-all-dashboard">
              <button className="btn btn-outline-warning custom-btn-select-all" onClick={handleSelectAll}>{setLanguage === 'TH' ? 'เลือกทั้งหมด' : 'SELECT ALL'}</button>
            </div> 
          :
            <>
            </>
          }

           <table className="table table-reservation-dashboard">
                <thead className="table-head-reservation-dashboard">
                    <tr>
                      <th scope="col">{setLanguage === 'TH' ? 'ลำดับ' : 'ID'}</th>
                      <th scope="col">{setLanguage === 'TH' ? 'ชื่อ' : 'ชื่อจริง'}</th>
                      <th scope="col">{setLanguage === 'TH' ? 'นามสกุล' : 'นามสกุล'}</th>
                      <th scope="col">{setLanguage === 'TH' ? 'อพาร์ตเมนต์' : 'Apartment'}</th>
                      <th scope="col">{setLanguage === 'TH' ? 'สถานะ' : 'Status'}</th>
                      <th scope="col">{setLanguage === 'TH' ? 'ราคา' : 'Price'}</th>
                      <th scope="col">{setLanguage === 'TH' ? 'ห้อง' : 'Room'}</th>
                      <th scope="col">{setLanguage === 'TH' ? 'คน' : 'People'}</th>
                      <th scope="col">{setLanguage === 'TH' ? 'อื่นๆ' : 'Other'}</th>
                    </tr>
                </thead>
                <tbody className="table-body-reservation-dashboard">
                    {Reservation.length > 0 ?
                      <>
                        {// new update data
                          Reservation.map( (item,index) => (
                            DetectNew(item.reservation_date , 2 , 1) &&
                            (viewState ===  'Status confirm' ? item.status === 1 : viewState === 'Status waitting' ? item.status === 0 : 
                             viewState === 'Today' ? new Date(item.reservation_date).getDate() === today.getDate() :
                             viewState === 'This Month' ? new Date(item.reservation_date).getMonth() === today.getMonth() :
                             viewState === 'This Year' ? new Date(item.reservation_date).getFullYear() === today.getFullYear() :
                             ( list_view_custom.includes(viewState) && customSearch && customPosition ) ? 
                              ( customPosition.InItem ? 
                                (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
                                  DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
                                :
                                  item[customPosition.InItem][customPosition.position]  === customSearch   : item[customPosition.position] === customSearch ) : true)
                            ?
                            <tr className={`table${Active ? Active.find(id => id === item.id_reservation) ? '-active' : '-warning' : '-warning'}  column-body-reservation-dashboard`} 
                              key={index} onClick={() => item.apartment && item.user ? handleActive(item.id_reservation) : alert( setLanguage === 'TH' ? 'ไม่สามารถคลิกได้ เนื่องจากข้อมูลถูกลบ' : 'Can not click this has been Delete.')}>
                                <td >
                                  {Active ? Active.find(id => id === item.id_reservation) ?
                                    '':                                   
                                    <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ? 'ใหม่' : 'New'} </b>:
                                    <b style={{color : "#ff9900"}}>{ setLanguage === 'TH' ? 'ใหม่' : 'New'}  </b> }
                                  {item.id_reservation}
                                </td>
                                <td >{item.user ? item.user.english_fname : <p className="text-danger">{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                <td >{item.user ? item.user.english_lname : <p className="text-danger">{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                <td >{item.apartment ? item.apartment.name : <p className="text-danger">{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                <td >{ setLanguage === 'TH' ? item.status === 1 ? 'ยืนยัน' : 'กำลังรอยืนยัน' : item.status === 1 ? 'confirm' : 'waitting'}</td>
                                <td >{item.apartment ? item.apartment.price : <p className="text-danger">{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                <td >{item.room}</td>
                                <td >{item.people}</td>
                                <td >{item.other}</td>
                          </tr>
                          :''
                          ))
                        }

                        {// normal update data
                          Reservation.map( (item,index) => (
                            DetectNew(item.reservation_date , 1 , 1) &&
                            (viewState ===  'Status confirm' ? item.status === 1 : viewState === 'Status waitting' ? item.status === 0 : 
                             viewState === 'Today' ? new Date(item.reservation_date).getDate() === today.getDate() :
                             viewState === 'This Month' ? new Date(item.reservation_date).getMonth() === today.getMonth() :
                             viewState === 'This Year' ? new Date(item.reservation_date).getFullYear() === today.getFullYear() :
                             ( list_view_custom.includes(viewState) && customSearch && customPosition ) ? 
                              ( customPosition.InItem ? 
                                (customPosition.position === 'name' || customPosition.position === 'english_fname' || customPosition.position === 'english_lname' ) ?
                                  DetectText(item[customPosition.InItem][customPosition.position] , customSearch ,customSearch.length > 1 ? 2 : 1) 
                                :
                                  item[customPosition.InItem][customPosition.position]  === customSearch   : item[customPosition.position] === customSearch ) : true)
                            ?
                              <tr className={`table${Active ? Active.find(id => id === item.id_reservation) ? '-active' : '' : ''}  column-body-reservation-dashboard`}
                                 key={index} onClick={() => item.apartment && item.user ? handleActive(item.id_reservation) : alert( setLanguage === 'TH' ? 'ไม่สามารถคลิกได้ เนื่องจากข้อมูลถูกลบ' : 'Can not click this has been Delete.')}>
                                  <td >{item.id_reservation}</td>
                                  <td >{item.user ? item.user.english_fname : <p className="text-danger">{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                  <td >{item.user ? item.user.english_lname : <p className="text-danger">{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                  <td >{item.apartment ? setLanguage === 'TH' ? item.apartment.thai_name : item.apartment.name : <p className="text-danger">{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                  <td >{ setLanguage === 'TH' ? item.status === 1 ? 'ยืนยัน' : 'กำลังรอยืนยัน' : item.status === 1 ? 'confirm' : 'waitting'}</td>
                                  <td >{item.apartment ? item.apartment.price : <p className="text-danger">{ setLanguage === 'TH' ? 'ลบ' : 'Delete'}</p>}</td>
                                  <td >{item.room}</td>
                                  <td >{item.people}</td>
                                  <td >{item.other}</td>
                              </tr>
                            :''
                        ))
                      }
                    </>
                    :
                    <>
                        <tr>
                            <td>{setLanguage === 'TH' ? 'ไม่พบข้อมูล' : 'No data found'}</td>
                        </tr>
                    </>
                  }
                </tbody>
            </table>
            {Active !== null ?
                 Active.length > 0  ? 
                    <button className="btn btn-success  m-2 mb-3" onClick={() => handleConfirm()}>{setLanguage === 'TH' ? 'ยืนยัน' : 'Confirm'}</button>  
                :
                    <></>
            :
            <></>
            }
          </div>
          <PopupdashboardHome setModal={popup} outModal={() => setPopup(false)} setValue={value} outStatus={() => setStatus(true)} setLogin={setLogin} setState={"reservation"} outSelect={setSelected} setLanguage={setLanguage}/>
          
          { list_view_custom.includes(viewState) ?
              <PopupCustomValue 
                setModalState={viewState} outModalState={() => setViewState('All')}
                setCustomPosition={ {table : 'reservations' , position : viewState} } outCustomPosition={setCustomPosition}
                outCustomValue={setCustomSearch}
                setLanguage={setLanguage}
              />
            :
              <></>
          }
        </>
    )
}

export default DashboardHomeReservation
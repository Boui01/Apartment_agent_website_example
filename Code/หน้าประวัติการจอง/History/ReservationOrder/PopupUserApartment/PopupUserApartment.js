import './PopupUserApartment.css';
import { Modal } from "react-bootstrap";
import { CircularProgressbar , buildStyles} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function PopupUserApartment( {setPopup , outPopup, setShowInfo , setLanguage} ){
    const Percent_score =  (setShowInfo.score * 100) / 20
    const Percent_total_room =  (setShowInfo.total_room * 100) / 10
    return(
        <>
            <Modal show={setPopup} onHide={outPopup} className='Modal-Main-PopupUserApartment'> 
                <Modal.Header className='Modal-Main-PopupUserApartment-Head' >
                    <div data-bs-theme="dark" className="position-absolute top-10 btn-close-modal-main-PopupUserApartment-Head" onClick={() => outPopup()}>
                        <button type="button" className="btn-close " aria-label="Close"></button>
                    </div>
                    <h2>{setLanguage === 'TH' ? 'อพาร์ทเม้นท์' : 'Apartment reservation'}</h2>
                </Modal.Header>                                 
                <Modal.Body>
                        <div className='row align-items-center custom-Modal-body-PopupUserApartment'>
                            <div className='row text-center'>
                                <div className='col'>
                                    <CircularProgressbar value={Percent_total_room} text={`${setShowInfo.total_room} Room`} className="progress-cercle-dashboard-PopupUserApartment"   
                                        styles={buildStyles({
                                            pathColor: '#ffdd49', // Path color
                                            textColor: '#ffdd49', // Text color inside the progress bar
                                            trailColor: '#d6d6d6', // Background trail color
                                        })}
                                    />
                                    <b className='text-center'>{ setLanguage === 'TH' ? 'จํานวนห้อง' : 'Total room'}</b>
                                </div>
                                <div className='col'>
                                    <CircularProgressbar value={Percent_score} text={`${Percent_score}%`} className="progress-cercle-dashboard-PopupUserApartment"   
                                        styles={buildStyles({
                                            pathColor: '#ffdd49', // Path color
                                            textColor: '#ffdd49', // Text color inside the progress bar
                                            trailColor: '#d6d6d6', // Background trail color
                                        })}
                                    />
                                    <b className='text-center'>{ setLanguage === 'TH' ? 'คะแนน' : 'Score'}</b>
                                </div>
                            </div>
                            <div className='col row m-5 text-center custom-detail-PopupUserApartment'>
                                <div className='col-6 mt-3'>
                                    <h6 >{ setLanguage === 'TH' ? 'ไอดี อพาร์ทเม้นท์' : 'ID APARTMENT'} </h6>
                                    <label>{ setShowInfo.id_apartment}</label>
                                </div>
                                <div className='col-6 mt-3'>
                                    <h6 >{ setLanguage === 'TH' ? 'ชื่อ อพาร์ทเม้นท์' : 'NAME'} </h6>
                                    <label>{ setLanguage === 'TH' ? setShowInfo.thai_name : setShowInfo.name}</label>
                                </div>
                                <div className='col-6 mt-3'>
                                    <h6>{ setLanguage === 'TH' ? 'ที่อยู่' : 'Adddress'}</h6>
                                    <label>{ setShowInfo.address}</label>
                                </div>
                                <div className='col-6 mt-3'>
                                    <h6>{ setLanguage === 'TH' ? 'รายละเอียด' : 'Description'}</h6>
                                    <label>{ setLanguage === 'TH' ? setShowInfo.thai_description : setShowInfo.description}</label>
                                </div>
                                <div className='col-6 mt-3'>
                                    <h6>{ setLanguage === 'TH' ? 'ห้องนอน' : 'Bedroom'}</h6>
                                    <label>{ setShowInfo.bedroom}</label>
                                </div>
                                <div className='col-6  mt-3'>
                                    <h6>{ setLanguage === 'TH' ? 'ห้องน้ํา' : 'Bathroom'}</h6>
                                    <label>{ setShowInfo.bathroom}</label>
                                </div>
                                <div className='col-6  mt-3'>
                                    <h6>{ setLanguage === 'TH' ? 'สัตว์เลี้ยง' : 'Pet'}</h6>
                                    <label>{ setLanguage === 'TH' ? setShowInfo.pet === 1 ? "มีได้" : "มีไม่ได้" : setShowInfo.pet === 1 ? "Yes" : "No"}</label>
                                </div>
                                <div className='col-6  mt-3'>
                                    <h6>{ setLanguage === 'TH' ? 'กฎ' : 'Rule'}</h6>
                                    <label>{ setShowInfo.rule}</label>
                                </div>                                
                             
                                <div className='col mt-3'>
                                    <h6>{ setLanguage === 'TH' ? 'ราคา (บาท)' : 'Price (TBH)'}</h6>
                                    <label>{'$'+setShowInfo.price}</label>
                                </div>
                            </div>
                        </div>
                          
                </Modal.Body>
            </Modal>

        </>
    )
}


export  default PopupUserApartment
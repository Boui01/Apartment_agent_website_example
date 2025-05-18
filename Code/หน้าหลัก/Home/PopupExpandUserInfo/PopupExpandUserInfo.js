import {Modal } from "react-bootstrap"
import './ImageSliddeExpand.css'
function PopupExpandUserInfoForm( {setShowModal, outShowModal , setData , setImage , setLanguage} ){

    return (
        <>
            <Modal show={setShowModal} onHide={() => outShowModal(false)} className="modal-main-user-expand">
                <Modal.Header className="modal-head-user-expand" closeButton closeVariant="white">
                    <Modal.Title className="modal-head-text-user-expand">{setLanguage === 'TH' ? 'เจ้าของอพาร์ทเม้นท์' : 'Apartment Owner'}</Modal.Title>
                </Modal.Header>
                <PopupExpandUserInfo setData={setData} setImage={setImage} setLanguage={setLanguage}/>
            </Modal>
        </>
    )
}

function PopupExpandUserInfo({setData , setImage , setLanguage}){

    return(
        <>
            <Modal.Body className="modal-body-user-exapand">
                <div id="ImageSlideExpand" className="carousel slide ImageSlideExpandUser">
                    <div className="carousel-inner">
                        <div className="carousel-item active ">
                            <img src={'data:image/jpeg;base64,'+  setImage[setData.data.id_card] } className="d-block w-100 image-user-expandPage" alt="..."/>
                        </div>
                    </div>
                </div>
                <div className="block-text-user-expand row" >
                    <h4 className="head-text-user-expand">{setLanguage === 'TH' ? 'ข้อมูล' : 'Detail'}</h4>
                    <div className="col text-center">
                        <h6>{setLanguage === 'TH' ? 'ชื่อ - นามสกุล(อังกฤษ)' : 'English Name'}</h6>
                        <p>{setData.data.english_fname + ' ' + setData.data.english_lname}</p>  
                    </div>
                    <h5 className="body-text-user-expand">{setLanguage === 'TH' ? 'ข้อมูล ติดต่อ' : 'Contact'}</h5>
                    <div className="col-8">
                        <h6>{setLanguage === 'TH' ? 'เบอร์โทร' : 'Phone'}</h6>
                        <p>{setData.data.phone}</p>
                    </div>
                    <div className="col">
                        <h6>{setLanguage === 'TH' ? 'ไลน์' : 'Line'}</h6>
                        <p>{setData.data.line_id}</p>
                    </div>
                    <div className="col text-center">
                        <h6>{setLanguage === 'TH' ? 'อีเมลล์' : 'Email'}</h6>
                        <p>{setData.data.email}</p>
                    </div>
                </div>
            </Modal.Body>
        </>
    )
    }
export default PopupExpandUserInfoForm
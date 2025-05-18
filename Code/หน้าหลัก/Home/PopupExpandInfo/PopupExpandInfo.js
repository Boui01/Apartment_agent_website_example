
import { Button, Modal } from "react-bootstrap";
import './PopupExpandInfo.css'

function PopupExpandInfoForm({setData , setShowModalExpand ,outShownModalExpand, outMore , setImage , setLanguage}){

    return (
        <>
            <Modal show={setShowModalExpand} onHide={() => outShownModalExpand(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{setLanguage === 'TH' ? 'ข้อมูลอพาร์ทเม้นท์' : 'Apartment'}</Modal.Title>
                </Modal.Header>
                <PopupExpandInfo setInfo={setData} setMore={outMore} setImage={setImage} setLanguage={setLanguage}/>
            </Modal>
        </>
    )
}
function PopupExpandInfo({setInfo , setMore , setImage , setLanguage}){

return(
    <>
        <Modal.Body>
            <div className="custom-block-image-popupExpandInfo" style={{marginBottom : '3%'}}>
                <img src={'data:image/jpeg;base64,'+  setImage[setInfo.data.id_apartment] } className="d-block w-100 custom-image-popupExpandInfo" alt="..."/>
            </div>
            <h4 style={{textAlign : "center"}}>{ setLanguage === 'TH' ? setInfo.data.thai_name :setInfo.data.name}</h4>  
            <p style={{textAlign : "center" , fontSize: '12px' , marginTop : '-5px' , marginBottom : '3%'}}>{setLanguage === 'TH' ? 'อพาร์ทเม้นท์ เลขที่ : ' : 'Apartment No : '}{setInfo.data.id_apartment}</p>
            <h6>{setLanguage === 'TH' ? 'รายละเอียด ' : 'Description '}</h6>
            { setLanguage === 'TH' ? setInfo.data.thai_description : setInfo.data.description}
            <h6 style={{marginTop : '5%'}}>{ setLanguage === "TH" ? "ที่อยู่อพาร์ทเม้นท์" : "Address "}</h6>
            <p>{setInfo.data.address}</p>
            <h6 style={{marginTop : '5%'}}>{setLanguage === 'TH' ? 'บริการ' : 'Service'}</h6>
            <p> {setInfo.service.map( s => setLanguage === 'TH' ? s.services.thai_name + ' | ' : s.services.name+' | ')}</p>
            <div className="row" style={{ borderTop : '1px solid #9a9a99' , padding : '15px' , textAlign : 'center' , backgroundColor : '#f5f5f5'}}>
                <p className="col-6">{setLanguage === 'TH' ? 'ราคา : ' : 'Price : '}{setInfo.data.price}</p>
                <p className="col-5">{setLanguage === 'TH' ? 'คะแนน : ' : 'Score : '}{  setInfo.data.score}</p>
                <p className="col-6">{setLanguage === 'TH' ? 'ห้องนอน : ' : 'Bedroom: '}{setInfo.data.bedroom}</p>
                <p className="col-5">{setLanguage === 'TH' ? 'ห้องน้ำ : ' : 'Bathroom: '}{setInfo.data.bathroom}</p>
                <p className="col-6">{setLanguage === 'TH' ? 'เจ้าของ : ' : 'Owner : '}{ setInfo.data.user.english_fname  + ' ' + setInfo.data.user.english_lname} </p>
                <p className="col-5">{setLanguage === 'TH' ? 'ไลน์ : ' : 'Line : '}{setInfo.data.user.line_id}  </p>
            </div>
            <div className="Container-More">
                <Button className="btn btn-More" onClick={() => setMore()}>{setLanguage === 'TH' ? 'เพิ่มเติม' : 'More'}</Button>
            </div>
        </Modal.Body>
    </>
)
}
export default PopupExpandInfoForm;
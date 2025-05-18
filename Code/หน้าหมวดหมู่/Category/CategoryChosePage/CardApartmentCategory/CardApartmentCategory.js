import './CardApartmentCategory.css'


function CardApartmentCategory({ setApartment , setImage , outClick , setLanguage }) {


    return(
            <div className="contrainner block-body-categoryChosePage">
                <div className="row">
                    {
                        setApartment.length > 0 ?
                        setApartment.map((data , index) => (                     
                            <div key={index} className="col-md-3" onClick={() => outClick(data)}>
                                <div className="card">
                                    <div className='block-body-img-categoryChosePage'>
                                        <img src={setImage ? 'data:image/jpeg;base64,' + setImage[data.apartment_id] : '...'} className='body-img-categoryChosePage' alt='...'></img>
                                    </div>
                                    <div className="card-header">
                                        <h4 className="card-title"> { setLanguage === 'TH' ? 'อพาร์ทเม้นท์' : 'Apartment'}</h4>
                                    </div>
                                    <div className="card-body">
                                        <p className={`text-${setLanguage === 'TH' ? 'warning' : 'warning'}`} style={{fontSize : '18px' , textShadow : '1px 1px 10px #f5e39d'}}>
                                            { setLanguage === 'TH' ?  data.apartments.thai_name : 'Name: '+ data.apartments.name}
                                        </p>
                                        <p >
                                            <h6 style={{fontWeight : 'bold'}} >{ setLanguage === 'TH' ? 'รายละเอียด' : 'Description'}</h6> 
                                            { setLanguage === 'TH' ? data.apartments.thai_description : data.apartments.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                        :
                        <>{ setLanguage === 'TH' ? 'ไม่พบอพาร์ทเม้นท์' : 'No Apartment in this Category'}</>
                    }
                </div>
            </div>
    )
}

export default CardApartmentCategory
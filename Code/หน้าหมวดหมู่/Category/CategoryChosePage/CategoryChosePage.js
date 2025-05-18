import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoryChosePage.css';
import axios from 'axios';
import CardApartmentCategory from './CardApartmentCategory/CardApartmentCategory';

function CategoryChosePage({ setCategory , setLanguage }) {
    const [apartment , setApartment] = useState([])
    const [image , setImage] = useState()
    const [Click , setClick] = useState()
    const navigate = useNavigate();

    useEffect(() => {
       const freshdata = async () => {
           const response = await axios.get(`http://127.0.0.1:8000/api/service/search/${setCategory}`)
           if(response.data.data ? response.data.data.length > 0 : false){
                const response2 = await axios.post(`http://127.0.0.1:8000/api/image/show` ,{data : response.data.data.map(d => d.apartment_id)})
                console.log('response category alone : ' , response.data.data, response2.data)
                
                setApartment(response.data.data.filter( item => item.apartments.status === 1))
                setImage(response2.data.image)                      
            }
            if(Click){
                try{
                    const response = await axios.get(`http://127.0.0.1:8000/api/data/${Click.apartment_id}`)
                    console.log('response apartment category : ' , response.data)
                    sessionStorage.setItem('apartmentPageValue' , JSON.stringify({data : response.data.data , service : response.data.service , image : response.data.image}) )
                    navigate(`/apartment`)
                }
                catch(error){
                    console.log(error)
                }
            }
       } 

       freshdata()
    },[setCategory,Click,navigate])

    return( 
        <div>
            <div className='block-head-categoryChosePage'>
                <video autoPlay loop muted className="videoBackground">
                    <source src="..\Video\Profile.mp4" type="video/mp4"  />
                </video>     
                <h1 className='h1-categoryChosePage'>{ setLanguage ===  "TH" ? '5 ลำดับอพาร์ทเม้นท์ยอดฮิต' : 'Top Tier 5 Apartment'}</h1>
                <ul className='ul-categoryChosePage'>
                    {
                        apartment.length > 0 ? 
                        apartment.sort((a, b) => b.apartments.score - a.apartments.score).map((data , index) => (                                          
                            index+1 <= 5 ?
                                <li key={index} className='order-top-tier' onClick={() => setClick(data)}>
                                    <div className='block-img-categoryChosePage'>
                                        <img src={image ? 'data:image/jpeg;base64,' + image[data.apartment_id] : '...'} className='img-categoryChosePage' alt='...'></img>
                                    </div>
                                    <div className="icon"><i className="fa-brands fa-codepen"></i></div>
                                    <div className="title">{ setLanguage === 'TH' ? data.apartments.thai_name : data.apartments.name}</div>
                                    <div className="descr">{ setLanguage === 'TH' ? data.apartments.thai_description : data.apartments.description}</div>
                                </li>
                            :
                            <></>
                        ))
                    :
                        <>{ setLanguage === 'TH' ? 'ไม่มีอพาร์ทเม้นท์' : 'No Apartment in this category'}</>    
                    }
                </ul>
            </div>
            <div className='block-between-Imag-NavSlide'></div> 
            <CardApartmentCategory setApartment={apartment} setImage={image} outClick={setClick} setLanguage={setLanguage} />
        </div>
        )
}

export default CategoryChosePage
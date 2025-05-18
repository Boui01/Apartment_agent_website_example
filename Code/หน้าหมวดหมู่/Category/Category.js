import { useEffect, useState } from 'react';
import './Category.css'
import CategoryChosePage from './CategoryChosePage/CategoryChosePage';
import axios from 'axios';
function Category({setLanguage}) {
    const [clickCategory , setClickCategory] = useState('');
    const [category , setCategory] = useState([]);

    useEffect(() => {
        const freshdata = async () => {
            const response = await axios.get(`http://127.0.0.1:8000/api/services`)
            console.log('response : ', response.data)
            setCategory(response.data.data)
        }   
        
        freshdata()

    },[])

    return(
        <>
            { !clickCategory ? 
                <div className=''>
                    <div id="carouselExample" className="carousel slide">
                        <div className="carousel-inner">
                            <div className="carousel-item active">
                                <img src="./Image/Home_ImageSlide_1.jfif" className="d-block custom-img" alt="..."/>
                            </div>
                            <div className="carousel-item">
                                <img src="./Image/Home_ImageSlide_2.jfif"className="d-block custom-img" alt="..."/>
                            </div>
                            <div className="carousel-item">
                                <img src="./Image/Home_ImageSlide_3.jfif"className="d-block custom-img" alt="..."/>
                            </div>
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                    <div className='block-between-Imag-NavSlide-category'></div> 
                    <div className='block-category-extract'>
                        <h1 className='text-head-category-extract' >{setLanguage == "TH" ? "หมวดหมู่" : "Category"}</h1>
                        <div className='row'>
                            {category.map( (item,index) => (
                                    <div className='col block-category-extract-object' onClick={() => setClickCategory(item.id_service)}>
                                        <div className='block-image-category-extract'>
                                            <img className='image-category-extract' src="./Image/Home_ImageSlide_1.jfif" alt='...'></img>
                                        </div>
                                        <label className='label-category-extract'>{setLanguage == "TH" ? item.thai_name : item.name}</label>
                                    </div>
                                ) 
                            )}
                    
                        </div>
                    </div>
                </div>
            :
                <>
                    <CategoryChosePage setCategory={clickCategory} setLanguage={setLanguage}/>
                </>
            }
        </>
    )
}

export default  Category
import { useState } from 'react'
import '../NavbarSlide/NavbarSlide.css'

function NavbarSlide ( {setLogin , outActive , setLanguage} ) {
    const [active, setActive] = useState('home_1')

    const handleActive = (page) =>{
        setActive(page)
        outActive(page)
    }
    return(
        <>
            <div className=" col-sm-2 container" >
                <nav id="navbar-example3" className="h-100 flex-column align-items-stretch pe-2 border-end  navbar-slide-main">
                    <nav className="nav nav-pills flex-column">
                        <a className={`fw-bold nav-slide ${active === "home_1" ? "active" : 'custom-nav-slide'}`} onClick={() => handleActive('home_1')} href="#Home_1">{ setLanguage === "TH" ? "ทั้งหมด" : "All"}</a>
                        {setLogin ? 
                                <>
                                    <a className={`fw-semibold nav-slide ${active === "home_2" ? "active" : 'custom-nav-slide'}`} onClick={() => handleActive('home_2')}  href="#Home_2">{ setLanguage === "TH" ? "อพาร์ทเม้นทของฉัน" : "My Apartment"}</a>
                                    <a className={`fw-semibold nav-slide ${active === "home_3" ? "active" : 'custom-nav-slide'}`} onClick={() => handleActive('home_3')}  href="#Home_3">{ setLanguage === "TH" ? "อพาร์ทเม้นทของคนอื่น" : "Other Apartment"}</a>
                                </>
                            :
                            <></>
                        }
                    </nav>
                </nav>
            </div>    
        </>

    )
}

export default NavbarSlide;
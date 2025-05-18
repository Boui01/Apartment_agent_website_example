import { useEffect, useState } from "react";

function PageChange( {setPage, setData , setDataAll , setDataNum , setLimit , outPage , outSetPage , setLanguage} ) {

    //// Value page ////
    const num = [];// number of pages for show
    const totalPages = Math.ceil(setDataNum.length / setLimit);// send integer full value
    const page_set = setPage*setLimit;// set show data follow page choose current at page_set
    const [hover,setHover] = useState();

    // For change value page real time
    useEffect(()=>{
        outSetPage(page_set);// set value page in homme page
    },[setPage,outSetPage,page_set]) 
    
    const handlePageChange = (newPage) => {
        outPage(newPage);// set value of Page
        const data_demo = []; // data for demo put "data"

        // Set data show new page
        setDataAll.forEach((dt,index) => {
        if( index+1 > (page_set-setLimit) && index+1 <= page_set){  // During Min and Max
            data_demo.push(dt);// set new data_demo for new data
        }
        });
        setData(data_demo);// setData at data home page

    };

    // Set number of page
    for(let i = 1; i <= totalPages; i++){
        num.push(i);// put number page example 1,2,3
    }

    const active = {
        backgroundColor: 'rgb(5, 168, 92)',
        border: '2px solid rgb(0, 204, 102)',
        color: 'aliceblue',
    };
    const hoverCss = {
        backgroundColor : '#b3e6cc',
        color:"green"
    }

    return(
        <>
        <nav aria-label="Page navigation example">
            <ul className="pagination" >
                <li className="page-item">
                    <button 
                    className="page-link"  
                    style={Number(setPage) <= 1 ? {color:"rgb(84, 84, 84)"} : (hover === 'pevious' ? hoverCss :{color:"green"})}
                    onMouseEnter={()=> setHover("pevious")}
                    onMouseLeave={ ()=>setHover(null)}
                    onClick={() => handlePageChange(Number(setPage) - 1)} 
                    disabled={Number(setPage) <= 1}
                    >
                    { setLanguage === "TH" ? "ก่อนหน้า" : "Previous"}
                    </button>
                </li>

                {num.map((_, index) => (
                    <li key={index} className="page-item "  >
                        <button 
                        className={`page-link` } 
                        style={Number(setPage) === index + 1 ? active : (hover === index+1 ? hoverCss : {color:"green"})}
                        onMouseEnter={()=> setHover(index + 1)}
                        onMouseLeave={ ()=>setHover(null)}
                        onClick={() => handlePageChange( index+1  )}
                        disabled={Number(setPage) === index+1}
                        >
                        {index+1}
                        </button>
                    </li>
                ))}
                
                <li className="page-item">
                    <button 
                    className="page-link" 
                    style={Number(setPage) >= totalPages ? {color:"rgb(84, 84, 84)"} : (hover === 'next' ? hoverCss :{color:"green"})}
                    onMouseEnter={()=> setHover('next')}
                    onMouseLeave={ ()=>setHover(null)}
                    onClick={() => handlePageChange(Number(setPage) + 1)}
                    disabled={Number(setPage) >= totalPages}
                    >
                    { setLanguage === "TH" ? "ถัดไป" : "Next"}
                    </button>
                </li>
            </ul>
        </nav>
        </>
    )
}
export default PageChange;
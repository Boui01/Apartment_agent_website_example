import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Chart from 'chart.js/auto';

import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { TH } from './Font/Thai';
function ReportPDF( {setShowModal,setHideModal,setLogin}){
    const [report , setReport] = useState()
    const [startDate , setStartDate] = useState()
    const [endDate , setEndDate] = useState()
    const [confirm , setConfirm] = useState(false)
    const Login = sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : setLogin
    const token = sessionStorage.getItem('token_id') ? JSON.parse(sessionStorage.getItem('token_id')) : '';
    const thaiFontBase64 = TH; // base64 encoded font data


    useEffect(() => {
        const freshdata = async () => {
            if(confirm){
                if(report === undefined || startDate === undefined || endDate === undefined){
                    alert('Please choose selected date and report!')
                    setConfirm(false)
                }
                else if ( ( new Date(startDate).getFullYear() > new Date(endDate).getFullYear() ) ||
                          ( ( new Date(startDate).getFullYear() === new Date(endDate).getFullYear() ) && (new Date(startDate).getMonth() > new Date(endDate).getMonth() )  ) 
                        ){
                    alert('Please choose date start and end correctly!')
                    setConfirm(false)
                }
                else{
                    try{
                        console.log('response-before : ',report , startDate , endDate)
                        const response = await axios.post(`http://127.0.0.1:8000/api/report/${Login.id}`,{report  : report ,  start_date : startDate , end_date : endDate , status_user : Login.status} ,{ 
                            headers: {
                              Authorization: `Bearer ${token}`,
                            }
                          } 
                        )
                        if(response.data[404] || response.data[422]){
                            alert('Can not get data in this time.Check console log Error!')
                            console.log('erorr-response-report : ',response.data)
                            setConfirm(false)
                        }
                        else{
                            console.log('response-report : ', response.data.data.map(item => item.apartment))

                            // create PDF
                            const doc = new jsPDF();
                            // Add Font
                            doc.addFileToVFS('THSarabun.ttf', thaiFontBase64);
                            doc.addFont('THSarabun.ttf', 'THSarabun', 'normal');

                            // Add Title with Date Range
                            doc.text(`${response.data.title} (${startDate} - ${endDate})`, 10, 10);

                            let yOffset = 20; // Initial Y-axis offset

                            // Function to format each data item as text
                            const formatContent = (item) => {
                                let content = '';

                                switch (response.data.title) {
                                case 'Apartment':
                                    content = `
                                    ID: ${item.id_apartment}
                                    User: ${item.user.english_fname} ${item.user.english_lname}
                                    Address: ${item.address}
                                    Services: ${response.data.service
                                            .filter(s => s.apartment_id === item.id_apartment)
                                            .map(s => s.services.name).join(', ')}
                                    Name: ${item.name}
                                    Description: ${item.description}
                                    Total Rooms: ${item.total_room}
                                    Pets Allowed: ${item.pet === 1 ? 'Yes' : 'No'}
                                    Rules: ${item.rule}
                                    Price: ${item.price}
                                    Created: ${new Date(item.created_at).toDateString()}
                                    Updated: ${new Date(item.updated_at).toDateString()}
                                            `;
                                            break;

                                        case 'Reservation':
                                            content = `
                                    ID: ${item.id_reservation}
                                    User: ${item.user ? `${item.user.english_fname} ${item.user.english_lname}` : 'null'}
                                    Apartment: ${item.apartment ? item.apartment.name : 'null'}
                                    Room: ${item.room}
                                    People: ${item.people}
                                    Other Info: ${item.other}
                                    Status: ${item.status === 1 ? 'Confirmed' : 'Not Confirmed'}
                                    Rental Date: ${new Date(item.rental_date).toDateString()}
                                    Objective: ${item.objective_rental}
                                    Pets: ${item.pet === 'not_pet' ? 'No' : item.pet}
                                    Reservation Date: ${new Date(item.reservation_date).toDateString()}
                                            `;
                                            break;

                                        case 'Payment':
                                            content = `
                                    ID: ${item.id_payment}
                                    User: ${item.user ? `${item.user.english_fname} ${item.user.english_lname}` : 'null'}
                                    Employee: ${item.employee.english_fname} ${item.employee.english_lname}
                                    Apartment: ${item.apartment ? item.apartment.name : 'null'}
                                    Price: ${item.price}
                                    User Status: ${item.status_user === 1 ? 'Paid' : 'Unpaid'}
                                    Employee Confirmation: ${item.status_employee === 1 ? 'Confirmed' : 'Not Confirmed'}
                                    Created: ${new Date(item.created_at).toDateString()}
                                    Updated: ${new Date(item.updated_at).toDateString()}
                                            `;
                                            break;

                                        case 'Trash':
                                            content = `
                                    ID: ${item.id_apartment}
                                    User: ${item.user.english_fname} ${item.user.english_lname}
                                    Address: ${item.address}
                                    Services: ${response.data.service
                                            .filter(s => s.apartment_id === item.id_apartment)
                                            .map(s => s.services.name).join(', ')}
                                    Name: ${item.name}
                                    Description: ${item.description}
                                    Total Rooms: ${item.total_room}
                                    Pets Allowed: ${item.pet === 1 ? 'Yes' : 'No'}
                                    Rules: ${item.rule}
                                    Price: ${item.price}
                                    Created: ${new Date(item.created_at).toDateString()}
                                    Updated: ${new Date(item.updated_at).toDateString()}
                                    Deleted: ${new Date(item.deleted_at).toDateString()}
                                            `;
                                            break;

                                        default:
                                            content = 'No data available.';
                                        }

                                        return content;
                                    };

                                    // Add each data item to the PDF as text
                                    response.data.data.forEach((item) => {
                                        const content = formatContent(item);
                                        
                                        // Split content into lines and print them with spacing
                                        const lines = doc.splitTextToSize(content, 180); // Wrap lines to fit within 180 width
                                        lines.forEach((line) => {
                                        doc.text(line, 10, yOffset);
                                        yOffset += 10; // Line spacing between lines of the same entry
                                        });

                                        yOffset += 14; // Extra margin between entries
                                    });
                            //          Chart or Cercle of canvas           //

                            const calcurateTomonth = 100 ;
                            const countCercleYear = [];
                            const countBarYear = [];
                            const countLineYear = [];
                            const countYear = new Date(endDate).getFullYear() - new Date(startDate).getFullYear();


                            //  Make chart for loop  year
                            for(let i = 0 ; i <= countYear ; i++ ){
                                const currentYear = new Date(startDate).getFullYear() + i;

                                // Make data filter for chart cercle and bar
                                for(let make_data = 0 ; make_data < 3 ; make_data++ ){
                                    const chartData = {
                                        labels: make_data === 0 ? ['January - April', 'May - August', 'September - December' , 'Emtry'] 
                                                                : ['January - April', 'May - August', 'September - December']
                                                    ,
                                        datasets: [{
                                            label: make_data === 1 ? `Averrage 3 month in Year. Point target ${calcurateTomonth}` : '',
                                            data: 
                                                response.data.title === 'Apartment' || response.data.title === 'Payment' ?
                                            [
                                                (response.data.data.filter(item =>
                                                    new Date(item.created_at).getFullYear() === currentYear &&
                                                    new Date(item.created_at).getMonth() >= 0 &&
                                                    new Date(item.created_at).getMonth() <= 3
                                                ).length * 100) / calcurateTomonth,

                                                (response.data.data.filter(item =>
                                                    new Date(item.created_at).getFullYear() === currentYear &&
                                                    new Date(item.created_at).getMonth() >= 4 && 
                                                    new Date(item.created_at).getMonth() <= 7
                                                ).length * 100) / calcurateTomonth,

                                                (response.data.data.filter(item =>
                                                    new Date(item.created_at).getFullYear() === currentYear &&
                                                    new Date(item.created_at).getMonth() >= 8 &&
                                                    new Date(item.created_at).getMonth() <= 11
                                                ).length * 100) / calcurateTomonth,
                                                calcurateTomonth


                                            ]
                                            : response.data.title === 'Reservation' ?
                                            [
                                                (response.data.data.filter(item =>
                                                    new Date(item.reservation_date).getFullYear() === currentYear &&
                                                    new Date(item.reservation_date).getMonth() >= 0 &&
                                                    new Date(item.reservation_date).getMonth() <= 3
                                                ).length * 100) / calcurateTomonth,

                                                (response.data.data.filter(item =>
                                                    new Date(item.reservation_date).getFullYear() === currentYear &&
                                                    new Date(item.reservation_date).getMonth() >= 4 && 
                                                    new Date(item.reservation_date).getMonth() <= 7
                                                ).length * 100) / calcurateTomonth,

                                                (response.data.data.filter(item =>
                                                    new Date(item.reservation_date).getFullYear() === currentYear &&
                                                    new Date(item.reservation_date).getMonth() >= 8 &&
                                                    new Date(item.reservation_date).getMonth() <= 11
                                                ).length * 100) / calcurateTomonth,
                                                calcurateTomonth


                                            ] : response.data.title === 'Trash' ?
                                            [
                                                (response.data.data.filter(item =>
                                                    new Date(item.deleted_at).getFullYear() === currentYear &&
                                                    new Date(item.deleted_at).getMonth() >= 0 &&
                                                    new Date(item.deleted_at).getMonth() <= 3
                                                ).length * 100) / calcurateTomonth,

                                                (response.data.data.filter(item =>
                                                    new Date(item.deleted_at).getFullYear() === currentYear &&
                                                    new Date(item.deleted_at).getMonth() >= 4 && 
                                                    new Date(item.deleted_at).getMonth() <= 7
                                                ).length * 100) / calcurateTomonth,

                                                (response.data.data.filter(item =>
                                                    new Date(item.deleted_at).getFullYear() === currentYear &&
                                                    new Date(item.deleted_at).getMonth() >= 8 &&
                                                    new Date(item.deleted_at).getMonth() <= 11
                                                ).length * 100) / calcurateTomonth,
                                                calcurateTomonth


                                            ] : 
                                            []                                       
                                        ,
                                            backgroundColor: make_data === 1 ? ['#FFCE56' ,'#FFCE56' ,'#FFCE56' ,'#ffffff'] : make_data === 2 ? ['#FFCE56'] : ['#FF6384', '#36A2EB', '#FFCE56' ,'#e6e6e6'],
                                            hoverBackgroundColor: make_data === 1 ? ['#FFCE56' ,'#FFCE56' ,'#FFCE56' ,'#ffffff'] :make_data === 2 ? ['#FFCE56'] : ['#FF6384', '#36A2EB', '#FFCE56','#e6e6e6' ],
                                            pointBackgroundColor: '#FFCE56', // Point color on the line
                                            pointBorderColor: '#FFCE56', // Border color of the points
                                            borderWidth: 6, // Thickness of the line
                                        }]
                                    };

                                    if(make_data === 0){
                                        countCercleYear.push(chartData)
                                    }
                                    else if(make_data === 1){
                                        countBarYear.push(chartData)
                                    }
                                    else{
                                        countLineYear.push(chartData)  
                                    }

                                }
                            } 
                        


                            /*                                                       Cercle                                                              */
                            // set value for Page
                            let countLimitHeight = 500; 
                            let countCurrentHeight = 500;   

                            // Create cercle follow year
                            await countCercleYear.forEach( (cercleYear, index)  => {  // use await for create image

                                // Default value
                                const chartWidth =  100;  
                                const chartHeight = 200; 
                                // Create a canvas
                                const canvas = document.createElement(`canvas`);
                                const countYear = new Date(startDate).getFullYear() + index;
                                canvas.id = `myChart${countYear}`;
                                canvas.width = chartWidth;
                                canvas.height = chartHeight;
                                document.body.appendChild(canvas);

                                // Initialize Chart.js
                                const ctx = canvas.getContext('2d');

                                new Chart(ctx, {
                                    type: 'pie' ,// Type of chart: 'bar', 'line', 'pie', etc.
                                    data: cercleYear,
                                    options: {
                                        position: 'bottom',
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: `${response.data.title} - Year ${countYear}`,
                                                font: {
                                                    size: 90,
                                                    weight: 'bold',
                                                },
                                            },
                                            tooltip: {
                                                bodyFont: {
                                                    size:  80, 
                                                }
                                            },
                                            legend: {
                                                labels: {
                                                    font: {
                                                        size: 80, 
                                                    }
                                                }
                                            }
                                        }, 
                                    }
                                });

                                // Convert the chart to a base64 image
                                const chartImage = canvas.toDataURL('image/png'); 
                                
                                // Check for create new page
                                if (countCurrentHeight + chartHeight > countLimitHeight) {
                                    doc.addPage();
                                    countCurrentHeight = 0;
                                }

                                // Add the image to the PDF
                                doc.addImage(chartImage, 'PNG', 50 , countCurrentHeight+50, chartWidth ,chartHeight);

                                    
                                // Update the current height
                                countCurrentHeight += chartHeight + 500;

                                // Remove the canvas
                                document.body.removeChild(canvas)

                            });









                            /*                                                       Bar                                                             */
                            // Create bar follow year
                            await countBarYear.forEach( (barYear, index)  => {  // use await for create image
                                // Default value
                                const chartWidth =  120;  
                                const chartHeight = 250; 
                                // Create a canvas
                                const canvas = document.createElement(`canvas`);
                                const countYear = new Date(startDate).getFullYear() + index;
                                canvas.id = `myChart${countYear}`;
                                canvas.width = chartWidth;
                                canvas.height = chartHeight;
                                document.body.appendChild(canvas);

                                // Initialize Chart.js
                                const ctx = canvas.getContext('2d');

                                new Chart(ctx, {
                                    type: 'bar', 
                                    data: barYear,
                                    options: {
                                        position: 'bottom',
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: `${response.data.title} - Year ${countYear}`,
                                                font: {
                                                    size:  60,
                                                    weight: 'bold',
                                                },
                                                padding: {
                                                    top: 20,  // Add margin at the top
                                                    bottom: 20, // Add margin at the bottom
                                                },
                                            },
                                            tooltip: {
                                                bodyFont: {
                                                    size:  40, 
                                                }
                                            },
                                            legend: {
                                                labels: {
                                                    padding: 20, // Add padding around the legend labels
                                                    font: {
                                                        size:  46, 
                                                    },
                                                    margin: { top: 20, bottom: 20, left: 5, right: 5 },
                                                }
                                            },
                                        },
                                        layout: {
                                            padding: {
                                                top: 30, // Padding above the chart area
                                                bottom: 30, // Padding below the chart area
                                            },
                                        }, 
                                        scales: {
                                            x: {
                                                ticks: {
                                                    font: {
                                                        size: 44
                                                    }
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    font: {
                                                        size: 44
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });

                                // Convert the chart to a base64 image
                                const chartImage = canvas.toDataURL('image/png'); 
                                
                                // Check for create new page
                                if (countCurrentHeight + chartHeight > countLimitHeight) {
                                    doc.addPage();
                                    countCurrentHeight = 0;
                                }

                                // Add the image to the PDF
                                doc.addImage(chartImage, 'PNG',  45 , countCurrentHeight+20, chartWidth ,chartHeight);

                                    
                                // Update the current height
                                countCurrentHeight += chartHeight + 500;

                                // Remove the canvas
                                document.body.removeChild(canvas)
                                
                            });
                            










                            /*                                                       Line                                                              */
                            
                            // Create Line follow year
                            await countLineYear.forEach( (lineYear, index)  => {  // use await for create image
                                // Default value
                                const chartWidth =  130 ;  
                                const chartHeight = 250; 
                                // Create a canvas
                                const canvas = document.createElement(`canvas`);
                                const countYear = new Date(startDate).getFullYear() + index;
                                canvas.id = `myChart${countYear}`;
                                canvas.width = chartWidth;
                                canvas.height = chartHeight;
                                document.body.appendChild(canvas);

                                // Initialize Chart.js
                                const ctx = canvas.getContext('2d');

                                new Chart(ctx, {
                                    type: 'line' , 
                                    data: lineYear,
                                    options: {
                                        position: 'bottom',
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            title: {
                                                display: true,
                                                text: `${response.data.title} - Year ${countYear}`,
                                                font: {
                                                    size:  60,
                                                    weight: 'bold',
                                                },
                                                padding: {
                                                    top: 20,  // Add margin at the top
                                                    bottom: 20, // Add margin at the bottom
                                                },
                                            },
                                            tooltip: {
                                                bodyFont: {
                                                    size:  40, 
                                                }
                                            },
                                            legend: {
                                                labels: {
                                                    padding: 20, // Add padding around the legend labels
                                                    font: {
                                                        size:  46, 
                                                    },
                                                    margin: { top: 20, bottom: 20, left: 5, right: 5 },
                                                }
                                            },
                                        },
                                        layout: {
                                            padding: {
                                                top: 30, // Padding above the chart area
                                                bottom: 30, // Padding below the chart area
                                            },
                                        }, 
                                        scales: {
                                            x: {
                                                ticks: {
                                                    font: {
                                                        size: 44
                                                    }
                                                }
                                            },
                                            y: {
                                                ticks: {
                                                    font: {
                                                        size: 44
                                                    }
                                                }
                                            }
                                        }
                                    }
                                });

                                // Convert the chart to a base64 image
                                const chartImage = canvas.toDataURL('image/png'); 
                                
                                // Check for create new page
                                if (countCurrentHeight + chartHeight > countLimitHeight) {
                                    doc.addPage();
                                    countCurrentHeight = 0;
                                }

                                // Add the image to the PDF
                                doc.addImage(chartImage, 'PNG', 30 , countCurrentHeight+20, chartWidth ,chartHeight);

                                    
                                // Update the current height
                                countCurrentHeight += chartHeight + 500;

                                // Remove the canvas
                                document.body.removeChild(canvas)
                                
                            });
            
                            // Print to PDF
                            doc.save(`${response.data.title}.pdf`);


                            // Set value
                            setHideModal()
                            setConfirm(false)
                        }
                    }
                    catch(error){
                        console.log(error)
                    }
                }
            }
        } 
        freshdata();
    },[confirm,Login,report,setHideModal,thaiFontBase64])

    const generatePDF = () => {
       setConfirm(true)
    };
    return(
        <>
            <Modal show={setShowModal} onHide={setHideModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Generate Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <select className="form-select" multiple aria-label="Multiple select example" onChange={(e) => setReport(e.target.value)}>
                        <option defaultValue value="apartment">Apartment</option>
                        <option value="reservation">Reservation</option>
                        <option value="payment">Payment</option>
                        <option value="trash">Trash</option>
                    </select>
                    <label  className='mt-3'>From Date</label>
                    <input type='month' className='form-control' value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <label className='mt-3'>To Date</label>
                    <input type='month' className='form-control' value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='btn btn-warning' onClick={generatePDF}>Generate PDF</Button>
                    <Button variant="secondary" onClick={() => setHideModal()}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ReportPDF;
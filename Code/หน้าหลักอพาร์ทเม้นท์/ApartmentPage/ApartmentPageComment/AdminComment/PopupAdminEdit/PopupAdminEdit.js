
import { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"

function PopupAdminEdit({ setModal , outModal ,setState , outEdite , outConfirm , outDelete , setLanguage}) {
    const [value , setValue] = useState('')

    const handleClick = (e) => {
        e.preventDefault()
        if (setState === 'edit') {
            outEdite({description :  value})
        }
        else if (setState === 'delete') {
            outDelete(true)
        }
        outEdite({description :  value})
        outModal()
        outConfirm(true)
    }

    return (
        <>
            <Modal show={setModal} onHide={() => outModal()}>
                <Modal.Header closeButton>
                    <Modal.Title>{setLanguage === 'TH' ? 'แก้ไขคอมเมนต์' : 'Admin Edite'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleClick}>
                        {setState === 'edit' ? 
                            <Form.Control 
                                className="form-control"
                                name="description"
                                type="text"
                                placeholder={setLanguage === 'TH' ? "กรอกคอมเมนต์ใหม่" : "Input new comment"}
                                autoFocus
                                onChange={(e) => setValue(e.target.value)}
                                value={value}
                                minLength={1}
                                maxLength={100}
                                required
                            />
                        :
                            <>
                            {
                                setLanguage === 'TH' ? 
                                <div>
                                    คุณต้องการ <label style={{color : 'red'}}>ลบ</label> คอมเมนต์นี้ ใช่หรือไม่ ?
                                </div>
                                :
                                <div>
                                    Do you want to <label style={{color : 'red'}}>Delete</label> this comment ?
                                </div>
                            }
                            </>
                        }
                        <div style={{marginTop : '10px'}}>
                            <Button variant="secondary" onClick={() => outModal()}>{setLanguage === 'TH' ? 'ยกเลิก' : 'Close'}</Button>
                            {setState === 'edit' ? 
                                <Button variant="warning" onClick={handleClick} style={{marginLeft : 10 , color : 'white'}}>{setLanguage === 'TH' ? 'แก้ไข' : 'Edite'}</Button>
                            :
                                <Button variant="danger" onClick={handleClick} style={{marginLeft : 10 , color : 'white'}}>{setLanguage === 'TH' ? 'ลบ' : 'Delete'}</Button>
                            }
                        </div>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    )
}

export default PopupAdminEdit
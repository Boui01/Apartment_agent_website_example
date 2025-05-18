import { Button, Modal, ModalBody, ModalHeader } from "react-bootstrap";

function AdminDelete({ setShowModal , outShowModal , result , setLanguage}) {
    const handleDelete = () => {
        result(true)
        outShowModal()
    }
    return(
        <Modal show={setShowModal} onHide={outShowModal}>
            <ModalHeader>
                <h2>{setLanguage === 'TH' ? 'ลบอพาร์ทเม้นท์' : 'Delete'}</h2>
            </ModalHeader>
            <ModalBody>
                <p>{setLanguage === 'TH' ? 'คุณต้องการลบอพาร์ทเม้นท์นี้' : 'Are you sure you want to delete this Apartment?'}</p>
                <Button onClick={outShowModal} className="btn btn-secondary" style={{marginRight : 10}}>{setLanguage === 'TH' ? 'ไม่' : 'No'}</Button>
                <Button onClick={handleDelete} className="btn btn-danger">{setLanguage === 'TH' ? 'ใช่' : 'Yes'}</Button>
            </ModalBody>
    </Modal>
    )
}

export default AdminDelete
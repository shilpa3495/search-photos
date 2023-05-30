import Modal from "react-bootstrap/Modal";
import Image from "react-bootstrap/Image";
import { imageUrl } from "../../utils/constants";

const PreviewModal = ({ show, close, item }) => {
  return (
    <Modal
      show={show}
      onHide={close}
      backdrop="static"
      keyboard={false}
      dialogClassName="preview-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {item?.title ? item.title : "This image does not have a title"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="preview-modal-body-container">
        <Image
          src={`${imageUrl}${item?.server}/${item?.id}_${item?.secret}.jpg`}
          className="preview-modal-image"
          alt="no photo"
        />
      </Modal.Body>
    </Modal>
  );
};

export default PreviewModal;

import React, { useContext, useState } from "react";
import Axios from "axios";

import Card from "../../shared/components/UIElements/Card.js";
import Button from "../../shared/components/FormElements/Button.js";
import Modal from "../../shared/components/UIElements/Modal.js";
import Map from "../../shared/components/UIElements/Map.js";

import { AuthContext } from "../../shared/components/Context/Auth-context.js";

import "../styles/PlaceItem.css";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.js";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner.js";

const PlaceItem = (props) => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState();
  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const auth = useContext(AuthContext);

  const confirmDeleteHandler = () => {
    setIsLoading(true);

    Axios.delete(`${process.env.REACT_APP_BACKEND_URL}/places`, {
      headers: {
        Authorization: `Bearer ${auth.isLoggedIn.token}`,
      },
      data: {
        placeId: props.placeData._id,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setShowConfirmModal(false);
          window.location.reload();
        }
      })
      .catch((err) => setError(err.message));

    setIsLoading(false);
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={() => setError(null)} />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <Modal
            show={showMap}
            onCancel={() => setShowMap(false)}
            header={props.placeData.address}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-footer"
            footer={<Button onClick={() => setShowMap(false)}>CLOSE</Button>}
          >
            <div className="map-container">
              <Map center={props.placeData.location} zoom={16} />
            </div>
          </Modal>
          <li className="place-item">
            <Card>
              <div className="place-item__image">
                <img
                  src={`${process.env.REACT_APP_ASSET_URL}/${props.placeData.image}`}
                  alt={props.placeData.title}
                />
              </div>
              <div className="place-item__info">
                <h2>{props.placeData.title}</h2>
                <h3>{props.placeData.address}</h3>
                <p>{props.placeData.description}</p>
              </div>
              <div className="place-item__actions">
                <Button inverse onClick={() => setShowMap(true)}>
                  VIEW ON MAP
                </Button>
                {auth.isLoggedIn.creatorId === props.placeData.creator && (
                  <Button to={`/places/${props.placeData._id}`}>EDIT</Button>
                )}
                {auth.isLoggedIn.creatorId === props.placeData.creator && (
                  <Button
                    danger
                    onClick={() => {
                      setShowConfirmModal(true);
                    }}
                  >
                    DELETE
                  </Button>
                )}
                <Modal
                  show={showConfirmModal}
                  onCancel={() => setShowMap(false)}
                  header="Are you sure?"
                  footerClass="place-item__modal-actions"
                  footer={
                    <React.Fragment>
                      <Button
                        inverse
                        onClick={() => setShowConfirmModal(false)}
                      >
                        CANCEL
                      </Button>
                      <Button danger onClick={confirmDeleteHandler}>
                        DELETE
                      </Button>
                    </React.Fragment>
                  }
                >
                  <p>
                    Do you want to procced and delete this place? Please note
                    that it can't be undone thereafter.
                  </p>
                </Modal>
              </div>
            </Card>
          </li>
        </div>
      )}
    </React.Fragment>
  );
};

export default PlaceItem;

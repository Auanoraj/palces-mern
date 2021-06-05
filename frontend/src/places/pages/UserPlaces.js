import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList.js";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.js";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner.js";

const UserPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  let { userId } = useParams();

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`)
      .then((res) => {
        if (res.data.places) {
          setPlaces(res.data.places);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [userId]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={() => setError(null)} />
      {isLoading ? <LoadingSpinner /> : <PlaceList places={places} />}
    </React.Fragment>
  );
};

export default UserPlaces;

import React, { useContext } from "react";
import { useParams } from "react-router-dom";

import PlaceItem from "./PlaceItem.js";
import Card from "../../shared/components/UIElements/Card.js";
import Button from "../../shared/components/FormElements/Button.js";
import { AuthContext } from "../../shared/components/Context/Auth-context.js";

import "../styles/PlaceList.css";

const PlaceList = (props) => {
  const param = useParams();
  const auth = useContext(AuthContext);

  if (props.places.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          {auth.isLoggedIn.creatorId === param.userId ? (
            <div>
              <h2>No places found, Maybe create one ???</h2>
              <Button to="/places/new">Share Place</Button>
            </div>
          ) : (
            <h2>No places found.</h2>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="place-list">
      {props.places.map((place, i) => (
        <PlaceItem key={i} placeData={place} />
      ))}
    </div>
  );
};

export default PlaceList;

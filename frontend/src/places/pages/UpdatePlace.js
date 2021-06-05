import React, { useContext, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import Axios from "axios";

import { useForm } from "../../shared/hooks/form-hook";

import { VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../util/validators";
import { AuthContext } from "../../shared/components/Context/Auth-context";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "../styles/PlaceForm.css";

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [identifiedPlace, setIdentifiedPlace] = useState("");

  let initialState = {
      inputs: {
        title: {
          value: "",
          isValid: false,
        },
        description: {
          value: "",
          isValid: false,
        },
        address: {
          value: "",
          isValid: false,
        },
      },
      isValid: false,
    },
    placeId = useParams().placeId;

  const [formState, inputHandler, setFormData] = useForm(initialState);

  useEffect(() => {
    let updatedState;

    const fetchPlaces = async () => {
      await Axios.get(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
        .then((res) => {
          if (res.data) {
            updatedState = {
              inputs: {
                title: {
                  value: res.data.title,
                  isValid: true,
                },
                description: {
                  value: res.data.description,
                  isValid: true,
                },
                address: {
                  value: res.data.address,
                  isValid: true,
                },
              },
              isValid: true,
            };

            setFormData(updatedState.inputs, updatedState.isValid);
            setIdentifiedPlace(res.data);
          }
        })
        .catch((err) => {
          setError(err.message);
        });
    };

    fetchPlaces();
    setIsLoading(false);
  }, [setFormData, placeId]);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { title, address, description } = formState.inputs;

    let updateData = {
      title: title.value,
      address: address.value,
      description: description.value,
      creator: auth.isLoggedIn.creatorId,
    };

    Axios.put(
      `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${auth.isLoggedIn.token}`,
        },
      }
    )
      .then((res) => {
        if (res.data && res.status === 200)
          history.push(`/${auth.isLoggedIn.creatorId}/places`);
      })
      .catch((err) => {
        setError(err.message);
      });

    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!identifiedPlace) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={() => setError(null)} />
      <form className="place-form" onSubmit={onSubmitHandler}>
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          value={formState.inputs.title.value}
          valid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          element="textarea"
          type="text"
          label="Description"
          onInput={inputHandler}
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          value={formState.inputs.description.value}
          valid={formState.inputs.description.isValid}
        />
        <Input
          id="address"
          element="input"
          type="text"
          label="Address"
          onInput={inputHandler}
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          value={formState.inputs.address.value}
          valid={formState.inputs.address.isValid}
        />
        <Button type="submit" disabled={!formState.isValid}>
          UPDATE PLACE
        </Button>
      </form>
    </React.Fragment>
  );
};

export default UpdatePlace;

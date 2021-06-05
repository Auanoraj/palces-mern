import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import Button from "../../shared/components/FormElements/Button.js";
import Input from "../../shared/components/FormElements/Input.js";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators.js";
import { useForm } from "../../shared/hooks/form-hook.js";
import { AuthContext } from "../../shared/components/Context/Auth-context.js";
import ImageUploader from "../../shared/components/FormElements/ImageUploader.js";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.js";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner.js";

import "../styles/PlaceForm.css";

const NewPlaces = () => {
  const auth = useContext(AuthContext);
  const history = useHistory();

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      image: {
        value: "",
        isValid: false,
      },
    },
    isValid: false,
  };

  const [formState, inputHandler] = useForm(initialState);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    setIsLoading(true);

    let { title, description, address, image } = formState.inputs,
      formData = new FormData();

    formData.append("title", title.value);
    formData.append("description", description.value);
    formData.append("address", address.value);
    formData.append("image", image.value);
    formData.append("creator", auth.isLoggedIn.creatorId);

    Axios.post(`${process.env.REACT_APP_BACKEND_URL}/places`, formData, {
      headers: {
        Authorization: `Bearer ${auth.isLoggedIn.token}`,
      },
    })
      .then((res) => {
        if (res.data) history.push("/");
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
        <form className="place-form" onSubmit={onSubmitHandler}>
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
          />
          <Input
            id="description"
            element="textarea"
            type="text"
            label="Description"
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
          />
          <Input
            id="address"
            element="input"
            type="text"
            label="Address"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE]}
            errorText="Please enter a valid address."
          />
          <ImageUploader center onInput={inputHandler} />
          <Button type="submit" disabled={!formState.isValid}>
            ADD PLACE
          </Button>
        </form>
      )}
    </React.Fragment>
  );
};

export default NewPlaces;

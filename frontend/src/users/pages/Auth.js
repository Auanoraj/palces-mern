import React, { useContext, useState } from "react";
import Axios from "axios";

import { useForm } from "../../shared/hooks/form-hook.js";

import Input from "../../shared/components/FormElements/Input.js";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../util/validators.js";
import Button from "../../shared/components/FormElements/Button.js";
import Card from "../../shared/components/UIElements/Card.js";
import ImageUploader from "../../shared/components/FormElements/ImageUploader.js";
import { AuthContext } from "../../shared/components/Context/Auth-context.js";

import "../styles/Auth.css";

const Auth = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [error, setError] = useState("");

  const auth = useContext(AuthContext);

  let initialState = {
    inputs: {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    isValid: false,
  };

  const [formState, inputHandler, setFormData] = useForm(initialState);

  const submitHandler = (e) => {
    e.preventDefault();

    const { email, password, name, image } = formState.inputs;

    let data = {
      email: email.value,
      password: password.value,
    };

    if (isLoginMode) {
      Axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/login`, data, {
        "Content-Type": "application/json",
      })
        .then((res) => {
          if (res.data) {
            auth.login(res.data);
          }
        })
        .catch(() => setError(`Credentials entered did not match`));
    } else {
      let formData = new FormData();

      formData.append("name", name.value);
      formData.append("email", email.value);
      formData.append("password", password.value);
      formData.append("image", image.value);

      Axios.post(`${process.env.REACT_APP_BACKEND_URL}/users/signup`, formData)
        .then((res) => {
          if (res.data && res.status === 201) auth.login(res.data);
        })
        .catch(() =>
          setError(`${email.value} already exists, please try login.`)
        );
    }
  };

  const swtichModeHandler = () => {
    // toggle from signup to login
    if (!isLoginMode) {
      // Delete name property from fromState.inputs
      delete formState.inputs.name;

      setFormData(
        {
          ...formState.inputs,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    }
    // toggle from login to signup
    else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: "",
            isValid: false,
          },
        },
        false
      );
    }

    setError("");
    setIsLoginMode((prevState) => !prevState);
  };

  return (
    <Card className="authentication">
      <h2>Login Required</h2>
      <hr />
      <form onSubmit={submitHandler}>
        {!isLoginMode && (
          <Input
            id="name"
            element="input"
            type="text"
            label="Name"
            onInput={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid name."
          />
        )}
        {!isLoginMode && <ImageUploader center onInput={inputHandler} />}
        <Input
          id="email"
          element="input"
          type="email"
          label="Email"
          onInput={inputHandler}
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter a valid email."
        />
        <Input
          id="password"
          element="input"
          type="password"
          label="Password"
          onInput={inputHandler}
          validators={[VALIDATOR_MINLENGTH(6)]}
          errorText="Please enter a valid password, at least 5 characters."
        />
        {error && <p>{error}</p>}
        <Button type="submit" disabled={!formState.isValid}>
          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </form>
      <Button inverse onClick={swtichModeHandler}>
        {isLoginMode ? "SIGNUP" : "LOGIN"}
      </Button>
    </Card>
  );
};

export default Auth;

import Axios from "axios";
import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList.js";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner.js";
import ErrorModal from "../../shared/components/UIElements/ErrorModal.js";

const Users = () => {
  const [users, setUsers] = useState();
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Axios.get(`${process.env.REACT_APP_BACKEND_URL}/users`, {
      "Content-Type": "application/json",
    })
      .then((res) => {
        setUsers(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={() => setError(null)} />
      <div>
        {isLoading ? <LoadingSpinner /> : <UsersList userData={users} />}
      </div>
    </React.Fragment>
  );
};

export default Users;

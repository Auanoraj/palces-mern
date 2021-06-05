import React from "react";

import UserItem from "./UserItem.js";

import "../styles/UsersList.css";

const UsersList = (props) => {
  if (props.userData.length === 0) {
    return (
      <div className="center">
        <h2>No users found.</h2>
      </div>
    );
  }

  return (
    <ul className="users-list">
      {props.userData.map((user) => (
        <UserItem
          key={user._id}
          id={user._id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;

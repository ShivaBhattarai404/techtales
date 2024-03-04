import React from 'react'
import classes from "./UserBox.module.css";
import Image from 'next/image';

const UserBox = (props) => {
  const {name, avatar} = props.writer;
  const createdAt = props.createdAt;

  return (
    <div className={`${classes.userBox} ${props.className && props.className}`}>
      <Image
        className={classes.userBox__avatar}
        src={avatar}
        alt="profile picture"
        width={100}
        height={100}
      />
      <span className={classes.userBox__userName}>{name}</span>
      <span className={classes.userBox__postingDate}>{createdAt}</span>
    </div>
  )
}

export default UserBox
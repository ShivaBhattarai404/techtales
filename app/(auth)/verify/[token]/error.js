"use client"

import React from 'react'
import EmailVerifyPage from './component'

const error = ({error, reset}) => {
  const title = "Link Expired";
  const description = "Your link expired, go to footer and click on verify email";
  const btnText = "BACK TO HOME";

  return (
    <EmailVerifyPage title={title} description={description} btnText={btnText} />
  )
}

export default error
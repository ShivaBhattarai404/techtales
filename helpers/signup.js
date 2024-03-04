import { EMAIL_REGEX } from "@/constants/validation";

export const initialSignupState = {
  name: {
    value: "",
    invalidtext: "",
    touched: false,
  },
  username: {
    value: "",
    invalidtext: "",
    touched: false,
  },
  email: {
    value: "",
    invalidtext: "",
    touched: false,
  },
  password: {
    value: "",
    invalidtext: "",
    touched: false,
  },
  confirmPassword: {
    value: "",
    invalidtext: "",
    touched: false,
  },
  usernameExistance: false,
  emailExistance: false,
  isFormValid: false,
};

export const SignupFormReducer = (state, { type, payload }) => {
  let invalidtext;

  switch (type) {
    case "SET_NAME":
      invalidtext = payload.length === 0 ? "Name can't be empty" : "";
      return {
        ...state,
        name: { value: payload, invalidtext, touched: true },
      };

    case "SET_USERNAME":
      invalidtext =
        payload.length === 0 ? "Username should not be empty" : "";
      return {
        ...state,
        username: { value: payload, invalidtext, touched: true },
      };

    case "SET_USERNAME_EXISTANCE":
      return {...state, usernameExistance: payload}

    case "SET_EMAIL_EXISTANCE":
      return {...state, emailExistance: payload}

    case "SET_EMAIL":
      invalidtext =
        payload &&
        payload
          .toLowerCase()
          .match(EMAIL_REGEX)
          ? ""
          : "Enter a valid email";
      return {
        ...state,
        email: { value: payload, invalidtext, touched: true },
      };

    case "SET_PASSWORD":
      invalidtext =
        payload.length < 6 ? "Password should be 6 character long" : "";
      return {
        ...state,
        password: { value: payload, invalidtext, touched: true },
      };

    case "SET_CONFIRMPASSWORD":
      invalidtext =
        payload.length < 6
          ? "Password should be 6 character long"
          : payload === state.password.value
          ? ""
          : "Confirm password and password should be same";
      return {
        ...state,
        confirmPassword: { value: payload, invalidtext, touched: true },
      };
    default:
      throw new Error("Invalid action type from switch case of login.jsx");
  }
};

export function isFormValid(state) {
  const { name, username, email, password, confirmPassword, emailExistance, usernameExistance } = state;
  const doFormHaveinvalidtext =
    name.invalidtext ||
    username.invalidtext ||
    email.invalidtext ||
    password.invalidtext ||
    confirmPassword.invalidtext;

  const isFormTouched =
    name.touched &&
    username.touched &&
    email.touched &&
    password.touched &&
    confirmPassword.touched;

  if (!isFormTouched) {
    return false;
  }
  return !(doFormHaveinvalidtext || emailExistance || usernameExistance);
}


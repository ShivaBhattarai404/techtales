import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Navigation/NavBar";
import { verifyJwtToken } from "@/utils/jwt";
import { cookies } from "next/headers";
import { Fragment } from "react";

const Template = async ({ children }) => {
  const storedCookies = cookies();
  const decodedToken = await verifyJwtToken(storedCookies.get("token")?.value);

  // If the token is valid, the user is logged in
  let isLoggedIn = false;
  let user = {};
  if (decodedToken) {
    isLoggedIn = true;
    const { _id, name, username, email, avatar } = decodedToken;
    user = { _id, name, username, email, avatar };
  }

  return (
    <Fragment>
      <header style={{ marginBottom: "5em" }}>
        <div style={{ position: "fixed", top: "0", zIndex: "10" }}>
          <NavBar isLoggedIn={isLoggedIn} user={user} />
        </div>
      </header>

      <main>{children}</main>

      <Footer />
    </Fragment>
  );
};

export default Template;

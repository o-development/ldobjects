import { useState } from "react";
import type { FunctionComponent } from "react";
import React from "react";
import { useResource, useSolidAuth } from "@ldo/solid-react";

const DEFAULT_ISSUER = "https://solidweb.me";

export const LoggedInHeader: FunctionComponent<{ webId: string }> = ({
  webId,
}) => {
  const webIdResource = useResource(webId);
  const { logout } = useSolidAuth();
  return (
    <>
      <span>
        Logged in as {webId}. Welcome{" "}
        {webIdResource.isReading() ? "LOADING NAME" : "Cool Dude"}
      </span>
      <button onClick={logout}>Log Out</button>
    </>
  );
};

export const Header: FunctionComponent = () => {
  const [issuer, setIssuer] = useState(DEFAULT_ISSUER);
  const { login, signUp, session } = useSolidAuth();
  return (
    <header style={{ display: "flex" }}>
      {session.webId ? (
        <LoggedInHeader webId={session.webId} />
      ) : (
        <>
          <input
            type="text"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
          />
          <button onClick={() => login(issuer)}>Log In</button>
          <button onClick={() => signUp(issuer)}>Sign Up</button>
        </>
      )}
    </header>
  );
};

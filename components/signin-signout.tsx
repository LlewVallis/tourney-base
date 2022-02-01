import { signOut } from "next-auth/react";
import styled from "styled-components";
import { UserInfo } from "../lib/auth";
import { BACKGROUND_COLOR, FOREGROUND_COLOR } from "../lib/client/theme";
import { signInWithGoogle, useUser } from "./session-manager";

const SigninSignout = () => {
  const user = useUser();

  if (user === null) {
    return <Unauthenticated />;
  } else {
    return <Authenticated user={user} />;
  }
};

export default SigninSignout;

const Container = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0.5rem;

  & > * {
    white-space: nowrap;
  }
`;

const ProfileImage = styled.img`
  width: 2rem;
  height: 2rem;
  background-color: ${BACKGROUND_COLOR};
  border-radius: 100%;
`;

const Authenticated = ({ user }: { user: UserInfo }) => (
  <Container>
    <ProfileImage alt="" src={user?.image ?? ""} referrerPolicy="no-referrer" />
    <span>{user?.name ?? "Unknown User"}</span>
    <span>|</span>
    <LinkButton onClick={() => signOut()}>Sign out</LinkButton>
  </Container>
);

const LinkButton = styled.a`
  color: ${FOREGROUND_COLOR};
`;

const Unauthenticated = () => (
  <Container>
    <LinkButton onClick={() => signInWithGoogle()}>Sign in</LinkButton>
  </Container>
);

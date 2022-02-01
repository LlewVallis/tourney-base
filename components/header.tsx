import Link from "next/link";
import styled from "styled-components";
import { BACKGROUND_COLOR_LIGHT, FOREGROUND_COLOR } from "../lib/client/theme";
import ContentSizer from "./content-sizer";
import SigninSignout from "./signin-signout";

const HeaderContainer = styled.header`
  background-color: ${BACKGROUND_COLOR_LIGHT};
  height: 5rem;
  line-height: 5rem;
  user-select: none;
  margin-bottom: 4rem;
`;

const HeadingAnchor = styled.a`
  color: ${FOREGROUND_COLOR};

  &:hover {
    text-decoration: none;
  }
`;

const Heading = styled.h1`
  margin: 0;

  &.full {
    display: block;
  }

  &.abbreviated {
    display: none;
  }

  @media (max-width: 35rem) {
    &.full {
      display: none;
    }

    &.abbreviated {
      display: block;
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
`;

const Header = () => (
  <HeaderContainer>
    <ContentSizer>
      <ContentContainer>
        <div>
          <Link href="/" passHref>
            <HeadingAnchor>
              <Heading className="full">Tourney Base</Heading>
              <Heading className="abbreviated">TB</Heading>
            </HeadingAnchor>
          </Link>
        </div>
        <div>
          <SigninSignout />
        </div>
      </ContentContainer>
    </ContentSizer>
  </HeaderContainer>
);

export default Header;

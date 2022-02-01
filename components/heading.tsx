import Link from "next/link";
import { PropsWithChildren, ReactNode } from "react";
import styled from "styled-components";
import { FOREGROUND_COLOR } from "../lib/client/theme";

const HeadingContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
`;

const HeadingContent = styled.h1`
  text-align: center;
  flex-grow: 1;
  flex-shrink: 1;
`;

const IconsContainer = styled.div`
  display: flex;
`;

const IconsContainerHidden = styled(IconsContainer)`
  visibility: hidden;
`;

export const Heading = ({
  children,
  content,
}: PropsWithChildren<{ content: ReactNode }>) => (
  <HeadingContainer>
    <IconsContainerHidden>{children}</IconsContainerHidden>
    <HeadingContent>{content}</HeadingContent>
    <IconsContainer>{children}</IconsContainer>
  </HeadingContainer>
);

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: 1rem;
  font-size: 2.5rem;
  color: ${FOREGROUND_COLOR};
  cursor: pointer;

  &:hover {
    filter: brightness(85%);
  }
`;

export const HeadingIcon = ({
  children,
  onClick,
}: PropsWithChildren<{ onClick?: () => Promise<void> | void }>) => (
  <IconContainer onClick={onClick}>{children}</IconContainer>
);

const Anchor = styled.a`
  display: flex;
  align-items: center;
  color: ${FOREGROUND_COLOR};
`;

export const HeadingIconLink = ({
  children,
  href,
}: PropsWithChildren<{ href: string }>) => (
  <HeadingIcon>
    <Link href={href} passHref>
      <Anchor>{children}</Anchor>
    </Link>
  </HeadingIcon>
);

export const HeadingWithIconLink = ({
  children,
  content,
  href,
}: PropsWithChildren<{ content: ReactNode; href: string }>) => (
  <Heading content={content}>
    <HeadingIconLink href={href}>{children}</HeadingIconLink>
  </Heading>
);

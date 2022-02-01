import TimeAgo from "javascript-time-ago";
import TimeAgoEn from "javascript-time-ago/locale/en.json";
import { getSession, SessionProvider } from "next-auth/react";
import App, { AppContext, AppProps } from "next/app";
import Head from "next/head";
import "normalize.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import Header from "../components/header";
import SessionManager from "../components/session-manager";
import Styles from "../components/styles";

TimeAgo.addDefaultLocale(TimeAgoEn);

const TITLE = "Tourney Base";
const DESCRIPTION = "Create and share tournament brackets in real time!";

export const DECORATE = "app-decorate";

const Footer = styled.div`
  height: 7.5rem;
`;

const CustomApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) => (
  <>
    <Styles />

    <Head>
      <title>{TITLE}</title>
      <meta property="og:title" content={TITLE} />
      <meta name="twitter:title" content={TITLE} />
      <meta name="description" content={DESCRIPTION} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:type" content="website" />
    </Head>

    {pageProps[DECORATE] === false ? (
      <Component {...pageProps} />
    ) : (
      <SessionProvider session={session}>
        <SessionManager>
          <ToastContainer autoClose={4000} />
          <Header />
          <Component {...pageProps} />
          <Footer />
        </SessionManager>
      </SessionProvider>
    )}
  </>
);

export default CustomApp;

CustomApp.getInitialProps = async (ctx: AppContext) => {
  const [props, session] = await Promise.all([
    App.getInitialProps(ctx),
    getSession({ req: ctx.ctx.req }),
  ]);

  return { pageProps: { session, ...props.pageProps } };
};

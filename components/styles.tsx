import {
  BACKGROUND_COLOR,
  FOREGROUND_COLOR,
  LINK_COLOR,
} from "../lib/client/theme";

const Styles = () => (
  <style global jsx>{`
    *,
    *::before,
    *::after {
      box-sizing: border-box;
    }

    body {
      color: ${FOREGROUND_COLOR};
      font-family: Roboto, sans-serif;
      background-color: ${BACKGROUND_COLOR};
      scroll-behavior: smooth;
      overflow-x: hidden;
      user-select: none;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }

    p {
      user-select: text;
    }

    a {
      color: ${LINK_COLOR};
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  `}</style>
);

export default Styles;

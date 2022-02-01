import { PropsWithChildren } from "react";
import ContentSizer from "./content-sizer";

const SimpleLayout = ({ children }: PropsWithChildren<{}>) => (
  <ContentSizer>
    <main>{children}</main>
  </ContentSizer>
);

export default SimpleLayout;

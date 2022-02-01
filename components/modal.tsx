import { PropsWithChildren } from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
import { BACKGROUND_COLOR, BACKGROUND_COLOR_DARK } from "../lib/client/theme";
import ContentSizer from "./content-sizer";

const ContainerOuter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ContainerMiddle = styled.div`
  min-height: 40vh;
`;

const ContainerInner = styled.div`
  background-color: ${BACKGROUND_COLOR};
  padding: 1rem;
  border: 0.25rem solid ${BACKGROUND_COLOR_DARK};
  border-radius: 0.5rem;
`;

const Modal = ({
  children,
  isOpen,
  onRequestClose,
}: PropsWithChildren<{ isOpen: boolean; onRequestClose: () => void }>) => (
  <ReactModal
    isOpen={isOpen}
    onRequestClose={onRequestClose}
    style={{
      content: {
        backgroundColor: "transparent",
        borderRadius: 0,
        border: "none",
        inset: 0,
        padding: 0,
      },
      overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.66)",
      },
    }}
  >
    <ContentSizer>
      <ContainerOuter>
        <ContainerMiddle>
          <ContainerInner>{children}</ContainerInner>
        </ContainerMiddle>
      </ContainerOuter>
    </ContentSizer>
  </ReactModal>
);

export default Modal;

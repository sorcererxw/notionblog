import * as React from 'react'
import styled from "styled-components";

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  justify-content: center;
`;

export default class FigureBlockContainer extends React.Component {

    public render(): React.ReactNode {

        return <Container>
            {this.props.children}
        </Container>
    }

}
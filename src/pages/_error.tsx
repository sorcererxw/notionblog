import * as React from 'react';
import styled from "styled-components";
import '../style/index.css';
import MetaHead from "../component/MetaHead";
import {Desktop, Mobile} from "../component/Responsive";

const Container = styled.div`
  width: 768px;
  max-width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  flex-direction: column;
`;

const StatsCode = styled.div`
  font-size: 256px;
  white-space: nowrap;
  max-width: 100%;
  font-weight: 900;
  user-select: none;
`;

const RedirectButton = styled.a`
  font-size: 36px;
  margin: 36px 0;
  text-decoration: none;
  text-align: center;
  border-radius: 4px;
  padding: 8px;
  user-select: none;
  color: #717171;
  font-weight: 600;
  
  :hover {
    background-color: #efefef;
  }
`;

export default () => (
    <Container>
        <MetaHead title={"Page Not Found"}/>
        <Desktop><StatsCode>4🌚4</StatsCode></Desktop>
        <Mobile><StatsCode style={{fontSize: '30vw'}}>4🌚4</StatsCode></Mobile>
        <RedirectButton href={"/"}>Go to Homepage</RedirectButton>
    </Container>
)
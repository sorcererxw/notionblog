import * as React from "react";
import styled from "styled-components";

const Footer = styled.div`
  display: flex;
  width: 100%;
  color: rgb(152,152,152);
  font-size: 14px;
  padding: 48px 0 40px;
  flex-direction: column;
  align-items: center;
  justify-items: center;
`;

interface IProps {
    _?: any
}

interface IState {
    _: any
}

export default class AppFooter extends React.Component<IProps, IState> {
    public render(): React.ReactNode {
        return (
            <Footer>
                <div>©2013 - 2019 By <a href={"https://sorcererxw.com"}>SorcererXW</a></div>
                <div>Power by <a href={"https://github.com/sorcererxw/blog"}>Notion Blog</a></div>
            </Footer>
        );
    }
}
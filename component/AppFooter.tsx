import * as React from "react";
import styled from "styled-components";

const Footer = styled.div`
  display: flex;
  width: 100%;
  color: var(--caption-color);
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
                <div>Power by <a href={"https://www.notion.so/?r=33c8cb454ee348d98b891834c309f0d4"}>Notion</a> and <a
                    href={"https://github.com/sorcererxw/blog"}>SorcererXW Blog</a></div>
            </Footer>
        );
    }
}
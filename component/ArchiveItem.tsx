import * as React from "react";
import styled from "styled-components";
import {ArticleMeta} from "../api/types";
import * as moment from 'moment';
import {Desktop, Mobile} from "./Responsive";

const PostItem = styled.div`
    margin: 32px 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
`;

const ItemTitle = styled.a`
  font-weight: 700;
  font-size: 18px;
  text-decoration: none;
  color: var(--head-color);
  
  :hover {
    text-decoration: underline;
  }
`;

const ItemTitleBar = styled.div`
    display: flex;
    width: 100%;
    flex-direction: row;
    max-width: 100%;
    box-sizing: border-box;
`;

const ItemTagBar = styled.div`
  margin-top: 4px;
  display: flex;
  flex-direction: row;
`;

const Tag = styled.div`
  display: flex;
  user-select: none;
  flex-direction: row;
  margin-right: 8px;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  text-align: center;
  color:var(--caption-color);
  align-self: baseline;
`;

const PubDate = styled.span`
   align-self: baseline;
   color:var(--caption-color);
   font-size: 16px;
   user-select: none;
   font-weight: 500;
`;

interface Props {
    meta: ArticleMeta
}

interface State {
}

const PostLink = (props: { page: string, title: string }) => (
    <ItemTitle href={`/post/${props.page}`}> {props.title}</ItemTitle>
);

export default class ArchiveItem extends React.Component<Props, State> {

    public render(): React.ReactNode {
        const it = this.props.meta;

        let tagBar: React.ReactNode | null = null;
        const tagItems = it.tags;
        if (tagItems.length > 0) {
            tagBar = <ItemTagBar>
                {tagItems.map((v, k) => <Tag key={k}>#{v}</Tag>)}
            </ItemTagBar>;
        }

        const title = <PostLink page={it.name} title={it.title}/>;

        const dateView = <PubDate>{moment.unix(it.date).format("MMM DD")}</PubDate>;

        const desktop = <Desktop>
            <PostItem>
                <ItemTitleBar>
                    <div>
                        {title}
                        {tagBar}
                    </div>
                    <div style={{flex: 1}}/>
                    {dateView}
                </ItemTitleBar>
            </PostItem>
        </Desktop>;

        const mobile = <Mobile>
            <PostItem>
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    {title}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        {tagBar}
                        <div style={{marginTop: 4}}>{dateView}</div>
                    </div>
                </div>
            </PostItem>
        </Mobile>;

        return <div>
            {desktop}
            {mobile}
        </div>
    }
}
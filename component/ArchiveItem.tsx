import * as React from "react";
import styled from "styled-components";
import {BlockValue, getDate, getName, getTags} from "../api/notion";
import Responsive from 'react-responsive';
import * as moment from 'moment';

const Mobile = props => <Responsive {...props} maxWidth={767}/>;
const Desktop = props => <Responsive {...props} minWidth={768}/>;

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
  color:rgb(187, 187, 187);
  align-self: baseline;
`;

const PubDate = styled.span`
   align-self: baseline;
   color:rgb(187, 187, 187);
   font-size: 16px;
   user-select: none;
   font-weight: 500;
`;

interface IProps {
    blockValue: BlockValue
}

interface IState {
    _: any
}

const PostLink = (props: { page: string, title: string }) => (
    <ItemTitle href={`/post/${props.page}`}> {props.title}</ItemTitle>
);

export default class ArchiveItem extends React.Component<IProps, IState> {

    public render(): React.ReactNode {
        const it = this.props.blockValue;
        const properties = it.properties;
        if (properties === undefined) {
            return null
        }

        let tagBar: React.ReactNode | null = null;
        const tagItems = getTags(it);
        if (tagItems.length > 0) {
            tagBar = <ItemTagBar>
                {tagItems.map((v, k) => <Tag key={k}>#{v}</Tag>)}
            </ItemTagBar>;
        }

        const title = <PostLink page={getName(it)} title={properties.title[0]}/>;

        const dateView = <PubDate>{moment(getDate(it)).format("MMM DD")}</PubDate>;

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
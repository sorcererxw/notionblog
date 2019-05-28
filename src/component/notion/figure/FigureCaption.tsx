import * as React from 'react'
import styled from "styled-components";
import {RichText} from "../../../notion/type";
import StyleText from "../../StyleText";

const Caption = styled.figcaption`
  line-height: 1.4;
  opacity: 0.68;
  color: var(--caption-color);
  margin-top: 8px;
  font-size: 14px;
`;

interface IProps {
    caption: RichText[]
}

interface IState {
}

class FigureCaption extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        return <Caption>
            {this.props.caption.map((it, idx) => {
                const styleText = StyleText.fromRichText(it);
                styleText.key = idx;
                return styleText
            })}
        </Caption>
    }

}

export default FigureCaption

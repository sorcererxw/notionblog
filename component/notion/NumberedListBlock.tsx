import * as React from 'react'
import {IRecordValue} from "../../pages/api/notion";
import TextBlock from "./TextBlock";

interface IProps {
    values: IRecordValue[]
}

interface IState {
    _: undefined
}

class NumberedListBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
    }

    public render(): React.ReactNode {
        return <ol>
            {
                this.props.values.map((it, idx) =>
                    <li key={idx}>
                        <TextBlock value={it}/>
                    </li>
                )
            }
        </ol>
    }
}

export default NumberedListBlock
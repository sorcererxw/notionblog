import * as React from 'react'
import styled from "styled-components";
import {IRecordValue} from "../../pages/api/notion";
import TextBlock from "./TextBlock";

const Container = styled.div`
`;

const Ul = styled.ul`
    padding-left: 1em;
`;

interface ITreeNode {
    value: IRecordValue | null
    children: ITreeNode[]
}

interface IProps {
    values: IRecordValue[]
}

interface IState {
    data: ITreeNode[]
}

class BulletedListBlock extends React.Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            data: []
        }
    }

    public componentDidMount(): void {
        this.setState({
            data: this.toTree(this.props.values)
        });
        console.log(this.state.data)
    }

    public render(): React.ReactNode {
        if (this.state.data.length === 0) {
            return null;
        }
        return <Container>
            <Ul>
                {this.state.data.map((it) =>
                    this.renderList(it)
                )}
            </Ul>
        </Container>
    }

    private renderList = (node: ITreeNode): React.ReactNode => {
        console.log(node.value);
        if (node.value == null) {
            return null;
        }
        if (node.value.value.type === 'bulleted_list') {
            return <li>
                <div>
                    <TextBlock value={node.value}/>
                    <Ul>
                        {node.children.map((it) => this.renderList(it))}
                    </Ul>
                </div>
            </li>
        }
        return <div>
            <TextBlock value={node.value}/>
            <Ul>
                {node.children.map((it) => this.renderList(it))}
            </Ul>
        </div>
    };

    private toTree = (data: IRecordValue[]): ITreeNode[] => {
        function getNode(id: string): ITreeNode {
            let v: IRecordValue | null = null;
            const c: ITreeNode[] = [];
            for (const item of data) {
                if (item.value.id === id) {
                    v = item;
                } else if (item.value.parent_id === id) {
                    c.push(getNode(item.value.id))
                }
            }
            return {
                children: c,
                value: v
            }
        }

        const result: ITreeNode[] = [];
        const parent = data[0].value.parent_id;
        for (const item of data) {
            if (item.value.parent_id === parent) {
                result.push(getNode(item.value.id))
            }
        }
        return result
    };
}

export default BulletedListBlock
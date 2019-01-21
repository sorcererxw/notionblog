import * as React from "react";
import Responsive from 'react-responsive';

export const Mobile = props => <Responsive {...props} maxWidth={767}/>;
export const Desktop = props => <Responsive {...props} minWidth={768}/>;
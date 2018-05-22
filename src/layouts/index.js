import React from 'react'
import { Helmet } from "react-helmet";

class Template extends React.Component {
  constructor(props) {
    super(props);
    if (props.location.pathname.endsWith('framed')) {
      require('../sass/site/site.scss');
    }
  }
  render() {
    const { location, children } = this.props
    return children();
  }
}

export default Template

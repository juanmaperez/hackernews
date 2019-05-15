import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends Component {
  render(){
    return(
      <div className="flex pa1 justify-between nowrap orange">
        <div className="flex pa1 justify-between nowrap orange">
          <div className="fw7 mr1">Hacker News</div>
            <RouterLink to="/" className="ml1 no-underline black">
              new
            </RouterLink>
            <div className="ml1">|</div>
            <RouterLink to="/create" className="ml1 no-underline black">
              submit
            </RouterLink>
        </div>
      </div>
    )
  }
}

export default withRouter(Header);
import React, { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom'
import { withRouter } from 'react-router'
import { AUTH_TOKEN } from '../constants'


class Header extends Component {
  render(){
    const authToken = localStorage.getItem(AUTH_TOKEN)

    return(
      <div className="flex pa1 justify-between nowrap orange">
        <div className="flex pa1 justify-between nowrap orange">
          <div className="fw7 mr1">Hacker News</div>
            <RouterLink to="/" className="ml1 no-underline black">
              new
            </RouterLink>
            {authToken && (
            <div className='flex flex-fixed'>  
              <div className="ml1">|</div>
              <RouterLink to="/create" className="ml1 no-underline black">
                submit
              </RouterLink>
            </div> )}
        </div>
        <div className="flex flex-fixed">
          { authToken ? (
            <div
              className="ml1 pointer black"
              onClick={() => {
                localStorage.removeItem(AUTH_TOKEN)
                this.props.history.push(`/`)
              }}
            >
              logout
            </div>
          ) : (
            <RouterLink to="/login" className="ml1 no-underline black">
              login
            </RouterLink>
          )}
        </div>
      </div>
    )
  }
}

export default withRouter(Header);
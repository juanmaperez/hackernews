import React, { Component } from 'react';

import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

import { timeDifferenceForDate } from './../utils/utils.js'
import { AUTH_TOKEN } from './../constants.js'


const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`

class Link extends Component {

  render(){
    const authToken = localStorage.getItem(AUTH_TOKEN)
    const { link, index} = this.props
    return(
        <div className="flex mt2 items-start">
          <div className="flex items-center">
            <span className="gray">{ index + 1}.</span>
            {authToken && (
              <Mutation 
                mutation={VOTE_MUTATION}
                variables={{ linkId: link.id }}
                update={ (store, { data: {vote}}) => this.props.updateStoreAfterVote(store, vote, link.id)}
                >
                { voteMutation => (
                  <div style={{'cursor': 'pointer', 'border': '1px solid red'}} className="ml1 gray f11" onClick={ voteMutation }>
                    ▲
                  </div>
                )}
              </Mutation>
            )}
            <div className="ml1">
              <div>
                { link.description} ({ link.url})
              </div>
            </div>    
            <div className="f6 lh-copy gray">
              { link.votes.length} votes | by{' '}
              { link.postedBy
                ? link.postedBy.name
                : 'Unknown'}{' '}
              {timeDifferenceForDate(link.createdAt)}
            </div>
          </div>
        </div>
    )
  }
}

export default Link;
      
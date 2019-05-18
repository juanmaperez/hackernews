import React, { Component } from 'react';
import Link from './Link';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }`

  const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
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

class LinkList extends Component {

  _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY })
    const votedLink = data.feed.links.find( link => link.id === linkId)
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data })
  }

  // You’re passing two arguments to subscribeToMore:
  // document:    This represents the subscription query itself. In your case, 
  //              the subscription will fire every time a new link is created.
  // updateQuery: Similar to cache update prop, this function allows you to determine 
  //              how the store should be updated with the information 
  //              that was sent by the server after the event occurred. 
  //              In fact, it follows exactly the same principle as a Redux reducer: 
  //              It takes as arguments the previous state (of the query that subscribeToMore was called on) 
  //              and the subscription data that’s sent by the server. 
  //              You can then determine how to merge the subscription data into the existing state 
  //              and return the updated data. All you’re doing inside updateQuery is retrieving the new link 
  //              from the received subscriptionData, merging it into the existing list of links 
  //              and returning the result of this operation.

  _subscribeToNewLinks = subscribeToMore => {
    subscribeToMore({
      document:NEW_LINKS_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if ( !subscriptionData.data) return prev
        const newLink = subscriptionData.data.newLink
        const exists = prev.feed.links.find(({id}) => id === newLink.id )
        if ( exists ) return prev;

        return Object.assign({}, prev, { feed : {
            links: [newLink, ...prev.feed.links],
            count: prev.feed.links.length + 1,
            __tpename: prev.feed.__typename
          }
        })
      }
    })
  }

  _subscribeToNewVotes = subscribeToMore => {
    subscribeToMore({
      document: NEW_VOTES_SUBSCRIPTION
    })
  }

  render() {
    return (
      <Query query={FEED_QUERY}>
        {({loading, error, data, subscribeToMore}) => {
          if (loading) return <div>fetching...</div>
          if(error) return <div>Error...</div>
          
          // the two subscriptions in our app for links
          this._subscribeToNewLinks(subscribeToMore)
          this._subscribeToNewVotes(subscribeToMore)

          const linksToRender = data.feed.links;

          return (        
            <ul>
              { linksToRender.map((link, index) => (
                <li key={link.id}>
                  <Link 
                    index={index} 
                    link={link} 
                    updateStoreAfterVote={ this._updateCacheAfterVote}/>
                </li>))
              }
            </ul>
          )
        }}
      </Query>
    )
  }

}

export default LinkList

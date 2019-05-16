import React from 'react';
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

const LinkList = () => {

  const _updateCacheAfterVote = (store, createVote, linkId) => {
    const data = store.readQuery({ query: FEED_QUERY })
    const votedLink = data.feed.links.find( link => link.id === linkId)
    votedLink.votes = createVote.link.votes;

    store.writeQuery({ query: FEED_QUERY, data })
  }

  return (
      <Query query={FEED_QUERY}>
        {({loading, error, data}) => {
          if (loading) return <div>fetching...</div>
          if(error) return <div>Error...</div>
          
          const linksToRender = data.feed.links;

          return (        
            <ul>
              { linksToRender.map((link, index) => (
                <li key={link.id}>
                  <Link 
                    index={index} 
                    link={link} 
                    updateStoreAfterVote={ _updateCacheAfterVote}/>
                </li>))
              }
            </ul>
          )
        }}
      </Query>
    )
}

export default LinkList

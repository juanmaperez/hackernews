import React from 'react';
import Link from './Link';
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }`

const LinkList = () => {

  return (
      <Query query={FEED_QUERY}>
        {({loading, error, data}) => {
          if (loading) return <div>fetching...</div>
          if(error) return <div>Error...</div>
          
          const linksToRender = data.feed.links;

          return (        
            <ul>
              { linksToRender.map((link) => <li><Link key={link.id} link={link}/><br/></li> )}
            </ul>
          )
        }}
      </Query>
    )
}

export default LinkList

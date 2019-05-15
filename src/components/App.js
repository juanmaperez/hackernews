import React from 'react';
import './../styles/App.css';
import LinkList from './LinkList'
import CreateLink from './CreateLink'

function App() {
  return (
   <div>
     <div>
      <CreateLink />
     </div>
     <div>
       <LinkList />
     </div>
   </div> 
  );
}

export default App;

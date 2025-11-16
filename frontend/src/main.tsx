import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ApolloClient,HttpLink, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';


// setup apollo client 
const client = new ApolloClient({
  link: new HttpLink(
    {uri: "http://localhost:3000/graphql"}),
  cache: new InMemoryCache(),
});

// Type-safe root element
const container = document.getElementById('root');
if (!container) throw new Error("Root element not found");

const root = createRoot(container);
root.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <Router>
      <App />
     </Router>
    </ApolloProvider>
    
  </StrictMode>
);

import React from 'react';
import { connect } from 'react-redux';


const App = ({ test }) => {
  return (<div>
    <h1>Isomerphic React App {test}</h1>
  </div>)

}

// export default App;

//adding redux
const mapStateToProps = (state, ownProps) => {
  return { ...state }
}

export default connect(mapStateToProps)(App)
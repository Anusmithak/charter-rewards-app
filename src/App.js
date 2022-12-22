import './App.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './Components/Header';
import React from 'react';

import bg from './Assets/rewards-page-bg.jpg';
import Footer from './Components/Footer';
import RewardsMain from './Components/Rewards/RewardsMain';

function App() {
  return (
    <div className='App' style={{ backgroundImage: `url(${bg})` }}>
      <Header />
      <RewardsMain />
      <Footer />
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import './App.css'; // Create this file to style the cards
import SnapchatDownloader from './components/SnapchatDownloader'
import InstaDownloader from './components/InstaDownloader';
import YoutubeDownloader from './components/YoutubeDownloader'
// Main App Component
const App = () => {
  // State to track the currently selected platform (Instagram, Snapchat, YouTube)
  const [selectedPlatform, setSelectedPlatform] = useState('');

  // Function to handle the card click
  const handleCardClick = (platform) => {
    setSelectedPlatform(platform); // Update the selected platform
  };

  // Render content based on the selected platform
  const renderContent = () => {
    switch (selectedPlatform) {
      case 'Instagram':
        return (
          <div>
            <InstaDownloader />
          </div>
        );
      case 'Snapchat':
        return (
          <div>
            <SnapchatDownloader />
          </div>
        );
      case 'YouTube':
        return (
          <div>
           <YoutubeDownloader />
          </div>
        );
      default:
        return <p>Select a platform to view its downloader.</p>;
    }
  };

  return (
    <div className="app-container">
      <h1>Social Media Downloader</h1>
      <div className="card-container">
        {/* Instagram Card */}
        <div
          className="card"
          onClick={() => handleCardClick('Instagram')}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
            alt="Instagram"
          />
          <h3>Instagram</h3>
        </div>

        {/* Snapchat Card */}
        <div
          className="card"
          onClick={() => handleCardClick('Snapchat')}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1024px-Snapchat_logo.svg.png"
            alt="Snapchat"
          />
          <h3>Snapchat</h3>
        </div>

        {/* YouTube Card */}
        <div
          className="card"
          onClick={() => handleCardClick('YouTube')}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
            alt="YouTube"
          />
          <h3>YouTube</h3>
        </div>
      </div>

      {/* Render the content based on the selected platform */}
      <div className="content-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default App;

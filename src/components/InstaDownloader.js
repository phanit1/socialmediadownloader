import React, { useState } from 'react';
import axios from 'axios';

const InstaDownloader = () => {
  const [url, setUrl] = useState(''); // Stores the Instagram post/reel/story URL
  // const [error, setError] = useState(''); // Stores error messages
  // const [loading, setLoading] = useState(false); // To show loading state
  const [mediaFiles, setMediaFiles] = useState([])
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError('');
    // setLoading(true);
    const options = {
      method: 'POST',
      url: 'https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink',
      headers: {
        'x-rapidapi-key': 'aa0a1c4d8bmsh56ee676007c7e75p1642d3jsnb6d63b8efb61',
        'x-rapidapi-host': 'auto-download-all-in-one.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        url: url
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data.medias);
      setMediaFiles(response.data.medias);
      console.log(mediaFiles,"MF")
    } catch (error) {
      console.error(error);
    }
    // console.log(shortCode, urlPathList)
    // setLoading(false);
  };

  // Function to extract the original filename from URL
  const getFileNameFromUrl = (url) => {
    // return url.substring(url.lastIndexOf('/') + 1).split('?')[0]; // Extract file name
    return url.split("/")[5].split(".")[0];
  };


  // Function to handle downloading the media
  const handleDownload = async (media) => {
    console.log(media, "MF")
    try {
      let fileName = getFileNameFromUrl(media.url);
      console.log(media.type)
      // window.open(media.url, '_blank');
      // Fetch the file as a Blob
      const response = await axios.get(media.url, {
        responseType: 'blob', // Important to get the file as a binary Blob
      });

      // Create a blob URL
      const blob = new Blob([response.data], { type: response.data.type });
      const blobUrl = window.URL.createObjectURL(blob);
      console.log(fileName, "filenmae")
      // Create an anchor element to trigger the download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName; // Set the original file name
      document.body.appendChild(link);
      link.click();

      // Clean up
      window.URL.revokeObjectURL(blobUrl); // Revoke the blob URL after download
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading file:', err);
      // setError('Failed to download the file. Please try again.');
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1>Instagram Photo/Video/Reel/Story Downloader</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste Instagram URL here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ width: '300px', padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ marginLeft: '10px', padding: '10px 20px' }}>
          Download
        </button>
      </form>

      {/* {loading && <p>Fetching download link, please wait...</p>} */}
      {/* {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>} */}

      {mediaFiles.map((media, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          {media.type === 'image' ? (
            <img src={media.url} alt="Medias Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          ) : (
            <video controls src={media.url} style={{ maxWidth: '100%', height: 'auto' }}>
              Your browser does not support the video tag.
            </video>
          )}
          <br />
          <button onClick={() => handleDownload(media)} style={{ marginTop: '10px', padding: '10px 20px' }}>
            Download {media.type === 'image' ? 'Image' : 'Video'}
          </button>
        </div>
      ))}
    </div>
  );
};

export default InstaDownloader;


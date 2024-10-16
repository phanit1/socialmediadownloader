import React, { useState } from 'react';
import axios from 'axios';

const SnapchatDownloader = () => {
    const [url, setUrl] = useState(''); // URL of the media
    const [error, setError] = useState(''); // Error handling
    const [loading, setLoading] = useState(false); // Loading state
    const [mediaFiles, setMediaFiles] = useState([]); // Array of media files

    // Function to handle the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Example API call to fetch the downloadable media URL
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
                  console.log(response.data.medias,"resp");
                  setMediaFiles(response.data.medias)
              } catch (error) {
                  console.error(error);
              }
        } catch (err) {
            console.error('Error fetching media:', err);
            setError('Failed to fetch the media. Please try again.');
        }
        setLoading(false);
    };

    // Function to extract the original filename from URL
    const getFileNameFromUrl = (url) => {
        // return url.substring(url.lastIndexOf('/') + 1).split('?')[0]; // Extract file name
        return url.split("/")[4].split(".")[0];
    };

    // Function to handle downloading the media
    const handleDownload = async (media) => {
        try {
            let fileName = getFileNameFromUrl(media.url);
            console.log(media.type)

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
            setError('Failed to download the file. Please try again.');
        }
    };

    return (
        <div>
            <h2>Snapchat Content</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Paste Snapchat URL here"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    style={{ width: '300px', padding: '10px', marginRight: '10px' }}
                />
                <button type="submit" style={{ padding: '10px 20px' }}>
                    Fetch Media
                </button>
            </form>

            {loading && <p>Fetching media, please wait...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {mediaFiles.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    {mediaFiles.map((media, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            {media.type === 'image' ? (
                                <img src={media.url} alt="Media Preview" style={{ maxWidth: '100%', height: 'auto' }} />
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
            )}
        </div>
    );
};

export default SnapchatDownloader;



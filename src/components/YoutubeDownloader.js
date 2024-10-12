import React, { useState } from 'react';
import axios from 'axios';
// import './YoutubeDownloader.css'; // Ensure you have the CSS for styling

const YoutubeDownloader = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [allFormatFiles, setallFormatFiles] = useState([])
    let embedUrl = "";
    function extractYouTubeID(url) {
        let videoId;

        // Regular YouTube URL
        const regExp1 = /^.*(?:youtu.be\/|v\/|watch\?v=)([^#&?]*).*/;
        // YouTube Shorts URL
        const regExp2 = /^.*(?:youtube\.com\/shorts\/)([^#&?]*).*/;

        // Check if it matches the regular video URL pattern
        const match1 = url.match(regExp1);
        if (match1 && match1[1].length === 11) {
            videoId = match1[1];
        }

        // Check if it matches the shorts URL pattern
        const match2 = url.match(regExp2);
        if (match2) {
            videoId = match2[1];
        }
        embedUrl = "https://www.youtube.com/embed/" + videoId;

        return videoId;
    }

    // Function to download YouTube video
    const downloadYouTubeVideo = async () => {
        const videoId = extractYouTubeID(videoUrl);
        if (!videoId) {
            alert('Invalid YouTube URL');
            return;
        }
        const options = {
            method: 'GET',
            url: 'https://yt-api.p.rapidapi.com/dl',
            params: { id: videoId },
            headers: {
                'x-rapidapi-key': 'aa0a1c4d8bmsh56ee676007c7e75p1642d3jsnb6d63b8efb61',
                'x-rapidapi-host': 'yt-api.p.rapidapi.com'
            }
        };

        try {
            // Replace with your backend API endpoint or a third-party service
            const response = await axios.request(options);
            setallFormatFiles(response.data.adaptiveFormats);
            console.log(response.data, "D")
            console.log(allFormatFiles);
        } catch (error) {
            console.error('Error fetching download link:', error);
        }
    };

    const handleDownloadClick = (file) => {
        if (file) {
            // const link = document.createElement('a');
            // link.href = file.url;
            // link.download = ''; // You can specify a filename here if needed
            // document.body.appendChild(link);
            // link.click();
            // link.remove();
            window.open(file.url, '_blank');
        }
    };

    return (
        <div className="app-container">
            <div>
                <h2>YouTube Content</h2>
                <input
                    type="text"
                    placeholder="Paste YouTube video URL"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    required
                    style={{ width: '300px', padding: '10px', fontSize: '16px' }}
                />
                <button type="submit" onClick={downloadYouTubeVideo} style={{ marginLeft: '10px', padding: '10px 20px' }}>
                    Download
                </button>
                <iframe width="640" height="360" src={embedUrl} title="Hilarious food Vlog with Sree Vishnu || SWAG || Daksha Nagarkar || Cocanada || TastyTeja | Infinitum" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
                {videoUrl && (
                    <div>
                        <p>Download your video:</p>
                        <button onClick={handleDownloadClick(allFormatFiles[0])}>Download Video</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YoutubeDownloader;

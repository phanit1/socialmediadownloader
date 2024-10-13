import React, { useState } from 'react';
import axios from 'axios';

const YoutubeDownloader = () => {
    const [videoUrl, setVideoUrl] = useState('');
    const [allFormatFiles, setAllFormatFiles] = useState([]);
    const [selectedFormat, setSelectedFormat] = useState(null);
    const [mediaUrl, setMediaUrl] = useState('');
    const [fileName, setFileName] = useState('downloaded_video');

    const extractYouTubeID = (url) => {
        let videoId;

        const regExp1 = /^.*(?:youtu.be\/|v\/|watch\?v=)([^#&?]*).*/;
        const regExp2 = /^.*(?:youtube\.com\/shorts\/)([^#&?]*).*/;

        const match1 = url.match(regExp1);
        if (match1 && match1[1].length === 11) {
            videoId = match1[1];
        }

        const match2 = url.match(regExp2);
        if (match2) {
            videoId = match2[1];
        }

        return videoId;
    };

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
            const response = await axios.request(options);
            setAllFormatFiles(response.data.adaptiveFormats);
            console.log(allFormatFiles,"AFF")
        } catch (error) {
            console.error('Error fetching download link:', error);
        }
    };

    const handleDownloadClick = async () => {
        if (!selectedFormat) {
            alert('Please select a video format to download.');
            return;
        }

        try {
            const response = await axios.get(selectedFormat.url, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: selectedFormat.mimeType });
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${fileName}.${selectedFormat.mimeType.split('/')[1]}`;
            document.body.appendChild(link);
            link.click();

            window.URL.revokeObjectURL(blobUrl);
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading video:', error);
        }
    };

    return (
        <div className="app-container">
            <h2>YouTube Video Downloader</h2>
            <input
                type="text"
                placeholder="Paste YouTube video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                required
                style={{ width: '300px', padding: '10px', fontSize: '16px' }}
            />
            <button type="submit" onClick={downloadYouTubeVideo} style={{ marginLeft: '10px', padding: '10px 20px' }}>
                Fetch Formats
            </button>

            {allFormatFiles.length > 0 && (
                <>
                    <div>
                        <label htmlFor="format">Choose a format:</label>
                        <select
                            id="format"
                            onChange={(e) => setSelectedFormat(allFormatFiles[e.target.value])}
                        >
                            <option value="">Select format</option>
                            {allFormatFiles.map((file, index) => (
                                <option key={index} value={index}>
                                    {file.qualityLabel} - {file.mimeType}
                                </option>
                            ))}
                        </select>
                    </div>

                    <input
                        type="text"
                        placeholder="Enter a file name"
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        style={{ marginTop: '10px', padding: '10px' }}
                    />

                    <button onClick={handleDownloadClick} style={{ marginLeft: '10px', padding: '10px 20px' }}>
                        Download
                    </button>
                </>
            )}
        </div>
    );
};

export default YoutubeDownloader;

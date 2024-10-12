import React, { useState } from 'react';
import axios from 'axios';

const InstaDownloader = () => {
  const [url, setUrl] = useState(''); // Stores the Instagram post/reel/story URL
  const [downloadLink, setDownloadLink] = useState(''); // Stores the downloadable link
  const [error, setError] = useState(''); // Stores error messages
  const [loading, setLoading] = useState(false); // To show loading state
  const [mediaFiles, setMediaFiles] = useState({})
  const [multipleMediaFiles, setMultipleMediaFiles] = useState([])
  const [shortCode, setShortCode] = useState("")
  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDownloadLink('');
    setLoading(true);
    let urlPathList = url.split("/");
    if (urlPathList[3] === "stories") {
      setShortCode(urlPathList[urlPathList.length - 1].split("?")[0])
      const options = {
        method: 'POST',
        url: 'https://instagram-bulk-scraper-latest.p.rapidapi.com/download_story_from_url',
        headers: {
          'x-rapidapi-key': 'aa0a1c4d8bmsh56ee676007c7e75p1642d3jsnb6d63b8efb61',
          'x-rapidapi-host': 'instagram-bulk-scraper-latest.p.rapidapi.com',
          'Content-Type': 'application/json'
        },
        data: {
          url: url
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);
        setDownloadLink(response.data.data)
      } catch (error) {
        console.error(error);
      }
    }
    else {
      setShortCode(urlPathList[urlPathList.length - 2])
      // shortCode =
      const options = {
        method: 'GET',
        url: 'https://instagram-bulk-scraper-latest.p.rapidapi.com/media_download_by_shortcode/' + shortCode,
        headers: {
          'x-rapidapi-key': 'aa0a1c4d8bmsh56ee676007c7e75p1642d3jsnb6d63b8efb61',
          'x-rapidapi-host': 'instagram-bulk-scraper-latest.p.rapidapi.com'
        }
      };

      try {
        const response = await axios.request(options);
        console.log(response.data);
        setMediaFiles(response.data.data)
        if (response.data.data.child_medias_hd) {
          setMultipleMediaFiles(response.data.data.child_medias_hd)
        }
        else if (response.data.data.main_media_hd) {
          setDownloadLink(response.data.data.main_media_hd); // Set the link to download
        } else {
          setError('Could not fetch the download link. Please check the URL.');
        }
      } catch (error) {
        console.error(error);
        console.error('Error fetching the media', error);
        setError('Failed to fetch the media. Please try again.');
      }
    }
    console.log(shortCode, urlPathList)

    setLoading(false);
  };

  // Function to handle downloading the media
  const handleDownload = async (media) => {
    console.log(mediaFiles, "MF")
    try {
      // let fileName = getFileNameFromUrl(media.snapUrls.mediaUrl);
      let fileName = shortCode
      console.log(shortCode)
      console.log(media, "file")
      if (media.main_media_type === 'video' || media.video_hd) {
        fileName += '.mp4'
      }
      else if (media.main_media_type === 'image' || media.image_hd) {
        fileName += '.jpeg'
      }
      console.log(fileName)
      window.open(media.image_hd, '_blank');

      // Create a temporary <a> element to trigger the download with a custom filename
      // const link = document.createElement('a');
      // link.href = media.image_hd; // Use the direct URL of the image
      // link.download = fileName; // Set the desired file name

      // // Append the link to the document
      // document.body.appendChild(link);

      // // Simulate a click to download the file
      // link.click();

      // // Remove the link from the DOM after triggering the download
      // document.body.removeChild(link);
      // const link = document.createElement('a');
      // link.href = downloadLink;
      // link.download = fileName; // Specify the name of the downloaded file
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // fetch(media.image_hd)
      //   .then(response => response.blob())
      //   .then(blob => {
      //     const link = document.createElement("a");
      //     link.href = URL.createObjectURL(blob);
      //     link.download = fileName;
      //     console.log(fileName, "FN")
      //     document.body.appendChild(link);
      //     link.click();
      //     document.body.removeChild(link);
      //   })
      //   .catch(error => console.error('Error downloading image:', error));
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Failed to download the file. Please try again.');
    }
  };

  // Function to handle downloading the media
  const handleMultipleDownload = async (media) => {
    try {
      // let fileName = getFileNameFromUrl(media.snapUrls.mediaUrl);
      const urlObj = new URL(media.url);
      const pathParts = urlObj.searchParams.get('url').split('/');
      const filename = pathParts[5].split('?')[0];
      console.log(filename)
      const response = await fetch("https://scontent.cdninstagram.com/v/t51.29350-15/462201555_3732020637127950_2553122424404738687_n.jpg?stp=dst-jpg_e35_p1080x1080&_nc_ht=scontent.cdninstagram.com&_nc_cat=106&_nc_ohc=6ujXrlt2lvQQ7kNvgExsVIc&_nc_gid=abf5a2a005d34deeae9ee3e30bbada69&edm=APs17CUBAAAA&ccb=7-5&oh=00_AYCP2cpwS6wuDc0aGswbxeJ6J2hwkXdFddL-OureXMrlXg&oe=670B324F&_nc_sid=10d13b&dl=1");
      console.log(response)
      // Since the response is opaque, we can't access the content directly
      if (response.ok) {
        console.log('Download initiated');

        window.open(media.url, '_blank');

      } else {
        console.error('Failed to fetch the video:', response.status);
      }

    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Failed to download the file. Please try again.');
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

      {loading && <p>Fetching download link, please wait...</p>}
      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}

      {multipleMediaFiles.map((media, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          {media.type === 'image' ? (
            <img src={media.url} alt="Media Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          ) : (
            <video controls src={media.url} style={{ maxWidth: '100%', height: 'auto' }}>
              Your browser does not support the video tag.
            </video>
          )}
          <br />
          <button onClick={() => handleMultipleDownload(media)} style={{ marginTop: '10px', padding: '10px 20px' }}>
            Download {media.type === 'image' ? 'Image' : 'Video'}
          </button>
        </div>
      ))}

      {downloadLink && (
        <div style={{ marginBottom: '20px' }}>
          {mediaFiles.main_media_type === 'image' || downloadLink.image_hd ? (
            <img src={downloadLink.image_hd} alt="Media Preview" style={{ maxWidth: '100%', height: 'auto' }} />
          ) : (
            <video controls src={downloadLink.video_hd} style={{ maxWidth: '100%', height: 'auto' }}>
              Your browser does not support the video tag.
            </video>
          )}
          <br />
          {!mediaFiles ? (
            <button onClick={() => handleDownload(mediaFiles)} style={{ marginTop: '10px', padding: '10px 20px' }}>
              Download {mediaFiles.main_media_type === 'image' || downloadLink ? 'Image' : 'Video'}
            </button>
          ) : (
            <button onClick={() => handleDownload(downloadLink)} style={{ marginTop: '10px', padding: '10px 20px' }}>
              Download Story {mediaFiles.main_media_type === 'image' || downloadLink ? 'Image' : 'Video'}
            </button>
          )}

        </div>


      )}
    </div>
  );
};

export default InstaDownloader;


import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import domtoimage from 'dom-to-image';
import { FileUploader } from "react-drag-drop-files";

export default function App() {
  const [data, setData] = useState();
  const [randomPicture, setRandomPicture] = useState();
  const [memeText, setMemeText] = useState({ top: "", bottom: "" });
  const [mounted, setMounted] = useState(false);
  const finalMeme = useRef(null);
  const fileTypes = ["JPG", "PNG", "GIF"];

  useEffect(() => {
    let isLoading = true;

    const fetchData = async () => {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const json = await response.json();
      if (isLoading) {
        setData(json.data.memes);
        setMounted(true);
      }
    };
    fetchData().catch(console.error);
    return () => (isLoading = false);
  }, []);

  const handleChange = (file) => {
    const objectURL = URL.createObjectURL(file);
    setRandomPicture(objectURL);
  };

  const createDownloadFile = () => {
    const myImage = finalMeme.current;
    domtoimage.toJpeg(myImage, {quality: 0.95}).then(imageUrl => {
      const link = document.createElement('a');
      link.download = 'meme.jpg';
      link.href = imageUrl;
      link.click()
    })
  }

  return (
    <div className="App">
      <div className="memegenerator">
        <div className="memeWrapper" ref={finalMeme}>
        <h1>MAKE : MEME</h1>
          {mounted && (
            <>
              <img
                src={randomPicture ? randomPicture : data[0].url}
                alt="meme"
              />
            </>
          )}
          <h2 className="textTop">{memeText.top}</h2>
          <h2 className="textBottom">{memeText.bottom}</h2>
        </div>
        <div className="playground">
          <div className="userInput actionButtons">
            <button
              style={{ backgroundColor: "#5edb89" }}
              onClick={() => {
                let number = Math.floor(Math.random() * 100);
                setRandomPicture(data[number].url);
              }}
            >
              START
            </button>
            <p className="upload">Upload your own picture</p>
            <FileUploader className="draganddrop" handleChange={handleChange} name="file" types={fileTypes}/>
            <div className="userInput actionButtons">
              <button onClick={createDownloadFile} style={{ backgroundColor: "#bbdcfa" }}>DOWNLOAD</button>
            </div>
          </div>
          <div className="userInput">
            <p>Enter your text here</p>
            <input
              onChange={(e) => setMemeText({...memeText, top: e.target.value})}
              type="text"
              placeholder="top text"
              value={memeText.top}
            />
            <input
              onChange={(e) => setMemeText({...memeText, bottom: e.target.value})}
              type="text"
              placeholder="bottom text"
              value={memeText.bottom}
            />
          </div>
          <div className="userInput actionButtons">
            <button
              onClick={() => {

                setMemeText({ top: "", bottom: "" });
                setRandomPicture(); 
              }}
              style={{ backgroundColor: "#ff8800" }}
            >
              RESET
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

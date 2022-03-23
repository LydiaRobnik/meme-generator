import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import domtoimage from 'dom-to-image';

export default function App() {
  const [data, setData] = useState();
  const [randomPicture, setRandomPicture] = useState();
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [memeText, setMemeText] = useState({ top: "", bottom: "" });
  const [mounted, setMounted] = useState(false);
  const [userFiles, setUserFiles] = useState({selectedFile: null});
  let finalMeme = useRef(null);

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

  const useUserUploadAsMemePic = () => {
    const objectURL = URL.createObjectURL(userFiles.selectedFile);
    setRandomPicture(objectURL)
  }

  const createDownloadFile = () => {
    const img = new Image();
        img.src = finalMeme;
  }

  return (
    <div className="App">
      <h1>Create your own memes</h1>
      <div className="memegenerator">
        <div className="memeWrapper">
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
            <p>1. Choose or upload a picture</p>
            <button
              style={{ backgroundColor: "#5edb89" }}
              onClick={() => {
                let number = Math.floor(Math.random() * 100);
                setRandomPicture(data[number].url);
              }}
            >
              Random picture
            </button>
            <p className="upload">Upload your own pictures</p>
            <input onChange={(e) => setUserFiles({selectedFile: e.target.files[0]})} type="file" id="input" accept="image/*"/>
            <button onClick={useUserUploadAsMemePic} style={{ backgroundColor: "#bbdcgf" }}>Upload</button>
            <button style={{ backgroundColor: "#bbdcfa" }}>Download</button>
          </div>
          <div className="userInput">
            <p>2. Enter your text here:</p>
            <input
              onChange={(e) => setTopText(e.target.value)}
              type="text"
              placeholder="top text"
              value={topText}
            />
            <input
              onChange={(e) => setBottomText(e.target.value)}
              type="text"
              placeholder="bottom text"
              value={bottomText}
            />
            <button
              onClick={() => {
                setMemeText({ top: topText, bottom: bottomText });
              }}
            >
              Add your text
            </button>
          </div>
          <div className="userInput actionButtons">
            <button
              onClick={() => {
                setTopText("");
                setBottomText("");
                setMemeText({ top: "", bottom: "" });
                setRandomPicture();
              }}
              style={{ backgroundColor: "#FF865E" }}
            >
              Reset everything
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import "./App.css";
import React, { useEffect, useState, useRef } from "react";
import domtoimage from 'dom-to-image';
import { FileUploader } from "react-drag-drop-files";


export default function App() {
  const [data, setData] = useState();
  const [randomPicture, setRandomPicture] = useState();
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [memeText, setMemeText] = useState({ top: "", bottom: "" });
  const [mounted, setMounted] = useState(false);
  const [userFiles, setUserFiles] = useState({selectedFile: null});
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
      <h1>Create your own memes</h1>
      <div className="memegenerator">
        <div className="memeWrapper" ref={finalMeme}>
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
            <FileUploader handleChange={handleChange} name="file" types={fileTypes}/>
            <button onClick={createDownloadFile} style={{ backgroundColor: "#bbdcfa" }}>Download</button>
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
                setUserFiles({selectedFile: null})
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

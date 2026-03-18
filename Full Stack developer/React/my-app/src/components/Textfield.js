import React, { useState } from 'react'

export default function Textfield(props) {
  const [text, setText] = useState("");
  const [mode, setMode] = useState('light');
  const [language, setLanguage] = useState('English');
  const [speechSpeed, setSpeechSpeed] = useState(1);

  const handleChange = (event) => {
    setText(event.target.value);
  }

  const handleuppercase = () => {
    setText(text.toUpperCase());
  }

  const handlelowercase = () => {
    setText(text.toLowerCase());
  }

  const handleReverse = () => {
    setText(text.split('').reverse().join(''));
  }

  const handleRemoveSpaces = () => {
    setText(text.replace(/\s+/g, ' ').trim());
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  }

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = "my-text.txt";
    document.body.appendChild(element);
    element.click();
  }

  const handlereset = () => {
    setText("");
  }

  const toggleMode = () => {
    if (mode === 'light') {
      setMode('dark');
      document.body.style.backgroundColor = '#042743';
    } else {
      setMode('light');
      document.body.style.backgroundColor = 'white';
    }
  }

  // Speech Synthesis
  const handleSpeak = (textToSpeak) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = speechSpeed;
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Speech synthesis not supported in this browser.");
    }
  }

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  const handleResume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  const handleStop = () => {
    window.speechSynthesis.cancel();
  }

  const handleTranslate = () => {
    console.log(`Translating to ${language}... (Placeholder)`);
    alert(`Translation to ${language} logic would go here!`);
  }

  // Summary Metrics
  const charCount = text.length;
  const wordCount = text.split(/\s+/).filter((element) => { return element.length !== 0 }).length;
  const sentenceCount = text.split(/[.!?]+/).filter((element) => { return element.length !== 0 }).length;
  const readingTime = (0.008 * wordCount).toFixed(2);


  return (
    <div className="container" style={{ color: mode === 'dark' ? 'white' : '#042743', minHeight: '100vh', paddingBottom: '50px' }}>
      <h1 className="mb-4">Ultimate Smart Text Utility App</h1>

      <div className="mb-3">
        <textarea
          className="form-control"
          value={text}
          onChange={handleChange}
          style={{
            backgroundColor: mode === 'dark' ? 'grey' : 'white',
            color: mode === 'dark' ? 'white' : '#042743'
          }}
          rows="8"
          placeholder="Enter your text here...">
        </textarea>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-3">
        <button className="btn btn-primary" onClick={handleuppercase}>Uppercase</button>
        <button className="btn btn-success" onClick={handlelowercase}>Lowercase</button>
        <button className="btn btn-warning" onClick={handleReverse}>Reverse</button>
        <button className="btn btn-info" onClick={handleRemoveSpaces}>Remove Spaces</button>
        <button className="btn btn-secondary" onClick={handleCopy}>Copy</button>
        <button className="btn btn-dark" onClick={handleDownload}>Download</button>
        <button className="btn btn-danger" onClick={handlereset}>Clear</button>
        <button className={`btn ${mode === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`} onClick={toggleMode}>
          Toggle {mode === 'light' ? 'Dark' : 'Light'}
        </button>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="languageSelect" className="form-label">Select Language:</label>
          <select
            id="languageSelect"
            className="form-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ backgroundColor: mode === 'dark' ? 'grey' : 'white', color: mode === 'dark' ? 'white' : '#042743' }}
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="French">French</option>
            <option value="Spanish">Spanish</option>
            <option value="German">German</option>
          </select>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 mb-4">
        <button className="btn btn-primary" onClick={handleTranslate}>Translate</button>
        <button className="btn btn-success" onClick={() => handleSpeak(text)}>Speak Original</button>
        <button className="btn btn-info" onClick={() => handleSpeak(text)}>Speak Translation</button> {/* Placeholder for translation */}
        <button className="btn btn-warning" onClick={handlePause}>Pause</button>
        <button className="btn btn-info" onClick={handleResume}>Resume</button>
        <button className="btn btn-danger" onClick={handleStop}>Stop</button>
      </div>

      <div className="mb-4">
        <label htmlFor="speechSpeed" className="form-label">Speech Speed: {speechSpeed}x</label>
        <input
          type="range"
          className="form-range"
          min="0.5"
          max="2"
          step="0.1"
          id="speechSpeed"
          value={speechSpeed}
          onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
        />
      </div>

      <div className="container my-3">
        <h2>📊 Text Summary</h2>
        <div className="d-flex justify-content-between p-3 border rounded bg-light">
          <span><b>Words:</b> {wordCount}</span>
          <span><b>Characters:</b> {charCount}</span>
          <span><b>Sentences:</b> {sentenceCount}</span>
          <span><b>Reading Time:</b> {readingTime} minutes</span>
        </div>

        <h3 className="mt-4">👀 Preview</h3>
        <div className="p-3 border rounded" style={{ minHeight: '100px', backgroundColor: mode === 'dark' ? 'grey' : 'white', color: mode === 'dark' ? 'white' : 'black' }}>
          <p>{text.length > 0 ? text : "Nothing to preview..."}</p>
        </div>
      </div>
    </div>
  )
}

import React, { useState, useRef } from 'react'
import './App.css'

function App() {
  const [recording, setRecording] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      })

      recordedChunksRef.current = []
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: 'video/webm'
        })
        setVideoUrl(URL.createObjectURL(blob))
      }

      mediaRecorder.start()
      setRecording(true)
    } catch (err) {
      console.error('Error:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setRecording(false)
    }
  }

  return (
    <div className="app">
      <h1>Screen Recorder</h1>
      <div className="controls">
        {!recording ? (
          <button onClick={startRecording}>Start Recording</button>
        ) : (
          <button onClick={stopRecording}>Stop Recording</button>
        )}
      </div>
      {videoUrl && (
        <div className="video-container">
          <video src={videoUrl} controls />
          <a href={videoUrl} download="recording.webm">
            Download Recording
          </a>
        </div>
      )}
    </div>
  )
}

export default App
import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import styled from "@emotion/styled";

import Note from "./Note";
import { listNotes } from "../graphql/queries";
import { updateNote, deleteNote } from "../graphql/mutations";

/** @jsx jsx */

import { Predictions } from "aws-amplify";
import { keyframes, css, jsx } from "@emotion/core";
import {
  FaMicrophone,
  FaMicrophoneAlt,
  FaMicrophoneAltSlash
} from "react-icons/fa";
import mic from "microphone-stream";

import RecordingEditor from "./Recording-Editor";
import { createNote } from "../graphql/mutations";






export default props => {
  const [notes, setNotes] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [showRecordingEditor, setShowRecordingEditor] = useState(false);
  const [recordingText, setRecordingText] = useState("");
  const [isConverting, setIsConverting] = useState("");
  const [micStream, setMicStream] = useState();
  const [audioBuffer] = useState(
    (function() {
      let buffer = [];
      function add(raw) {
        buffer = buffer.concat(...raw);
        return buffer;
      }
      function newBuffer() {
        console.log("reseting buffer");
        buffer = [];
      }

      return {
        reset: function() {
          newBuffer();
        },
        addData: function(raw) {
          return add(raw);
        },
        getData: function() {
          return buffer;
        }
      };
    })()
  );

  const Container = styled("div")`
  max-width: 800px;
  margin: 16px auto;
  width: 100%;
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;
  
  const startRecording = async () => {
    const stream = await window.navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true
    });
    const startMic = new mic();

    startMic.setStream(stream);
    startMic.on("data", chunk => {
      var raw = mic.toRaw(chunk);
      if (raw == null) {
        return;
      }
      audioBuffer.addData(raw);
    });

    setMicStream(startMic);
    setIsRecording(true);
  };

  const stopRecording = async () => {
    micStream.stop();
    setIsRecording(false);
    setIsConverting(true);

    const buffer = audioBuffer.getData();
    const result = await Predictions.convert({
      transcription: {
        source: {
          bytes: buffer
        }
      }
    });

    setMicStream(null);
    audioBuffer.reset();
    setRecordingText(result.transcription.fullText);
    setIsConverting(false);
    setShowRecordingEditor(true);
  };

  useEffect(() => {
    const fetchNotes = async () => {
      const result = await API.graphql(graphqlOperation(listNotes));

      setNotes(
        result.data.listNotes.items.sort((a, b) => {
          if (a.updatedAt > b.updatedAt) return -1;
          else return 1;
        })
      );
    };

    fetchNotes();
  }, []);

  return (
    <Container>
      {notes.map(note => (
        <Note
          key={note.id}
          {...note}
          onSaveChanges={async values => {
            const result = await API.graphql(
              graphqlOperation(updateNote, {
                input: {
                  ...note,
                  ...values
                }
              })
            );

            setNotes(
              notes.map(n => {
                return n.id === note.id ? result.data.updateNote : n;
              })
            );
          }}
          onDelete={async () => {
            const result = await API.graphql(
              graphqlOperation(deleteNote, {
                input: {
                  id: note.id
                }
              })
            );

            setNotes(notes.filter(n => n.id !== note.id));
          }}
        />
      ))}

      <div
        css={css`
          position: relative;
          justify-content: center;
          align-items: center;
          width: 120px;
          height: 120px;
        `}
      >
        <div
          css={[
            css`
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              position: absolute;
              border-radius: 50%;
              background-color: #74b49b;
            `,
            isRecording || isConverting
              ? css`
                  animation: ${pulse} 1.5s ease infinite;
                `
              : {}
          ]}
        />
        <div
          css={css`
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            position: absolute;
            border-radius: 50%;
            background-color: #74b49b;
            display: flex;
            cursor: pointer;
          `}
          onClick={() => {
            if (!isRecording) {
              startRecording();
            } else {
              stopRecording();
            }
          }}
        >
          {isConverting ? (
            <FaMicrophoneAltSlash
              size={50}
              style={{ margin: "auto" }}
              color="#f4f9f4"
            />
          ) : isRecording ? (
            <FaMicrophone
              size={50}
              style={{ margin: "auto" }}
              color="#f4f9f4"
            />
          ) : (
            <FaMicrophoneAlt
              size={50}
              style={{ margin: "auto" }}
              color="#f4f9f4"
            />
          )}
        </div>
      </div>
      {showRecordingEditor && (
        <RecordingEditor
          text={recordingText}
          onDismiss={() => {
            setShowRecordingEditor(false);
          }}
          onSave={async data => {
            await API.graphql(graphqlOperation(createNote, { input: data }));
            props.setTabIndex(0);
          }}
        />
      )}
    </Container>
  );
};

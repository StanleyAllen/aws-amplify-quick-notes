import { useState } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { Predictions } from "aws-amplify";
import { keyframes, css } from "@emotion/core";
import styled from "@emotion/styled";
import {
  FaMicrophone,
  FaMicrophoneAlt,
  FaMicrophoneAltSlash
} from "react-icons/fa";
import mic from "microphone-stream";
import React from "react";

import { Button } from "@rebass/emotion";
import { Label, Input } from "@rebass/forms";
import { Formik } from "formik";

import Dialog from "./Dialog";
import RecordingEditor from "./Recording-Editor";
import { createNote } from "../graphql/mutations";

const Container = styled("div")`
  max-width: 800px;
  margin: 16px auto;
  width: 100%;
`;


const StyledButton = styled(Button)`
  background-color: #74b49b;
  cursor: pointer;
`;

const StyledLabel = styled(Label)`
  color: #74b49b;
  margin-bottom: 4px;
`;

const StyledInput = styled(Input)`
  color: #74b49b;
  border-radius: 3px;
  background-color: #f4f9f4;
`;

const StyledTextarea = styled("textarea")`
  color: #74b49b;
  background-color: #f4f9f4;
  width: 100%;
  min-height: 80px;
  border-radius: 3px;
  resize: vertical;
`;

const FormInputs = styled("div")`
  max-height: 450px;
  overflow: scroll;
  padding: 16px;

  @media (max-height: 570px) {
    max-height: 300px;
  }

  @media (max-height: 675px) {
    max-height: 350px;
  }
`;

const Actions = styled("div")`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 24px;
`;

const InputContainer = styled("div")`
  margin-bottom: 16px;
`;

const Title = styled("h2")`
  color: #74b49b;
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

const RecordComponent = props => {
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

  return (
    <Container>

      
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
      
    </Container>
  );
};

export default RecordComponent;

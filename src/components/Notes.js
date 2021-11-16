import React, { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import styled from "@emotion/styled";

import Note from "./Note";
import { listNotes } from "../graphql/queries";
import { updateNote, deleteNote } from "../graphql/mutations";

const Container = styled("div")`
  max-width: 800px;
  margin: 16px auto;
  width: 100%;
`;

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
    </Container>
  );
};



 

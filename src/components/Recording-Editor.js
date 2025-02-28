import React from "react";
import styled from "@emotion/styled";
import { Button } from "@rebass/emotion";
import { Label, Input } from "@rebass/forms";
import { Formik } from "formik";
import { SelectField } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';


import Dialog from "./Dialog";

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
  min-height: 570px;
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
  justify-content: flex-start;
  align-items: center;
  margin-top: 24px;
`;

const InputContainer = styled("div")`
  margin-top: 16px;
`;

const Title = styled("h2")`
  color: #74b49b;
`;




export default props => (
  <Dialog onDismiss={props.onDismiss}>
    <Title>{props.category ? "Edit Note" : "Create Note"}</Title>
    <Formik
      initialValues={{
        category: props.category,
        key01: props.key01,
        key02: props.key02,
        key03: props.key03,
        key04: props.key04,
        key05: props.key05,
        key06: props.key06,
        key07: props.key07,
        key08: props.key08,
        key09: props.key09,
        key10: props.key10,
        key11: props.key11,
        key12: props.key12,
        key13: props.key13,
        key14: props.key14,
        author: props.author,
        text: props.text

      }}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        props.onSave({
          category: props.category,
          key01: props.key01,
          key02: props.key02,
          key03: props.key03,
          key04: props.key04,
          key05: props.key05,
          key06: props.key06,
          key07: props.key07,
          key08: props.key08,
          key09: props.key09,
          key10: props.key10,
          key11: props.key11,
          key12: props.key12,
          key13: props.key13,
          key14: props.key14,
          author: props.author,
          text: props.text
        });
        setSubmitting(false);
        resetForm();
        props.onDismiss();
      }}
    >
      {({ values, handleSubmit, isSubmitting, handleChange }) => (
        <form onSubmit={handleSubmit}>
          <FormInputs>

            <InputContainer>
              <StyledLabel htmlFor="category">Category</StyledLabel>
              <StyledTextarea
                name="category"
                value={values.category}
                onChange={handleChange}
              />
            </InputContainer>      

            const [value, setValue] = useState('');
            <InputContainer>
              <SelectField
                label="Category"
                labelHidden={true}
                value={value}
                placeholder="Please select a Category"
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="subjective">Subjective</option>
                <option value="objective">Objective</option>
                <option value="assessment">Assessment</option>
                <option value="plan">Plan</option>
              </SelectField>;      
              </InputContainer>

            <InputContainer>
              <StyledLabel htmlFor="text">Note</StyledLabel>
              <StyledTextarea
                name="text"
                value={values.text}
                value = {values.key01[1] = 1}
                onChange={handleChange}
              />
            </InputContainer>

          </FormInputs>

          <Actions>
            <StyledButton
              onClick={() => {
                props.onDismiss();
              }}
              style={{ marginRight: "8px" }}
            >
              Cancel
            </StyledButton>
            <StyledButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save"}
            </StyledButton>
          </Actions>
        </form>
      )}
    </Formik>
  </Dialog>
);

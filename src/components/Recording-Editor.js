import React from "react";
import { render } from 'react-dom';
import styled from "@emotion/styled";
import { Button } from "@rebass/emotion";
import { Label, Input } from "@rebass/forms";
import { Formik } from "formik";
import * as Yup from 'yup';

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

const withFormik = Formik({
  mapPropsToValues: () => ({ color: '' }),
  validationSchema: Yup.object().shape({
    color: Yup.string().required('Color is required!'),
  }),
  handleSubmit: (values, { setSubmitting }) => {
    setTimeout(() => {
      alert(JSON.stringify(values, null, 2));
      setSubmitting(false);
    }, 1000);
  },
  displayName: 'BasicForm', // helps with React DevTools
});

const MyForm = props => {

  const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
    <label htmlFor="email" style={{ display: 'block' }}>
      Color
    </label>
    <select
      name="color"
      value={values.color}
      onChange={handleChange}
      onBlur={handleBlur}
      style={{ display: 'block' }}
    >
      <option value="" label="Select Category" />
      <option value="subjective" label="Subjective" />
      <option value="objective" label="Objective" />
      <option value="assessment" label="Assessment" />
      <option value="plan" label="Plan" />
    </select>
    {errors.color &&
      touched.color &&
      <div className="input-feedback">
        {errors.color}
      </div>}

    <DisplayFormikState {...props} />
    </form>
  );
};    

const BasicForm = withFormik(MyForm);




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

            <BasicForm />

            <InputContainer>
              <StyledLabel htmlFor="text">Note</StyledLabel>
              <StyledTextarea
                name="text"
                value={values.text}
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


import React, { Component } from 'react';
import Update from 'react-addons-update';
import WizardForm from './WizardForm.js';
import './Wizard.css';

const formContent = {
  "name": "wizard",
  "action": "/test.js",
  "method": "get",
  "pages": [
    {
      "fields": [
        {
          "label": "First Name",
          "dataType": "text",
          "isRequired": true,
          "errorMessage": "Please enter your first name."
        },
        {
          "label": "Last Name",
          "dataType": "text",
          "isRequired": false,
          "errorMessage": "Please enter your last name."
        },
        {
          "label": "Email",
          "dataType": "email",
          "isRequired": true,
          "errorMessage": "Please make sure your email is correct."
        }
      ]
    },
    {
      "fields": [
        {
          "label": "Phone",
          "dataType": "text",
          "isRequired": false,
          "errorMessage": "Please enter your phone number."
        }
      ]
    }
  ]
}

class Wizard extends Component {
  state = this.configToInitialState();

  // Create the initial state from the wizard configuration object

  configToInitialState() {
    let initialState = {
      isValid: false,
      currentPageIndex: 0,
      pages: []
    };

    formContent.pages.forEach((page, pageIndex) => {
      initialState.pages[pageIndex] = {
        isValid: false,
        fields: []
      };
      formContent.pages[pageIndex].fields.forEach((field, fieldIndex) => {
        const initialFieldState = field.isRequired ? null : true;
        initialState.pages[pageIndex].fields[fieldIndex] = {
          isValid: initialFieldState,
          value: ''
        }
      });
    });
    return initialState;
  }

  //********************
  // Handlers
  //********************

  handleInputBlur = (fieldIndex, pageIndex) => {
    const field = formContent.pages[pageIndex].fields[fieldIndex];
    if (field.isRequired) {
      this.updateFieldValidState(fieldIndex, pageIndex);
    }
  }

  handleInputChange = (fieldIndex, pageIndex, event) => {
    const value = event.target.value;
    this.updateValue(fieldIndex, pageIndex, value);
  }

  handleButtonClick = (pageIndex, action, event) => {
    if (action === 'next') {
      this.updatePageFieldsValidStates(pageIndex, 0);
      this.updatePageValidState(pageIndex);
    } else if (action === 'previous') {
      const previousPage = pageIndex - 1;
      this.updateCurrentPageState(previousPage);
    } else if (action === 'submit') {
      event.preventDefault();
      this.updatePageFieldsValidStates(pageIndex, 0);
      this.updatePageValidState(pageIndex);
      document.forms[formContent.name].submit();
    }
  }

  //********************
  // Validation
  //********************

  validateField(isRequired, dataType, value) {
    let isValid = false;
    if (isRequired) {
      isValid = this.isPopulated(value);
      if (dataType === 'email') {
        isValid = this.isValidEmail(value);
      }
    } else {
      isValid = true;
    }
    return isValid;
  }

  validateForm() {
    var formIsValid = true;
    this.state.pages.forEach((page, pageIndex) => {
      if(page.isValid) {
        return;
      } else {
        formIsValid = false;
        this.updateCurrentPageState(pageIndex);
      }
    });
    return(formIsValid);
  }

  isPopulated(value) {
    if (value.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  isValidEmail(email) {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
  }

  getPageValidState(pageIndex) {
    let isPageValid = true;
    this.state.pages[pageIndex].fields.forEach((input, fieldIndex) => {
      if(input.isValid === null) {
        isPageValid = false;
      } else if(input.isValid !== true) {
        isPageValid = false;
      }
    });
    return isPageValid;
  }

  //********************
  // State management
  //********************

  updateValue(fieldIndex, pageIndex, value) {
    const isRequired = formContent.pages[pageIndex].fields[fieldIndex].isRequired;
    const isValid = this.state.pages[pageIndex].fields[fieldIndex].isValid;
    const newState = Update(this.state, {
      pages: { [pageIndex]: { fields: { [fieldIndex]: { value: { $set: value }}}}}
    });
    this.setState(newState, () => {
      if (isValid !== null && isRequired) {
        this.updateFieldValidState(fieldIndex, pageIndex);
      }
    });
  }

  updateFieldValidState(fieldIndex, pageIndex) {
    const currentIsValidState = this.state.pages[pageIndex].fields[fieldIndex].isValid;
    const value = this.state.pages[pageIndex].fields[fieldIndex].value;
    const field = formContent.pages[pageIndex].fields[fieldIndex];
    const isValid = this.validateField(field.isRequired, field.dataType, value);
    const newState = Update(this.state, {
      pages: { [pageIndex]: { fields: { [fieldIndex]: { isValid: { $set: isValid }}}}}
    });
    this.setState(newState, () => {
      if (!isValid && currentIsValidState) {
        this.updatePageValidState(pageIndex);
      }
    });
  }

  updatePageFieldsValidStates(pageIndex, fieldIndex, newState = this.state.pages[pageIndex].fields) {
    const field = formContent.pages[pageIndex].fields[fieldIndex];
    const isValid = this.validateField(field.isRequired, field.dataType, newState[fieldIndex].value);
    newState[fieldIndex].isValid = isValid;
    if (fieldIndex < newState.length - 1) {
      this.updatePageFieldsValidStates(pageIndex, fieldIndex + 1, newState);
    } else {
      const newerState = Update(this.state, {
        pages: { [pageIndex]: { fields: { $set: newState}}}
      });
      this.setState(newerState);
    }
  }

  updatePageValidState(pageIndex) {
    const isValid = this.getPageValidState(pageIndex);
    const newState = Update(this.state, {
      pages: { [pageIndex]: { isValid: { $set: isValid }}}
    });
    this.setState(newState, () => {
      const finalPageIndex = this.state.pages.length - 1; 
      if(isValid && pageIndex < finalPageIndex) {
        const targetPage = pageIndex + 1;
        this.updateCurrentPageState(targetPage);
      } else {
        const formIsValid = this.validateForm();
        this.updateFormValidState(formIsValid);
      }
    });
  }

  updateCurrentPageState(targetPage) {
    const newValue = Update(this.state, {
      currentPageIndex: { $set: targetPage }
    });
    this.setState(newValue);
  }

  updateFormValidState(isValid) {
    const newValue = Update(this.state, {
      isValid: { $set: isValid }
    });
    this.setState(newValue);
  }

  //********************
  // Render
  //********************

  render() {
    return(
      <div className="wizard">
        <WizardForm
          formState={ this.state.pages }
          formContent={ formContent }
          currentPageIndex={ this.state.currentPageIndex }
          handleInputBlur={ this.handleInputBlur }
          handleInputChange={ this.handleInputChange }
          handleButtonClick={ this.handleButtonClick } />
      </div>
    );
  }
}

export default Wizard;

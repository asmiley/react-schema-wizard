import React from 'react';

const WizardFieldGroup = ({ field, fieldState, fieldIndex, pageIndex, handleInputBlur, handleInputChange }) => {
  const inputId = `wizard__field--${field.label.split(' ').join('').toLowerCase()}`;

  const fieldGroupClass = () => {
    if(fieldState.isValid === false) {
      return "wizard__field-group wizard__field-group--has-error";
    } else {
      return "wizard__field-group";
    }
  }

  if(fieldState.isValid === false) {
    var errorMessageElement = <span className="wizard__error-message">{ field.errorMessage }</span>;
  }

  return(
    <div className={ fieldGroupClass() }>
      <label htmlFor={ inputId }>{ field.label }</label>
      <input
        id={ inputId }
        className="wizard__input"
        type={ field.dataType }
        value={ fieldState.value }
        onBlur={ event => handleInputBlur(fieldIndex, pageIndex) }
        onChange={ event => handleInputChange(fieldIndex, pageIndex, event) }
        />
      { errorMessageElement }
    </div>
  );
}

export default WizardFieldGroup;
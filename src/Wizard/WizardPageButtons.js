import React from 'react';

const WizardPageButtons = ({ pageIndex, formLength, handlePreviousClick, handleButtonClick }) => {

  if(pageIndex === formLength - 1) {
    var submitButton = <button className="wizard__button wizard__button--submit" type="button" onClick={ event => handleButtonClick(pageIndex, 'submit', event) }>Submit</button>;
  }

  if(pageIndex < formLength - 1) {
    var nextButton = <button className="wizard__button wizard__button--next" type="button" onClick={ () => handleButtonClick(pageIndex, 'next') }>Next</button>;
  }

  if(pageIndex > 0) {
    var previousButton = <a className="wizard__button wizard__button--previous" onClick={ () => handleButtonClick(pageIndex, 'previous') }>Previous</a>;
  }

  return(
    <div className="wizard__button-group">
      { submitButton }
      { nextButton }
      { previousButton }
    </div>
  );
}

export default WizardPageButtons;
import React from 'react';
import FieldGroup from './WizardFieldGroup.js';
import WizardPageButtons from './WizardPageButtons.js';

const WizardPage = ({ page, pageState, pageIndex, currentPageIndex, formLength, handleInputBlur, handleInputChange, handleButtonClick }) => {

  const pageClass = () => {
    if(pageIndex === currentPageIndex) {
      return "wizard__page wizard__page--visible";
    } else {
      return "wizard__page wizard__page--hidden";
    }
  }

  const fieldGroupList = page.fields.map((field, fieldIndex) => {
    return (
      <FieldGroup
        key={ `${pageIndex}${fieldIndex}` }
        pageIndex={ pageIndex }
        fieldIndex={ fieldIndex }
        field={ field }
        handleInputBlur={ handleInputBlur }
        handleInputChange={ handleInputChange }
        fieldState={ pageState.fields[fieldIndex] }
        />
    );
  });

  return(
    <div className={ pageClass() }>
      { fieldGroupList }
      <WizardPageButtons
        pageIndex={ pageIndex }
        formLength={ formLength }
        handleButtonClick={ handleButtonClick }
        />
    </div>
  );
}

export default WizardPage;
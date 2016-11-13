import React from 'react';
import WizardPage from './WizardPage.js';

const WizardForm = ({ formState, formContent, currentPageIndex, handleInputBlur, handleInputChange, handleButtonClick }) => {

  const pageList = formContent.pages.map((page, pageIndex) => {
    return (
      <WizardPage
        key={ pageIndex }
        page={ page }
        pageState={ formState[pageIndex] }
        pageIndex={ pageIndex }
        formLength={ formContent.pages.length }
        currentPageIndex={ currentPageIndex }
        handleInputBlur={ handleInputBlur }
        handleInputChange={ handleInputChange }
        handleButtonClick={ handleButtonClick }
        />
    );
  });

  return (
    <form autoComplete="off" novalidate="true" action={ formContent.action } method={ formContent.method } name={ formContent.name }>
      { pageList }
    </form>
  );
}


export default WizardForm;
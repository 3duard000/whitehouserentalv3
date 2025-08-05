/**
 * WHITE HOUSE TENANT MANAGEMENT SYSTEM
 * Form Manager - FormManager.gs
 * 
 * This module handles all Google Forms creation and linking to spreadsheet.
 */

const FormManager = {

  /**
   * Create all Google Forms and link them to the spreadsheet
   */
  createGoogleForms() {
    console.log('Creating Google Forms...');
    
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      
      // Create Tenant Application Form
      const applicationForm = this._createTenantApplicationForm();
      applicationForm.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
      console.log(`✅ Tenant Application Form created and linked: ${applicationForm.getPublishedUrl()}`);
      
      // Create Move-Out Request Form
      const moveOutForm = this._createMoveOutRequestForm();
      moveOutForm.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
      console.log(`✅ Move-Out Request Form created and linked: ${moveOutForm.getPublishedUrl()}`);
      
      // Create Guest Check-In Form
      const guestCheckInForm = this._createGuestCheckInForm();
      guestCheckInForm.setDestination(FormApp.DestinationType.SPREADSHEET, spreadsheet.getId());
      console.log(`✅ Guest Check-In Form created and linked: ${guestCheckInForm.getPublishedUrl()}`);
      
      // Store form URLs in the spreadsheet for easy access
      this._storeFormUrls(
        applicationForm.getPublishedUrl(), 
        moveOutForm.getPublishedUrl(), 
        guestCheckInForm.getPublishedUrl()
      );
      
    } catch (error) {
      console.error('Error creating forms:', error);
      throw new Error('Failed to create Google Forms: ' + error.message);
    }
  },

  /**
   * Create the Tenant Application Google Form
   * @private
   */
  _createTenantApplicationForm() {
    const form = FormApp.create(`🏠 ${EMAIL_CONFIG.PROPERTY_NAME} - Tenant Application`);
    
    // Basic form settings
    form.setDescription(`Thank you for your interest in ${EMAIL_CONFIG.PROPERTY_NAME}! Please complete this application form to apply for a room.`);
    
    // Add questions - ONLY short text and paragraph fields
    form.addTextItem().setTitle('Full Name').setRequired(true);
    form.addTextItem().setTitle('Email Address').setRequired(true);
    form.addTextItem().setTitle('Phone Number').setRequired(true);
    form.addParagraphTextItem().setTitle('Current Address').setRequired(true);
    form.addTextItem().setTitle('Desired Move-in Date').setRequired(true);
    form.addTextItem().setTitle('Preferred Room').setRequired(false);
    form.addTextItem().setTitle('Employment Status').setRequired(true);
    form.addTextItem().setTitle('Employer/School Name').setRequired(true);
    form.addTextItem().setTitle('Monthly Income').setRequired(true);
    form.addParagraphTextItem().setTitle('Reference 1 (Required)').setRequired(true);
    form.addParagraphTextItem().setTitle('Reference 2 (Optional)').setRequired(false);
    form.addParagraphTextItem().setTitle('Emergency Contact Information').setRequired(true);
    form.addParagraphTextItem().setTitle('Tell us about yourself').setRequired(true);
    form.addParagraphTextItem().setTitle('Special Needs or Requests').setRequired(false);
    form.addTextItem().setTitle('Proof of Income').setRequired(true);
    form.addTextItem().setTitle('Application Agreement').setRequired(true);
    
    return form;
  },

  /**
   * Create the Move-Out Request Google Form
   * @private
   */
  _createMoveOutRequestForm() {
    const form = FormApp.create(`🏠 ${EMAIL_CONFIG.PROPERTY_NAME} - Move-Out Request`);
    
    // Basic form settings
    form.setDescription('We\'re sorry to see you go! Please complete this form to process your move-out request.');
    
    // Add questions - ONLY short text and paragraph fields
    form.addTextItem().setTitle('Tenant Name').setRequired(true);
    form.addTextItem().setTitle('Email Address').setRequired(true);
    form.addTextItem().setTitle('Phone Number').setRequired(true);
    form.addTextItem().setTitle('Room Number').setRequired(true);
    form.addTextItem().setTitle('Planned Move-Out Date').setRequired(true);
    form.addParagraphTextItem().setTitle('Forwarding Address').setRequired(true);
    form.addTextItem().setTitle('Primary Reason for Moving').setRequired(true);
    form.addParagraphTextItem().setTitle('Additional Details').setRequired(false);
    form.addTextItem().setTitle('Overall Satisfaction').setRequired(true);
    form.addParagraphTextItem().setTitle('What did you like most about living here?').setRequired(false);
    form.addParagraphTextItem().setTitle('What could we improve?').setRequired(false);
    form.addTextItem().setTitle('Would you recommend us to others?').setRequired(true);
    
    return form;
  },

  /**
   * Create the Guest Check-In Google Form
   * @private
   */
  _createGuestCheckInForm() {
    const form = FormApp.create(`🏠 ${EMAIL_CONFIG.PROPERTY_NAME} - Guest Check-In`);
    
    // Basic form settings
    form.setDescription(`Welcome to ${EMAIL_CONFIG.PROPERTY_NAME}! Please complete this check-in form.`);
    
    // Add questions in exact order - ONLY short text and paragraph fields
    form.addTextItem().setTitle('Guest Name').setRequired(true);
    form.addTextItem().setTitle('Email').setRequired(true);
    form.addTextItem().setTitle('Phone').setRequired(true);
    form.addTextItem().setTitle('Room Number').setRequired(true);
    form.addTextItem().setTitle('Check-In Date').setRequired(true);
    form.addTextItem().setTitle('Number of Nights').setRequired(true);
    form.addTextItem().setTitle('Number of Guests').setRequired(true);
    form.addParagraphTextItem().setTitle('Purpose of Visit').setRequired(true);
    form.addParagraphTextItem().setTitle('Special Requests').setRequired(false);
    
    return form;
  },

  /**
   * Store form URLs in the spreadsheet for easy access
   * @private
   */
  _storeFormUrls(applicationUrl, moveOutUrl, guestCheckInUrl) {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    
    // Create or get Form URLs sheet
    let urlSheet = spreadsheet.getSheetByName('Form URLs');
    if (!urlSheet) {
      urlSheet = spreadsheet.insertSheet('Form URLs');
      
      // Set headers and URLs
      urlSheet.getRange('A1').setValue('Form Name');
      urlSheet.getRange('B1').setValue('URL');
      urlSheet.getRange('A2').setValue('🏠 Tenant Application');
      urlSheet.getRange('B2').setValue(applicationUrl);
      urlSheet.getRange('A3').setValue('🏠 Move-Out Request');
      urlSheet.getRange('B3').setValue(moveOutUrl);
      urlSheet.getRange('A4').setValue('🏠 Guest Check-In');
      urlSheet.getRange('B4').setValue(guestCheckInUrl);
      
      // Format headers
      urlSheet.getRange('A1:B1').setBackground(COLORS.HEADER_BLUE).setFontColor('white').setFontWeight('bold');
      urlSheet.setColumnWidth(1, 200);
      urlSheet.setColumnWidth(2, 500);
    }
    
    console.log('Form URLs stored in "Form URLs" sheet');
  }
};

/**
 * WHITE HOUSE TENANT MANAGEMENT SYSTEM
 * Main Entry Point - Main.gs
 * 
 * This is the main entry point for the White House property management system.
 * It coordinates all the different modules and provides the main setup function.
 */

/**
 * Create custom menu when spreadsheet opens
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('🏠 White House Manager')
    .addItem('⚙️ Initialize System', 'setupTenantManagement')
    .addSeparator()
    .addSubMenu(ui.createMenu('📊 Dashboards')
      .addItem('🏠 Management Dashboard', 'createManagementDashboard')
      .addItem('💰 Financial Dashboard', 'createFinancialDashboard')
      .addSeparator()
      .addItem('🔄 Refresh All Dashboards', 'refreshAllDashboards'))
    .addSubMenu(ui.createMenu('📧 Tenant Management')
      .addItem('💸 Rent Reminders', 'sendRentReminders')
      .addItem('⚠️ Late Payment Alerts', 'sendLatePaymentAlerts')
      .addItem('📋 Monthly Invoices', 'sendMonthlyInvoices'))
    .addToUi();
}

/**
 * Main setup function - run this first to initialize everything
 */
function setupTenantManagement() {
  try {
    console.log('Setting up Tenant Management System...');
    
    // Create sheets with headers and formatting
    SheetManager.createRequiredSheets();
    
    // Add sample data to demonstrate the system
    DataManager.addSampleData();
    
    // Create and link Google Forms
    FormManager.createGoogleForms();
    
    // Set up automated email triggers
    TriggerManager.setupTriggers();
    
    // Create initial dashboards
    Dashboard.createManagementDashboard();
    Dashboard.createFinancialDashboard();
    
    console.log('Setup completed successfully!');
    return 'Tenant Management System setup completed successfully! Dashboards created and will auto-refresh 3x daily. Check the execution log for form URLs.';
  } catch (error) {
    console.error('Setup failed:', error);
    throw new Error('Setup failed: ' + error.message);
  }
}
/**
 * Daily check function that runs the appropriate email functions based on the date
 * This is triggered automatically by the system
 * 
 * NEW EMAIL SCHEDULE:
 * - Due date: 1st of each month
 * - Reminder: One week before (25th of previous month)
 * - Late notices: Day after due date (2nd) and every week until paid
 */
function checkAndRunDailyTasks() {
  const today = new Date();
  const dayOfMonth = today.getDate();
  const currentHour = today.getHours();
  
  console.log(`Daily check running - Day: ${dayOfMonth}, Hour: ${currentHour}`);
  
  // Only run email functions at 9 AM to avoid multiple executions
  if (currentHour === 9) {
    
    // Send rent reminders one week before due date (25th of each month)
    if (dayOfMonth === 25) {
      console.log('Running rent reminders (one week before due date)...');
      EmailManager.sendRentReminders();
    }
    
    // Send monthly invoices on the 1st (due date)
    if (dayOfMonth === 1) {
      console.log('Running monthly invoices (due date)...');
      EmailManager.sendMonthlyInvoices();
    }
    
    // Send late payment alerts starting the day after due date (2nd) and every week
    if (dayOfMonth === 2 || dayOfMonth === 9 || dayOfMonth === 16 || dayOfMonth === 23) {
      console.log(`Running late payment alerts (day ${dayOfMonth})...`);
      EmailManager.sendLatePaymentAlerts();
    }
  }
}

/**
 * Wrapper functions for manual email sending (called from menu)
 */
function sendRentReminders() {
  return EmailManager.sendRentReminders();
}

function sendLatePaymentAlerts() {
  return EmailManager.sendLatePaymentAlerts();
}

function sendMonthlyInvoices() {
  return EmailManager.sendMonthlyInvoices();
}

/**
 * Dashboard wrapper functions (called from menu)
 */
function createManagementDashboard() {
  return Dashboard.createManagementDashboard();
}

function createFinancialDashboard() {
  return Dashboard.createFinancialDashboard();
}

function refreshAllDashboards() {
  return Dashboard.refreshAllDashboards();
}

/**
 * Utility functions for testing and debugging
 */
function testRentReminder() {
  return EmailManager.testRentReminder();
}

function getTriggerInfo() {
  return TriggerManager.getTriggerInfo();
}

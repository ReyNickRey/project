import emailjs from 'emailjs-com';

// Replace these values with your actual EmailJS credentials and template details
const SERVICE_ID = 'service_qie1dmr';
const TEMPLATE_ID = 'template_cz6l2ch';
const USER_ID = 'OyPeOK4GgHuf5EH6G';

export const sendEmailToUsers = (toEmails: string[], eventTitle: string, eventId: string) => {
  const templateParams = {
    // Pass a comma-separated list of emails if your template expects that,
    // or change as needed per your EmailJS template
    to_emails: toEmails.join(','),
    event_title: eventTitle,
    // Create an event URL so users can click through
    event_url: `${window.location.origin}/event/${eventId}`,
  };

  return emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, USER_ID);
};
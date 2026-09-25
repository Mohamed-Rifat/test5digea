import type { Translation } from "../types";

const contact: Translation["contact"] = {
  eyebrow: "We'd Love To Hear From You",
  titlePrefix: "Let's Start a",
  titleHighlight: "Conversation",
  intro:
    "Have a question, need some help, or simply want to learn more about 5digea? We're here and happy to help.",
  email: {
    label: "Email",
    text: "Send us an email and our team will get back to you.",
  },
  phone: {
    label: "Phone",
    text: "Prefer a conversation? We're happy to hear from you.",
  },
  availability: {
    label: "Availability",
    days: "Saturday — Thursday",
    hours: "10:00 AM — 6:00 PM",
  },
  form: {
    eyebrow: "Send a Message",
    title: "How can we help?",
    name: "Your Name",
    namePlaceholder: "Mohamed Refaat",
    email: "Email Address",
    subject: "Subject",
    subjectPlaceholder: "How can we help?",
    message: "Message",
    messagePlaceholder: "Tell us a little about what you need...",
    submit: "Send Message",
    errorName: "Please enter your name.",
    errorEmail: "Please enter a valid email address.",
    errorMessage: "Please write a message (at least 10 characters).",
    opened: "Your email app opened with the message ready — just press send.",
    sending: "Opening...",
  },
  footerNote: "Making Every Connection Meaningful",
};

export default contact;

import type { Translation } from "../types";

const support: Translation["support"] = {
  eyebrow: "Support Center",
  title: "How can we help you?",
  intro:
    "Get the support you need, whether you're a customer, vendor, or administrator. Our team is here to assist you.",
  user: {
    guestName: "Guest",
    guestRole: "Guest",
    guestDescription: "👋 Welcome",
    adminName: "Admin",
    adminRole: "Administrator",
    adminDescription: "👑 Admin",
    vendorName: "Vendor",
    vendorRole: "Vendor Partner",
    vendorDescription: "🏪 Vendor",
    customerName: "User",
    customerRole: "Customer",
    customerDescription: "👤 Customer",
  },
  roleLabel: {
    guest: "Guest",
    admin: "Admin",
    vendor: "Vendor",
    user: "User",
  },
  searchPlaceholder: "Search for help, guides, or topics...",
  clearSearch: "Clear search",
  quickActions: {
    title: "Quick Actions",
    reviewReports: "Review Reports",
    adminDashboard: "Admin Dashboard",
    systemStatus: "System Status",
    supportTickets: "Support Tickets",
    myServices: "My Services",
    submitTicket: "Submit Ticket",
    viewFaq: "View FAQ",
    myAccount: "My Account",
  },
  resources: {
    title: "Support Resources",
    docs: {
      title: "Documentation",
      description: "Browse our detailed guides and tutorials",
    },
    chat: {
      title: "Live Chat",
      description: "Chat with our support team in real-time",
    },
    email: {
      title: "Email Support",
      description: "Send us an email and we'll get back to you",
    },
    faq: {
      title: "FAQ",
      description: "Frequently asked questions",
    },
    ticket: {
      title: "Submit Ticket",
      description: "Open a support ticket for complex issues",
    },
    phone: {
      title: "Phone Support",
      description: "Call us during business hours",
    },
    badgeAvailable: "Available",
    badgeNew: "New",
    online: "🟢 Online",
    callNow: "📞 Call now",
    learnMore: "Learn more",
  },
  noResults: {
    title: "No results found",
    text: "Try searching for a different topic or browse all support resources.",
    clear: "Clear search",
  },
  hours: {
    title: "Support Hours",
    weekdays: "Monday - Friday",
    weekdayTime: "9:00 AM - 6:00 PM",
    weekend: "Saturday - Sunday",
    closed: "Closed",
    responseTime: "Average response time",
    responseValue: "< 2 hours",
  },
  info: {
    title: "Quick Info",
    adminPrivileges: "You have {bold} privileges",
    adminBold: "Admin",
    vendor: "Vendor {bold}",
    vendorFallback: "Partner",
    priority: "{bold} available",
    priorityBold: "Priority Support",
    welcomeBack: "Welcome back, {bold}",
    standardSupport: "Standard support available",
    guestBrowsing: "You are browsing as a {bold}",
    guestBold: "Guest",
    publicResources: "Public support resources are available",
  },
  contact: {
    text: "💡 Need immediate assistance? Contact us directly:",
  },
};

export default support;

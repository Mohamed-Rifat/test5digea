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
  faq: {
    title: "Frequently asked questions",
    subtitle: "Quick answers about planning your wedding with 5Digea.",
    items: {
      q1: {
        q: "What is 5Digea?",
        a: "5Digea is an Egyptian wedding-planning platform that helps couples discover, compare and save trusted wedding vendors and services — venues, photographers, makeup artists, bridal dresses, decoration, cars and more — and follow a personal wedding roadmap in one place.",
      },
      q2: {
        q: "Is 5Digea free for couples?",
        a: "Yes. Creating an account, browsing vendors and services, saving favorites, comparing options and using the wedding roadmap are all free for couples.",
      },
      q3: {
        q: "How do I choose the right vendor?",
        a: "Filter services by category, price and rating, open each vendor's profile to see photos, packages and verified reviews, then add up to several services to the comparison page to compare prices and features side by side.",
      },
      q4: {
        q: "What is the wedding roadmap?",
        a: "The roadmap is a personal planning checklist. Add your partner's name and wedding date, see a countdown to the big day, and track every category from “not started” to “vendor selected” to “completed”.",
      },
      q5: {
        q: "Are the reviews real?",
        a: "Reviews can only be written by signed-in couples for services linked to their roadmap, and every review is checked by our moderation team before it is published.",
      },
      q6: {
        q: "How can I list my business as a vendor?",
        a: "Open the “Become a vendor” page, create a vendor account and complete your business profile. Our team reviews every vendor and service before it appears to couples.",
      },
      q7: {
        q: "How does vendor approval work?",
        a: "Our moderation team reviews new vendor profiles and services as quickly as possible, and you receive a notification as soon as a decision is made. You can follow the status from your vendor dashboard.",
      },
      q8: {
        q: "How do I contact 5Digea support?",
        a: "Use the contact form on the Contact page, email hello@5digea.com or call +20 122 280 0121. We reply in Arabic and English.",
      },
    },
  },
};

export default support;

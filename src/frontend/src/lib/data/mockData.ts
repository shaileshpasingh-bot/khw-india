/**
 * Domain types and realistic seed data for the KHW-India nonprofit site.
 *
 * This module is the single source of truth for entity shapes. The DataProvider
 * (store.tsx) seeds from here and persists user changes to localStorage.
 */

export interface Program {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  icon: string;
  impact: string;
  beneficiaries: number;
  status: "active" | "paused";
}

export interface ImpactStory {
  id: string;
  name: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  featured: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

export interface VolunteerRole {
  id: string;
  title: string;
  description: string;
  commitment: string;
  location: string;
  open: boolean;
}

export interface VolunteerApplication {
  id: string;
  roleId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  capacity: number;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  name: string;
  email: string;
  date: string;
}

export interface Partner {
  id: string;
  name: string;
  description: string;
  website: string;
  tier: "platinum" | "gold" | "silver";
}

export interface FinancialReport {
  id: string;
  year: number;
  title: string;
  totalIncome: number;
  totalExpense: number;
  published: boolean;
}

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  frequency: "one-time" | "monthly";
  programId: string;
  message: string;
  date: string;
  status: "completed" | "pending";
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "new" | "read" | "replied";
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  date: string;
  active: boolean;
}

export interface VisitorSession {
  id: string;
  startTime: string;
  endTime: string;
  durationSec: number;
  pageViews: number;
  pages: string[];
  source: string;
  device: string;
  longVisit: boolean;
}

export interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning";
  date: string;
  read: boolean;
}

/**
 * A single editable piece of page copy. `key` is a stable identifier used to
 * look the value up on the public site; `label` is the human-readable name
 * shown in the admin editor. Values are stored per-language so the site can
 * reflect edits live in both English and Hindi.
 */
export interface PageContent {
  id: string;
  key: string;
  label: string;
  valueEn: string;
  valueHi: string;
}

export interface DataState {
  programs: Program[];
  stories: ImpactStory[];
  testimonials: Testimonial[];
  volunteerRoles: VolunteerRole[];
  volunteerApplications: VolunteerApplication[];
  events: EventItem[];
  eventRegistrations: EventRegistration[];
  partners: Partner[];
  financialReports: FinancialReport[];
  donations: Donation[];
  contactSubmissions: ContactSubmission[];
  newsletterSubscribers: NewsletterSubscriber[];
  sessions: VisitorSession[];
  notifications: Notification[];
  pageContent: PageContent[];
}

export const seedData: DataState = {
  programs: [
    {
      id: "education",
      title: "Education for Every Child",
      titleHi: "हर बच्चे के लिए शिक्षा",
      description:
        "We keep children in school with learning support, scholarships, and after-school programs that close the opportunity gap.",
      descriptionHi:
        "हम सीखने के सहारे, छात्रवृत्ति और स्कूल के बाद के कार्यक्रमों से बच्चों को स्कूल में बनाए रखते हैं।",
      icon: "BookOpen",
      impact: "1,200+ children supported in school",
      beneficiaries: 1200,
      status: "active",
    },
    {
      id: "health",
      title: "Health & Nutrition",
      titleHi: "स्वास्थ्य और पोषण",
      description:
        "Regular health camps, nutritious meals, and immunization drives keep children healthy and ready to learn.",
      descriptionHi:
        "नियमित स्वास्थ्य शिविर, पौष्टिक भोजन और टीकाकरण अभियान बच्चों को स्वस्थ और सीखने के लिए तैयार रखते हैं।",
      icon: "HeartPulse",
      impact: "8,500+ health check-ups completed",
      beneficiaries: 8500,
      status: "active",
    },
    {
      id: "protection",
      title: "Child Protection",
      titleHi: "बाल संरक्षण",
      description:
        "Safe spaces, counselling, and legal aid protect children from harm and help them recover and thrive.",
      descriptionHi:
        "सुरक्षित स्थान, परामर्श और कानूनी सहायता बच्चों को नुकसान से बचाती है और उन्हें आगे बढ़ने में मदद करती है।",
      icon: "ShieldCheck",
      impact: "640+ children reached with protection services",
      beneficiaries: 640,
      status: "active",
    },
    {
      id: "livelihood",
      title: "Family Livelihoods",
      titleHi: "परिवार की आजीविका",
      description:
        "Skills training and micro-grants help families build stable incomes so children can stay in school.",
      descriptionHi:
        "कौशल प्रशिक्षण और लघु अनुदान परिवारों को स्थिर आय बनाने में मदद करते हैं ताकि बच्चे स्कूल में बने रहें।",
      icon: "Sprout",
      impact: "380+ families supported",
      beneficiaries: 380,
      status: "active",
    },
  ],
  stories: [
    {
      id: "asha",
      name: "Asha",
      title: "From the margins to the classroom",
      excerpt:
        "After losing her father, Asha was at risk of dropping out. Today she is a confident student and class monitor.",
      content:
        "Asha, 12, lives with her mother in a small village in Rajasthan. When her father passed away, the family struggled, and Asha nearly left school to help at home. Our education team stepped in with a scholarship, school supplies, and regular mentoring. Today Asha is a class monitor, loves mathematics, and dreams of becoming a teacher.",
      category: "Education",
      date: "2026-08-14",
      featured: true,
    },
    {
      id: "rahul",
      name: "Rahul",
      title: "A healthy start changes everything",
      excerpt:
        "Malnutrition had stunted Rahul's growth. A year of nutrition support turned his health around.",
      content:
        "When Rahul, 6, joined our health program he was severely underweight. Through regular nutritious meals, health check-ups, and family counselling, Rahul gained strength and energy. He now attends school regularly and his mother says he 'runs and plays like any other child.'",
      category: "Health",
      date: "2026-07-02",
      featured: true,
    },
    {
      id: "meera",
      name: "Meera",
      title: "Finding her voice again",
      excerpt:
        "After a difficult period, Meera found safety and confidence through our child protection counselling.",
      content:
        "Meera, 14, came to us withdrawn and anxious. Through our safe space and counselling sessions, she slowly began to trust and open up. She joined our art therapy group and discovered a talent for painting. Meera now mentors younger children and says the program 'gave me back my smile.'",
      category: "Protection",
      date: "2026-06-18",
      featured: false,
    },
  ],
  testimonials: [
    {
      id: "t1",
      name: "Sunita Devi",
      role: "Mother of a program child",
      quote:
        "KHW-India didn't just help my daughter with school fees — they gave her confidence. She believes in herself now.",
      rating: 5,
    },
    {
      id: "t2",
      name: "Ramesh Kumar",
      role: "Village volunteer",
      quote:
        "The health camps have transformed our community. Children who were always sick are now healthy and attending school.",
      rating: 5,
    },
    {
      id: "t3",
      name: "Dr. Anita Rao",
      role: "Partner pediatrician",
      quote:
        "Their commitment to child protection is genuine and professional. I'm proud to support their work.",
      rating: 5,
    },
  ],
  volunteerRoles: [
    {
      id: "tutor",
      title: "After-school Tutor",
      description:
        "Help children with homework and learning activities in our community learning centres.",
      commitment: "4 hours / week",
      location: "Delhi & Jaipur",
      open: true,
    },
    {
      id: "health-camp",
      title: "Health Camp Coordinator",
      description:
        "Support the logistics and running of community health and nutrition camps.",
      commitment: "Weekends",
      location: "Rajasthan",
      open: true,
    },
    {
      id: "mentor",
      title: "Youth Mentor",
      description:
        "Guide and encourage young people in our child protection and life-skills programs.",
      commitment: "2 hours / week",
      location: "Remote",
      open: true,
    },
    {
      id: "fundraiser",
      title: "Fundraising Volunteer",
      description:
        "Help organise events and campaigns that raise vital funds for our programs.",
      commitment: "Flexible",
      location: "Remote",
      open: false,
    },
  ],
  volunteerApplications: [
    {
      id: "va1",
      roleId: "tutor",
      name: "Priya Sharma",
      email: "priya@example.com",
      phone: "+91 90000 00001",
      message:
        "I am a teacher and would love to help with after-school tutoring.",
      status: "pending",
      date: "2026-09-01",
    },
  ],
  events: [
    {
      id: "e1",
      title: "Annual Fundraising Gala",
      description:
        "An evening of stories, music, and giving to support our education programs.",
      date: "2026-11-20",
      time: "6:00 PM",
      location: "New Delhi",
      category: "Fundraiser",
      capacity: 200,
    },
    {
      id: "e2",
      title: "Community Health Camp",
      description:
        "Free health check-ups, nutrition counselling, and immunizations for children.",
      date: "2026-10-05",
      time: "9:00 AM",
      location: "Jaipur",
      category: "Health",
      capacity: 300,
    },
    {
      id: "e3",
      title: "Volunteer Orientation",
      description:
        "Learn about our programs and how you can get involved as a volunteer.",
      date: "2026-09-25",
      time: "11:00 AM",
      location: "Online",
      category: "Volunteer",
      capacity: 100,
    },
  ],
  eventRegistrations: [
    {
      id: "er1",
      eventId: "e3",
      name: "Amit Verma",
      email: "amit@example.com",
      date: "2026-09-08",
    },
  ],
  partners: [
    {
      id: "p1",
      name: "Sunrise Foundation",
      description: "Long-term supporter of our education programs.",
      website: "https://example.com",
      tier: "platinum",
    },
    {
      id: "p2",
      name: "GreenLeaf Trust",
      description: "Funds our health and nutrition camps.",
      website: "https://example.com",
      tier: "gold",
    },
    {
      id: "p3",
      name: "City Hospital",
      description: "Provides medical staff and equipment for health camps.",
      website: "https://example.com",
      tier: "gold",
    },
    {
      id: "p4",
      name: "Bright Books",
      description: "Donates books and learning materials.",
      website: "https://example.com",
      tier: "silver",
    },
  ],
  financialReports: [
    {
      id: "fr1",
      year: 2025,
      title: "Annual Report 2025",
      totalIncome: 4200000,
      totalExpense: 3980000,
      published: true,
    },
    {
      id: "fr2",
      year: 2024,
      title: "Annual Report 2024",
      totalIncome: 3850000,
      totalExpense: 3610000,
      published: true,
    },
  ],
  donations: [
    {
      id: "d1",
      name: "Anonymous",
      email: "donor@example.com",
      amount: 5000,
      frequency: "one-time",
      programId: "education",
      message: "Keep up the great work!",
      date: "2026-09-05",
      status: "completed",
    },
    {
      id: "d2",
      name: "Rohan Gupta",
      email: "rohan@example.com",
      amount: 1000,
      frequency: "monthly",
      programId: "health",
      message: "",
      date: "2026-09-02",
      status: "completed",
    },
  ],
  contactSubmissions: [
    {
      id: "c1",
      name: "Neha Singh",
      email: "neha@example.com",
      subject: "Partnership inquiry",
      message:
        "We would like to explore a corporate partnership with KHW-India.",
      date: "2026-09-06",
      status: "new",
    },
  ],
  newsletterSubscribers: [
    {
      id: "n1",
      email: "subscriber@example.com",
      date: "2026-08-20",
      active: true,
    },
  ],
  sessions: [],
  notifications: [
    {
      id: "notif1",
      message: "Welcome to the KHW-India admin dashboard.",
      type: "info",
      date: "2026-09-10",
      read: false,
    },
  ],
  pageContent: [
    {
      id: "pc-hero-title",
      key: "hero.title",
      label: "Hero headline",
      valueEn: "Every child deserves a safe, bright future",
      valueHi: "हर बच्चा सुरक्षित और उज्ज्वल भविष्य का हकदार है",
    },
    {
      id: "pc-hero-subtitle",
      key: "hero.subtitle",
      label: "Hero subtitle",
      valueEn:
        "Kinderhilfswerk Society (KHW-India) protects children and strengthens communities through education, health, and child protection programs across India.",
      valueHi:
        "किंडरहिल्फ्सवेर्क सोसाइटी (KHW-India) भारत भर में शिक्षा, स्वास्थ्य और बाल संरक्षण कार्यक्रमों के माध्यम से बच्चों की रक्षा करती है और समुदायों को सशक्त बनाती है।",
    },
    {
      id: "pc-mission",
      key: "about.mission",
      label: "Mission statement",
      valueEn:
        "The purpose of KHW-India is to engage in Appropriate, Sustainable, Child-Sensitive Social Action to empower children and their communities towards developing their full potential.",
      valueHi:
        "KHW-India का उद्देश्य बच्चों और उनके समुदायों को उनकी पूरी क्षमता विकसित करने की दिशा में सशक्त बनाने के लिए उचित, टिकाऊ और बाल-संवेदनशील सामाजिक कार्रवाई में संलग्न होना है।",
    },
  ],
};

/**
 * Global UI dictionary for KHW-India.
 *
 * English is the primary language; Hindi is provided for key global strings.
 * To add a new language, add a key to `Language` and a matching dictionary
 * object here, then register it in `LanguageProvider`.
 */

export type Language = "en" | "hi";

export interface TranslationDict {
  nav: {
    home: string;
    about: string;
    programs: string;
    stories: string;
    getInvolved: string;
    events: string;
    partners: string;
    transparency: string;
    contact: string;
    donate: string;
    admin: string;
  };
  common: {
    donate: string;
    learnMore: string;
    readMore: string;
    viewAll: string;
    back: string;
    submit: string;
    cancel: string;
    close: string;
    loading: string;
    error: string;
    success: string;
    search: string;
    all: string;
    yes: string;
    no: string;
    save: string;
    delete: string;
    edit: string;
    logout: string;
    login: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    message: string;
    subject: string;
    newsletter: string;
    subscribe: string;
    footerTagline: string;
    rights: string;
    builtWith: string;
    quickLinks: string;
    contactUs: string;
    followUs: string;
    language: string;
    theme: string;
    menu: string;
    home: string;
  };
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    supportChild: string;
    ourPrograms: string;
  };
  footer: {
    newsletterTitle: string;
    newsletterDesc: string;
    newsletterPlaceholder: string;
    newsletterSuccess: string;
  };
  home: {
    newsletterExists: string;
  };
  getInvolved: {
    heroBadge: string;
    heroTitle: string;
    heroTitleAccent: string;
    heroSubtitle: string;
    rolesEyebrow: string;
    rolesTitle: string;
    rolesDescription: string;
    apply: string;
    soon: string;
    formEyebrow: string;
    formTitle: string;
    formDescription: string;
    formPoint1: string;
    formPoint2: string;
    formPoint3: string;
    formError: string;
    namePlaceholder: string;
    preferredRole: string;
    rolePlaceholder: string;
    availability: string;
    availabilityPlaceholder: string;
    messagePlaceholder: string;
    resume: string;
    resumeHint: string;
    submitApplication: string;
    successTitle: string;
    successDescription: string;
    submitAnother: string;
    opportunitiesEyebrow: string;
    opportunitiesTitle: string;
    opportunitiesDescription: string;
  };
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      programs: "Programs",
      stories: "Stories",
      getInvolved: "Get Involved",
      events: "Events",
      partners: "Partners",
      transparency: "Transparency",
      contact: "Contact",
      donate: "Donate",
      admin: "Admin",
    },
    common: {
      donate: "Donate",
      learnMore: "Learn more",
      readMore: "Read more",
      viewAll: "View all",
      back: "Back",
      submit: "Submit",
      cancel: "Cancel",
      close: "Close",
      loading: "Loading…",
      error: "Something went wrong",
      success: "Success",
      search: "Search",
      all: "All",
      yes: "Yes",
      no: "No",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      logout: "Log out",
      login: "Log in",
      email: "Email",
      password: "Password",
      name: "Name",
      phone: "Phone",
      message: "Message",
      subject: "Subject",
      newsletter: "Newsletter",
      subscribe: "Subscribe",
      footerTagline:
        "Kinderhilfswerk Society (KHW-India) works alongside communities to protect children and build brighter futures.",
      rights: "All rights reserved.",
      builtWith: "Built with love using",
      quickLinks: "Quick Links",
      contactUs: "Contact Us",
      followUs: "Follow Us",
      language: "Language",
      theme: "Theme",
      menu: "Menu",
      home: "Home",
    },
    hero: {
      badge: "Kinderhilfswerk Society · KHW-India",
      title: "Every child deserves",
      titleAccent: "a safe, bright future",
      subtitle:
        "We protect children and strengthen communities through education, health, and child protection programs across India.",
      supportChild: "Support a Child",
      ourPrograms: "Our Programs",
    },
    footer: {
      newsletterTitle: "Stay in the loop",
      newsletterDesc:
        "Get stories of impact and ways to help, delivered to your inbox.",
      newsletterPlaceholder: "Your email address",
      newsletterSuccess: "Thanks for subscribing!",
    },
    home: {
      newsletterExists: "That email is already subscribed.",
    },
    getInvolved: {
      heroBadge: "Volunteer with KHW-India",
      heroTitle: "Give your time to",
      heroTitleAccent: "change a child's story",
      heroSubtitle:
        "Whether you can spare a few hours a week or join us at an event, your time and skills help children stay safe, healthy, and in school.",
      rolesEyebrow: "Volunteer roles",
      rolesTitle: "Ways you can help",
      rolesDescription:
        "Explore open volunteer roles across our programs. Choose what fits your skills, schedule, and location.",
      apply: "Apply now",
      soon: "On hold",
      formEyebrow: "Apply to volunteer",
      formTitle: "Tell us about yourself",
      formDescription:
        "Fill in the form and our volunteer coordinator will be in touch within a few days to discuss next steps.",
      formPoint1:
        "No prior experience needed — we provide training and support for every role.",
      formPoint2:
        "Choose a role that matches your skills, interests, and availability.",
      formPoint3: "We welcome volunteers from all backgrounds and communities.",
      formError: "Please fill in your name, email, and preferred role.",
      namePlaceholder: "Your full name",
      preferredRole: "Preferred role",
      rolePlaceholder: "Select a role",
      availability: "Availability",
      availabilityPlaceholder: "When can you volunteer?",
      messagePlaceholder:
        "Tell us a little about yourself and why you'd like to volunteer…",
      resume: "Resume (optional)",
      resumeHint:
        "PDF, DOC, or DOCX. We'll only use it to match you to a role.",
      submitApplication: "Submit application",
      successTitle: "Application received!",
      successDescription:
        "Thank you for offering your time. Our volunteer coordinator will reach out to you shortly.",
      submitAnother: "Submit another application",
      opportunitiesEyebrow: "Upcoming opportunities",
      opportunitiesTitle: "Join us at an event",
      opportunitiesDescription:
        "Meet our team, learn about our work, and get involved at an upcoming event near you.",
    },
  },
  hi: {
    nav: {
      home: "होम",
      about: "हमारे बारे में",
      programs: "कार्यक्रम",
      stories: "कहानियाँ",
      getInvolved: "शामिल हों",
      events: "आयोजन",
      partners: "साझेदार",
      transparency: "पारदर्शिता",
      contact: "संपर्क",
      donate: "दान करें",
      admin: "एडमिन",
    },
    common: {
      donate: "दान करें",
      learnMore: "और जानें",
      readMore: "और पढ़ें",
      viewAll: "सभी देखें",
      back: "वापस",
      submit: "जमा करें",
      cancel: "रद्द करें",
      close: "बंद करें",
      loading: "लोड हो रहा है…",
      error: "कुछ गलत हो गया",
      success: "सफल",
      search: "खोजें",
      all: "सभी",
      yes: "हाँ",
      no: "नहीं",
      save: "सहेजें",
      delete: "हटाएँ",
      edit: "संपादित करें",
      logout: "लॉग आउट",
      login: "लॉग इन",
      email: "ईमेल",
      password: "पासवर्ड",
      name: "नाम",
      phone: "फ़ोन",
      message: "संदेश",
      subject: "विषय",
      newsletter: "न्यूज़लेटर",
      subscribe: "सदस्यता लें",
      footerTagline:
        "किंडरहिल्फ़्सवर्क सोसाइटी (KHW-India) समुदायों के साथ मिलकर बच्चों की रक्षा और बेहतर भविष्य बनाने के लिए काम करती है।",
      rights: "सर्वाधिकार सुरक्षित।",
      builtWith: "प्यार से बनाया गया",
      quickLinks: "त्वरित लिंक",
      contactUs: "संपर्क करें",
      followUs: "हमें फ़ॉलो करें",
      language: "भाषा",
      theme: "थीम",
      menu: "मेन्यू",
      home: "होम",
    },
    hero: {
      badge: "किंडरहिल्फ़्सवर्क सोसाइटी · KHW-India",
      title: "हर बच्चा हक़दार है",
      titleAccent: "एक सुरक्षित, उज्ज्वल भविष्य का",
      subtitle:
        "हम शिक्षा, स्वास्थ्य और बाल संरक्षण कार्यक्रमों के माध्यम से पूरे भारत में बच्चों की रक्षा और समुदायों को सशक्त बनाते हैं।",
      supportChild: "एक बच्चे का सहारा बनें",
      ourPrograms: "हमारे कार्यक्रम",
    },
    footer: {
      newsletterTitle: "जुड़े रहें",
      newsletterDesc: "प्रभाव की कहानियाँ और मदद के तरीके अपने इनबॉक्स में पाएँ।",
      newsletterPlaceholder: "आपका ईमेल पता",
      newsletterSuccess: "सदस्यता के लिए धन्यवाद!",
    },
    home: {
      newsletterExists: "यह ईमेल पहले से सदस्य है।",
    },
    getInvolved: {
      heroBadge: "KHW-India के साथ स्वयंसेवा करें",
      heroTitle: "अपना समय दें",
      heroTitleAccent: "एक बच्चे की कहानी बदलने के लिए",
      heroSubtitle:
        "चाहे आप हर हफ़्ते कुछ घंटे दे सकें या किसी आयोजन में शामिल हो सकें, आपका समय और कौशल बच्चों को सुरक्षित, स्वस्थ और स्कूल में बनाए रखने में मदद करता है।",
      rolesEyebrow: "स्वयंसेवक भूमिकाएँ",
      rolesTitle: "मदद करने के तरीके",
      rolesDescription:
        "हमारे कार्यक्रमों में खुली स्वयंसेवक भूमिकाएँ देखें। अपने कौशल, समय और स्थान के अनुसार चुनें।",
      apply: "अभी आवेदन करें",
      soon: "रोका गया",
      formEyebrow: "स्वयंसेवा के लिए आवेदन",
      formTitle: "अपने बारे में बताएँ",
      formDescription:
        "फ़ॉर्म भरें और हमारा स्वयंसेवक समन्वयक कुछ दिनों में आगे के कदमों के लिए आपसे संपर्क करेगा।",
      formPoint1:
        "कोई पूर्व अनुभव आवश्यक नहीं — हम हर भूमिका के लिए प्रशिक्षण और सहायता देते हैं।",
      formPoint2: "अपने कौशल, रुचि और उपलब्धता के अनुसार भूमिका चुनें।",
      formPoint3: "हम सभी पृष्ठभूमि और समुदायों के स्वयंसेवकों का स्वागत करते हैं।",
      formError: "कृपया अपना नाम, ईमेल और पसंदीदा भूमिका भरें।",
      namePlaceholder: "आपका पूरा नाम",
      preferredRole: "पसंदीदा भूमिका",
      rolePlaceholder: "भूमिका चुनें",
      availability: "उपलब्धता",
      availabilityPlaceholder: "आप कब स्वयंसेवा कर सकते हैं?",
      messagePlaceholder: "अपने बारे में और स्वयंसेवा क्यों करना चाहते हैं, थोड़ा बताएँ…",
      resume: "बायोडाटा (वैकल्पिक)",
      resumeHint: "PDF, DOC, या DOCX। हम इसका उपयोग केवल भूमिका मिलान के लिए करेंगे।",
      submitApplication: "आवेदन जमा करें",
      successTitle: "आवेदन प्राप्त हुआ!",
      successDescription:
        "अपना समय देने के लिए धन्यवाद। हमारा स्वयंसेवक समन्वयक जल्द ही आपसे संपर्क करेगा।",
      submitAnother: "एक और आवेदन जमा करें",
      opportunitiesEyebrow: "आगामी अवसर",
      opportunitiesTitle: "किसी आयोजन में शामिल हों",
      opportunitiesDescription:
        "हमारी टीम से मिलें, हमारे काम के बारे में जानें, और अपने नज़दीकी आयोजन में शामिल हों।",
    },
  },
};

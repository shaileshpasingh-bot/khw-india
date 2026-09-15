import { LazyImage } from "@/components/shared/LazyImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { type FormEvent, useState } from "react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    label: "Head Office",
    value: "B-42, Community Centre, New Delhi 110001",
    href: undefined as string | undefined,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 11 2345 6789",
    href: "tel:+911123456789",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@khwindia.org",
    href: "mailto:hello@khwindia.org",
  },
  {
    icon: Clock,
    label: "Office Hours",
    value: "Mon – Fri, 9:00 AM – 6:00 PM IST",
    href: undefined,
  },
];

const SOCIALS = [
  { label: "Facebook", icon: SiFacebook, href: "https://facebook.com" },
  { label: "Instagram", icon: SiInstagram, href: "https://instagram.com" },
  { label: "X", icon: SiX, href: "https://x.com" },
  { label: "YouTube", icon: SiYoutube, href: "https://youtube.com" },
];

const FAQS = [
  {
    question: "How quickly will I hear back after sending a message?",
    answer:
      "Our team aims to respond to every inquiry within two working days. For urgent matters, please call our office directly during business hours.",
  },
  {
    question: "Can I visit your office or a program site?",
    answer:
      "Yes. We welcome visitors and offer guided tours of our community learning centres. Please reach out in advance so we can arrange a convenient time and any necessary permissions.",
  },
  {
    question: "How do I partner with KHW-India?",
    answer:
      "We partner with corporations, foundations, and community organisations. Send us a message with the subject 'Partnership' and our partnerships team will get in touch to explore ways to collaborate.",
  },
  {
    question: "Do you accept volunteers who are not based in Delhi?",
    answer:
      "Absolutely. Many of our volunteer roles — such as tutoring, mentoring, and fundraising — can be done remotely. Check our Get Involved page for open roles and requirements.",
  },
  {
    question: "How can I donate to a specific program?",
    answer:
      "You can choose a specific program when making a donation on our Donate page. Your gift will be directed to the program you select, and you will receive a receipt for your records.",
  },
];

export default function ContactPage() {
  const { t } = useTranslation();
  const { addContactSubmission, addNotification } = useData();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedEmail || !trimmedSubject || !trimmedMessage) {
      return;
    }

    addContactSubmission({
      id: `contact-${Date.now().toString(36)}`,
      name: trimmedName,
      email: trimmedEmail,
      subject: trimmedSubject,
      message: trimmedMessage,
      date: new Date().toISOString().slice(0, 10),
      status: "new",
    });
    addNotification(`New contact message from ${trimmedName}.`, "info");

    const submittedName = trimmedName;
    const submittedEmail = trimmedEmail;

    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setSubmitted(true);
    setSubmittedName(submittedName);
    setSubmittedEmail(submittedEmail);
  };

  return (
    <div className="bg-gradient-subtle">
      <Seo
        title="Contact Us | KHW-India"
        description="Get in touch with Kinderhilfswerk Society (KHW-India). Questions, partnership ideas, or press inquiries — we'd love to hear from you."
      />

      {/* Hero */}
      <section className="container py-16 sm:py-20">
        <SectionHeading
          eyebrow="Contact"
          title="We'd love to hear from you"
          description="Questions, partnership ideas, or press inquiries — reach out and our team will get back to you within two working days."
        />
      </section>

      {/* Form + details */}
      <section className="container pb-16 sm:pb-20">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Contact form */}
          <Card className="lg:col-span-3">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <MessageCircle className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Send us a message
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Fill in the form and we'll be in touch shortly.
                  </p>
                </div>
              </div>

              {submitted ? (
                <div
                  data-ocid="contact.success_state"
                  className="flex flex-col items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-6"
                >
                  <h3 className="font-display text-xl font-semibold text-success">
                    Thank you, {submittedName || "friend"}!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your message has been received. Our team will reply to{" "}
                    <span className="font-medium text-foreground">
                      {submittedEmail}
                    </span>{" "}
                    within two working days.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    data-ocid="contact.send_another_button"
                    onClick={() => setSubmitted(false)}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                  data-ocid="contact.form"
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contact-name">{t("common.name")}</Label>
                      <Input
                        id="contact-name"
                        data-ocid="contact.name_input"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your full name"
                        required
                        autoComplete="name"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="contact-email">{t("common.email")}</Label>
                      <Input
                        id="contact-email"
                        data-ocid="contact.email_input"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="you@example.com"
                        required
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-subject">
                      {t("common.subject")}
                    </Label>
                    <Input
                      id="contact-subject"
                      data-ocid="contact.subject_input"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      placeholder="How can we help?"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="contact-message">
                      {t("common.message")}
                    </Label>
                    <Textarea
                      id="contact-message"
                      data-ocid="contact.message_input"
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Tell us a little about your inquiry…"
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    data-ocid="contact.submit_button"
                    className="w-full rounded-full sm:w-auto"
                  >
                    <Send className="size-4" aria-hidden="true" />
                    Send message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Contact details */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            <Card>
              <CardContent className="flex flex-col gap-5 p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold">
                  Reach us directly
                </h2>
                <ul className="flex flex-col gap-5">
                  {CONTACT_DETAILS.map((detail) => (
                    <li key={detail.label} className="flex items-start gap-4">
                      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <detail.icon className="size-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-muted-foreground">
                          {detail.label}
                        </p>
                        {detail.href ? (
                          <a
                            href={detail.href}
                            data-ocid={`contact.detail.${detail.label
                              .toLowerCase()
                              .replace(/\s+/g, "_")}`}
                            className="font-medium text-foreground transition-colors hover:text-accent"
                          >
                            {detail.value}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground">
                            {detail.value}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Social links */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="font-display text-2xl font-semibold">
                  Follow our work
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Stay connected for stories of impact and ways to help.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  {SOCIALS.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      data-ocid={`contact.social.${social.label.toLowerCase()}`}
                      aria-label={social.label}
                      className="flex size-11 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
                    >
                      <social.icon className="size-5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className="container pb-16 sm:pb-20">
        <Card className="overflow-hidden">
          <div
            data-ocid="contact.map_placeholder"
            className="relative flex min-h-[360px] items-center justify-center overflow-hidden"
          >
            <LazyImage
              icon={MapPin}
              label="New Delhi office"
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
            <div className="relative flex flex-col items-center gap-3 px-6 py-12 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                <MapPin className="size-7" aria-hidden="true" />
              </span>
              <h3 className="font-display text-xl font-semibold">
                Find us in New Delhi
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                B-42, Community Centre, New Delhi 110001. We're a short walk
                from the metro and happy to share directions.
              </p>
              <a
                href="https://maps.google.com/?q=New+Delhi+110001"
                target="_blank"
                rel="noreferrer"
                data-ocid="contact.map_link"
                className="mt-1 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <MapPin className="size-4" aria-hidden="true" />
                Open in Maps
              </a>
            </div>
          </div>
        </Card>
      </section>

      {/* FAQ */}
      <section className="container pb-20 sm:pb-24">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Quick answers to the questions we hear most often. Can't find what you need? Send us a message above."
        />
        <div className="mx-auto mt-10 max-w-3xl">
          <Accordion type="single" collapsible data-ocid="contact.faq">
            {FAQS.map((faq, index) => (
              <AccordionItem
                key={faq.question}
                value={`faq-${index}`}
                className="rounded-xl border bg-card px-5 shadow-sm"
              >
                <AccordionTrigger
                  data-ocid={`contact.faq.trigger.${index + 1}`}
                  className="text-base font-medium"
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </div>
  );
}

import { LazyImage } from "@/components/shared/LazyImage";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Seo } from "@/components/shared/Seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useData } from "@/lib/data/store";
import { useTranslation } from "@/lib/i18n/LanguageProvider";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Heart,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";

type Frequency = "one-time" | "monthly";
type Step = "amount" | "details" | "payment" | "success";

interface SuggestedAmount {
  amount: number;
  impact: string;
  impactHi: string;
}

const SUGGESTED_AMOUNTS: SuggestedAmount[] = [
  {
    amount: 500,
    impact: "Provides school supplies for a child for a term",
    impactHi: "एक बच्चे के लिए एक टर्म की स्कूल सामग्री",
  },
  {
    amount: 1000,
    impact: "Funds a month of nutritious meals for a child",
    impactHi: "एक बच्चे के लिए एक महीने का पौष्टिक भोजन",
  },
  {
    amount: 2500,
    impact: "Covers a child's school fees for a year",
    impactHi: "एक बच्चे की एक साल की स्कूल फीस",
  },
  {
    amount: 5000,
    impact: "Supports a full health camp for a community",
    impactHi: "एक समुदाय के लिए पूरा स्वास्थ्य शिविर",
  },
];

const CUSTOM_AMOUNTS = [100, 200, 500, 1000, 2500, 5000];

function formatINR(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function DonatePage() {
  const { lang } = useTranslation();
  const { data, addDonation } = useData();

  const [step, setStep] = useState<Step>("amount");
  const [frequency, setFrequency] = useState<Frequency>("one-time");
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [programId, setProgramId] = useState<string>("education");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);

  const programs = useMemo(
    () => data.programs.filter((p) => p.status === "active"),
    [data.programs],
  );

  const amount = customAmount
    ? Number(customAmount.replace(/[^0-9]/g, ""))
    : selectedAmount;

  const activeProgram = useMemo(
    () => programs.find((p) => p.id === programId) ?? programs[0],
    [programs, programId],
  );

  const selectedImpact = useMemo(() => {
    const match = SUGGESTED_AMOUNTS.find((s) => s.amount === selectedAmount);
    return match ? (lang === "hi" ? match.impactHi : match.impact) : null;
  }, [selectedAmount, lang]);

  const canContinueFromAmount = amount >= 50;
  const canContinueFromDetails =
    name.trim().length > 0 && email.includes("@") && amount >= 50;

  function handleAmountContinue() {
    if (!canContinueFromAmount) return;
    setStep("details");
  }

  function handleDetailsContinue() {
    if (!canContinueFromDetails) return;
    setStep("payment");
  }

  function handleBack() {
    if (step === "details") setStep("amount");
    else if (step === "payment") setStep("details");
  }

  function handleCompletePayment() {
    setProcessing(true);
    // Simulate a short processing delay so the mock gateway feels real.
    // In production, this is where a real payment gateway (e.g. Stripe)
    // would be integrated: create a PaymentIntent / Checkout Session and
    // confirm the payment before recording the donation.
    window.setTimeout(() => {
      addDonation({
        id: `donation-${Date.now().toString(36)}`,
        name: name.trim() || "Anonymous",
        email: email.trim(),
        amount,
        frequency,
        programId: activeProgram?.id ?? "education",
        message: message.trim(),
        date: new Date().toISOString().slice(0, 10),
        status: "completed",
      });
      setProcessing(false);
      setStep("success");
    }, 1200);
  }

  function handleStartOver() {
    setStep("amount");
    setCustomAmount("");
    setSelectedAmount(1000);
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <div className="bg-gradient-subtle">
      <Seo
        title="Donate | KHW-India"
        description="Support a child's education, health, and protection. Give a one-time or monthly donation to Kinderhilfswerk Society (KHW-India)."
      />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-95" />
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-accent/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 size-72 rounded-full bg-primary/40 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center text-white sm:py-20">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold tracking-wide backdrop-blur">
            <Heart className="size-4" aria-hidden="true" />
            {lang === "hi" ? "दान करें" : "Give with confidence"}
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold text-balance sm:text-5xl">
            {lang === "hi"
              ? "आपका उपहार एक बच्चे का भविष्य बदलता है"
              : "Your gift changes a child's future"}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            {lang === "hi"
              ? "हर दान शिक्षा, स्वास्थ्य और सुरक्षा के माध्यम से एक बच्चे के जीवन को बदल देता है।"
              : "Every donation transforms a child's life through education, health, and protection."}
          </p>
          <div className="mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl shadow-elevated ring-1 ring-white/20">
            <LazyImage
              icon={Heart}
              label={
                lang === "hi"
                  ? "हमारे कार्यक्रमों से जुड़े बच्चे"
                  : "Children helped by our programs"
              }
              className="aspect-[16/9] w-full"
            />
          </div>
        </div>
      </section>

      {/* Donation flow */}
      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main form card */}
          <Card className="shadow-elevated">
            <CardContent className="px-6 py-8 sm:px-8">
              {/* Step indicator */}
              <ol className="mb-8 flex items-center gap-2 text-sm">
                {(["amount", "details", "payment"] as const).map((s, i) => {
                  const active = step === s;
                  const done =
                    (s === "amount" &&
                      (step === "details" ||
                        step === "payment" ||
                        step === "success")) ||
                    (s === "details" &&
                      (step === "payment" || step === "success"));
                  return (
                    <li key={s} className="flex items-center gap-2">
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                          done
                            ? "bg-primary text-primary-foreground"
                            : active
                              ? "bg-accent text-accent-foreground"
                              : "bg-muted text-muted-foreground",
                        )}
                      >
                        {done ? <CheckCircle2 className="size-4" /> : i + 1}
                      </span>
                      <span
                        className={cn(
                          "hidden font-medium sm:inline",
                          active || done
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {s === "amount"
                          ? lang === "hi"
                            ? "राशि"
                            : "Amount"
                          : s === "details"
                            ? lang === "hi"
                              ? "विवरण"
                              : "Details"
                            : lang === "hi"
                              ? "भुगतान"
                              : "Payment"}
                      </span>
                      {i < 2 ? (
                        <span className="mx-1 h-px w-6 bg-border" />
                      ) : null}
                    </li>
                  );
                })}
              </ol>

              {step === "amount" ? (
                <div className="space-y-8">
                  {/* Frequency toggle */}
                  <div>
                    <Label className="mb-3 block text-base">
                      {lang === "hi"
                        ? "दान का प्रकार चुनें"
                        : "Choose how you'd like to give"}
                    </Label>
                    <RadioGroup
                      value={frequency}
                      onValueChange={(v) => setFrequency(v as Frequency)}
                      className="grid grid-cols-2 gap-3"
                    >
                      <label
                        htmlFor="freq-onetime"
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                          frequency === "one-time"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40",
                        )}
                      >
                        <RadioGroupItem value="one-time" id="freq-onetime" />
                        <span>
                          <span className="block font-semibold">
                            {lang === "hi" ? "एकमुश्त" : "One-time"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {lang === "hi"
                              ? "एक बार का उपहार"
                              : "A single gift"}
                          </span>
                        </span>
                      </label>
                      <label
                        htmlFor="freq-monthly"
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors",
                          frequency === "monthly"
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40",
                        )}
                      >
                        <RadioGroupItem value="monthly" id="freq-monthly" />
                        <span>
                          <span className="block font-semibold">
                            {lang === "hi" ? "मासिक" : "Monthly"}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {lang === "hi" ? "हर महीने दें" : "Give every month"}
                          </span>
                        </span>
                      </label>
                    </RadioGroup>
                  </div>

                  {/* Suggested amounts */}
                  <div>
                    <Label className="mb-3 block text-base">
                      {lang === "hi" ? "राशि चुनें" : "Choose an amount"}
                    </Label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {SUGGESTED_AMOUNTS.map((s) => {
                        const active =
                          !customAmount && selectedAmount === s.amount;
                        return (
                          <button
                            key={s.amount}
                            type="button"
                            data-ocid={`donate.amount.${s.amount}`}
                            onClick={() => {
                              setSelectedAmount(s.amount);
                              setCustomAmount("");
                            }}
                            className={cn(
                              "flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-all",
                              active
                                ? "border-accent bg-accent/10 shadow-card"
                                : "border-border hover:border-accent/50 hover:bg-accent/5",
                            )}
                          >
                            <span className="font-display text-xl font-semibold">
                              {formatINR(s.amount)}
                            </span>
                            <span className="text-xs leading-snug text-muted-foreground">
                              {lang === "hi" ? s.impactHi : s.impact}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom amount */}
                    <div className="mt-4">
                      <Label htmlFor="custom-amount" className="mb-2 block">
                        {lang === "hi"
                          ? "या अपनी राशि दर्ज करें"
                          : "Or enter your own amount"}
                      </Label>
                      <div className="relative">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                          ₹
                        </span>
                        <Input
                          id="custom-amount"
                          data-ocid="donate.custom_amount"
                          type="text"
                          inputMode="numeric"
                          placeholder="1000"
                          value={customAmount}
                          onChange={(e) => {
                            const digits = e.target.value.replace(
                              /[^0-9]/g,
                              "",
                            );
                            setCustomAmount(digits);
                            if (digits) setSelectedAmount(0);
                          }}
                          className="pl-8"
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {CUSTOM_AMOUNTS.map((a) => (
                          <button
                            key={a}
                            type="button"
                            onClick={() => {
                              setCustomAmount(String(a));
                              setSelectedAmount(0);
                            }}
                            className={cn(
                              "rounded-full border px-3 py-1 text-sm transition-colors",
                              customAmount === String(a)
                                ? "border-accent bg-accent text-accent-foreground"
                                : "border-border hover:border-accent/50",
                            )}
                          >
                            {formatINR(a)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {!canContinueFromAmount ? (
                      <p className="mt-3 text-sm text-destructive">
                        {lang === "hi"
                          ? "कृपया कम से कम ₹50 की राशि चुनें।"
                          : "Please choose an amount of at least ₹50."}
                      </p>
                    ) : null}
                  </div>

                  {/* Program allocation */}
                  <div>
                    <Label htmlFor="program" className="mb-2 block text-base">
                      {lang === "hi"
                        ? "अपना दान कहाँ जाए (वैकल्पिक)"
                        : "Where should your gift go? (optional)"}
                    </Label>
                    <Select value={programId} onValueChange={setProgramId}>
                      <SelectTrigger
                        id="program"
                        data-ocid="donate.program"
                        className="w-full"
                      >
                        <SelectValue placeholder="Select a program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {lang === "hi" ? p.titleHi : p.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {activeProgram ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {lang === "hi"
                          ? activeProgram.descriptionHi
                          : activeProgram.description}
                      </p>
                    ) : null}
                  </div>

                  <Button
                    type="button"
                    size="lg"
                    data-ocid="donate.continue_button"
                    className="w-full rounded-full"
                    disabled={!canContinueFromAmount}
                    onClick={handleAmountContinue}
                  >
                    {lang === "hi" ? "आगे बढ़ें" : "Continue"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              ) : null}

              {step === "details" ? (
                <div className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="donor-name" className="mb-2 block">
                        {lang === "hi" ? "आपका नाम" : "Your name"}
                      </Label>
                      <Input
                        id="donor-name"
                        data-ocid="donate.name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={lang === "hi" ? "पूरा नाम" : "Full name"}
                      />
                    </div>
                    <div>
                      <Label htmlFor="donor-email" className="mb-2 block">
                        {lang === "hi" ? "ईमेल" : "Email"}
                      </Label>
                      <Input
                        id="donor-email"
                        data-ocid="donate.email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="donor-message" className="mb-2 block">
                      {lang === "hi" ? "संदेश (वैकल्पिक)" : "Message (optional)"}
                    </Label>
                    <Textarea
                      id="donor-message"
                      data-ocid="donate.message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        lang === "hi"
                          ? "बच्चों के लिए अपना संदेश साझा करें…"
                          : "Share a note for the children…"
                      }
                    />
                  </div>

                  {!canContinueFromDetails ? (
                    <p className="text-sm text-destructive">
                      {lang === "hi"
                        ? "कृपया अपना नाम और एक मान्य ईमेल दर्ज करें।"
                        : "Please enter your name and a valid email."}
                    </p>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      data-ocid="donate.back_button"
                      className="rounded-full"
                      onClick={handleBack}
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      {lang === "hi" ? "वापस" : "Back"}
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      data-ocid="donate.continue_button"
                      className="flex-1 rounded-full"
                      disabled={!canContinueFromDetails}
                      onClick={handleDetailsContinue}
                    >
                      {lang === "hi"
                        ? "भुगतान के लिए आगे बढ़ें"
                        : "Proceed to payment"}
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === "payment" ? (
                <div className="space-y-6">
                  {/* Review summary */}
                  <div className="rounded-xl border bg-muted/40 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {lang === "hi" ? "दान राशि" : "Donation amount"}
                      </span>
                      <span className="font-display text-2xl font-semibold">
                        {formatINR(amount)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {lang === "hi" ? "आवृत्ति" : "Frequency"}
                      </span>
                      <span className="font-medium">
                        {frequency === "monthly"
                          ? lang === "hi"
                            ? "मासिक"
                            : "Monthly"
                          : lang === "hi"
                            ? "एकमुश्त"
                            : "One-time"}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        {lang === "hi" ? "कार्यक्रम" : "Program"}
                      </span>
                      <span className="font-medium">
                        {activeProgram
                          ? lang === "hi"
                            ? activeProgram.titleHi
                            : activeProgram.title
                          : "—"}
                      </span>
                    </div>
                  </div>

                  {/* Mock payment fields */}
                  <div>
                    <Label className="mb-3 block text-base">
                      {lang === "hi" ? "भुगतान विवरण" : "Payment details"}
                    </Label>
                    <div className="space-y-4 rounded-xl border p-4">
                      <div>
                        <Label htmlFor="card-number" className="mb-2 block">
                          {lang === "hi" ? "कार्ड नंबर" : "Card number"}
                        </Label>
                        <Input
                          id="card-number"
                          data-ocid="donate.card_number"
                          inputMode="numeric"
                          placeholder="4242 4242 4242 4242"
                          defaultValue="4242 4242 4242 4242"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="card-expiry" className="mb-2 block">
                            {lang === "hi" ? "समाप्ति" : "Expiry"}
                          </Label>
                          <Input
                            id="card-expiry"
                            data-ocid="donate.card_expiry"
                            placeholder="MM/YY"
                            defaultValue="12/28"
                          />
                        </div>
                        <div>
                          <Label htmlFor="card-cvc" className="mb-2 block">
                            CVC
                          </Label>
                          <Input
                            id="card-cvc"
                            data-ocid="donate.card_cvc"
                            inputMode="numeric"
                            placeholder="123"
                            defaultValue="123"
                          />
                        </div>
                      </div>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Lock className="size-3.5" aria-hidden="true" />
                        {lang === "hi"
                          ? "यह एक नकली भुगतान है — कोई वास्तविक शुल्क नहीं लिया जाएगा।"
                          : "This is a mock payment — no real charge will be made."}
                      </p>
                    </div>
                  </div>

                  {/* Stripe integration note */}
                  <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm">
                    <p className="flex items-start gap-2">
                      <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" />
                      <span>
                        {lang === "hi"
                          ? "वास्तविक लॉन्च पर, यहाँ एक सुरक्षित भुगतान गेटवे (जैसे Stripe) जोड़ा जाएगा ताकि दान सीधे संसाधित हो सके।"
                          : "On a real launch, a secure payment gateway (e.g. Stripe) would be integrated here to process donations directly."}
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      data-ocid="donate.back_button"
                      className="rounded-full"
                      onClick={handleBack}
                      disabled={processing}
                    >
                      <ArrowLeft className="size-4" aria-hidden="true" />
                      {lang === "hi" ? "वापस" : "Back"}
                    </Button>
                    <Button
                      type="button"
                      size="lg"
                      data-ocid="donate.pay_button"
                      className="flex-1 rounded-full"
                      disabled={processing}
                      onClick={handleCompletePayment}
                    >
                      {processing ? (
                        <>
                          <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          {lang === "hi" ? "संसाधित हो रहा है…" : "Processing…"}
                        </>
                      ) : (
                        <>
                          <Lock className="size-4" aria-hidden="true" />
                          {lang === "hi"
                            ? `दान करें ${formatINR(amount)}`
                            : `Donate ${formatINR(amount)}`}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : null}

              {step === "success" ? (
                <div
                  data-ocid="donate.success_state"
                  className="flex flex-col items-center py-8 text-center"
                >
                  <div className="flex size-16 items-center justify-center rounded-full bg-success/15">
                    <CheckCircle2 className="size-9 text-success" />
                  </div>
                  <h2 className="mt-6 font-display text-3xl font-semibold">
                    {lang === "hi"
                      ? `धन्यवाद, ${name.trim() || "मित्र"}!`
                      : `Thank you, ${name.trim() || "friend"}!`}
                  </h2>
                  <p className="mt-3 max-w-md text-muted-foreground">
                    {lang === "hi"
                      ? `आपका ${formatINR(amount)} का दान दर्ज हो गया है। आपका समर्थन एक बच्चे के जीवन में बदलाव लाएगा।`
                      : `Your donation of ${formatINR(amount)} has been recorded. Your support will make a real difference in a child's life.`}
                  </p>
                  <div className="mt-6 flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
                    <ShieldCheck className="size-4 text-primary" />
                    {lang === "hi"
                      ? "एक पुष्टिकरण ईमेल भेजा गया है"
                      : "A confirmation has been sent to your email"}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    data-ocid="donate.donate_again_button"
                    className="mt-8 rounded-full"
                    onClick={handleStartOver}
                  >
                    <Heart className="size-4" aria-hidden="true" />
                    {lang === "hi" ? "फिर से दान करें" : "Make another donation"}
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Sidebar */}
          <aside className="space-y-6">
            <Card className="bg-gradient-primary text-white shadow-elevated">
              <CardContent className="px-6 py-6">
                <h3 className="font-display text-xl font-semibold">
                  {lang === "hi"
                    ? "आपका दान कहाँ जाता है"
                    : "Where your gift goes"}
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-white/85">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    {lang === "hi"
                      ? "शिक्षा: स्कूल फीस, सामग्री और छात्रवृत्ति"
                      : "Education: school fees, supplies, and scholarships"}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    {lang === "hi"
                      ? "स्वास्थ्य: भोजन, जांच और टीकाकरण"
                      : "Health: meals, check-ups, and immunizations"}
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-accent" />
                    {lang === "hi"
                      ? "संरक्षण: सुरक्षित स्थान और परामर्श"
                      : "Protection: safe spaces and counselling"}
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="px-6 py-6">
                <h3 className="font-display text-lg font-semibold">
                  {lang === "hi" ? "आपका प्रभाव" : "Your impact"}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedImpact ??
                    (lang === "hi"
                      ? "आपकी पसंदीदा राशि का प्रभाव यहाँ दिखेगा।"
                      : "The impact of your chosen amount will appear here.")}
                </p>
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-medium">
                    {lang === "hi"
                      ? "सुरक्षित और पारदर्शी"
                      : "Secure & transparent"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lang === "hi"
                      ? "हमारे वित्तीय रिपोर्ट सार्वजनिक रूप से उपलब्ध हैं।"
                      : "Our financial reports are publicly available."}
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </div>
  );
}

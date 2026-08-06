import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  ChevronsUpDown,
  Eye,
  EyeOff,
  Globe,
  Hash,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  Receipt,
  Search,
  ShieldCheck,
  User,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { EASE_LUX } from "@/lib/motion-presets";
import { Turnstile } from "@/components/ui-kit/Turnstile";
import { COUNTRIES, citiesOf, statesOf } from "@/lib/geo-data";
import { getSupabase } from "@/lib/supabase-external";
import { getAuthRedirectUrl } from "@/lib/site-url";

const TURNSTILE_SITE_KEY = "0x4AAAAAAD-t1YVyLPsyslw2";

const ROLE_OPTIONS = ["Agency Owner", "Employee", "Affiliate Employee"] as const;

const TRAFFIC_SOURCES = [
  "Facebook",
  "Instagram",
  "Telegram",
  "WhatsApp",
  "YouTube",
  "Google Ads",
  "Native Ads",
  "SEO",
  "Website / Blog",
  "Email Marketing",
  "Influencer",
  "Others",
];

const STEPS = [
  { id: 1, label: "Personal Information", short: "Personal", icon: User },
  { id: 2, label: "Business Profile", short: "Business", icon: UserCog },
  { id: 3, label: "Address Information", short: "Address", icon: MapPin },
  { id: 4, label: "Account Security", short: "Security", icon: Lock },
] as const;

/* ------------------------------------------------------------------ */
/* primitives                                                          */
/* ------------------------------------------------------------------ */

type FieldState = "idle" | "valid" | "error";

const CONTROL_BASE =
  "h-12 w-full rounded-xl border bg-surface/60 pl-10 pr-3 text-sm shadow-plate transition-[border-color,box-shadow,background-color] duration-300 focus:outline-none";

function controlTone(state: FieldState) {
  if (state === "error")
    return "border-destructive/60 focus:border-destructive focus:ring-2 focus:ring-destructive/25";
  if (state === "valid")
    return "border-brand/45 focus:border-brand/70 focus:ring-2 focus:ring-brand/25";
  return "border-input hover:border-brand/40 focus:border-brand/60 focus:ring-2 focus:ring-brand/25";
}

function RequiredMark({ required }: { required?: boolean }) {
  if (!required) return null;
  return (
    <span aria-hidden="true" className="ml-0.5 text-destructive">
      *
    </span>
  );
}

function FieldShell({
  id,
  label,
  required,
  optional,
  floated,
  state,
  message,
  className,
  children,
}: {
  id?: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  floated: boolean;
  state: FieldState;
  message?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="relative">
        {children}
        <label
          htmlFor={id}
          className={cn(
            "pointer-events-none absolute left-9 z-10 origin-left px-1.5 font-medium transition-all duration-200 ease-out",
            floated
              ? "top-0 -translate-y-1/2 rounded bg-background text-[11px] tracking-wide"
              : "top-1/2 -translate-y-1/2 text-sm",
            state === "error"
              ? "text-destructive"
              : floated
                ? "text-brand"
                : "text-muted-foreground",
          )}
        >
          {label}
          <RequiredMark required={required} />
          {optional && !floated && (
            <span className="ml-1 text-xs font-normal opacity-60">(Optional)</span>
          )}
        </label>
      </div>
      <AnimatePresence initial={false}>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: EASE_LUX }}
            className={cn(
              "flex items-center gap-1.5 px-1 text-[11px] font-medium",
              state === "error" ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {state === "error" && <AlertTriangle className="size-3" aria-hidden="true" />}
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function LeadIcon({ as: As, state }: { as: React.ElementType; state: FieldState }) {
  return (
    <As
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 transition-colors duration-300",
        state === "error"
          ? "text-destructive"
          : state === "valid"
            ? "text-brand"
            : "text-muted-foreground",
      )}
    />
  );
}

function FloatingInput({
  id,
  label,
  icon,
  value,
  onValueChange,
  onBlur,
  state,
  message,
  required,
  optional,
  className,
  inputClassName,
  trailing,
  ...rest
}: {
  id: string;
  label: string;
  icon: React.ElementType;
  value: string;
  onValueChange: (v: string) => void;
  onBlur?: () => void;
  state: FieldState;
  message?: string;
  required?: boolean;
  optional?: boolean;
  className?: string;
  inputClassName?: string;
  trailing?: React.ReactNode;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "onBlur" | "className"
>) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <FieldShell
      id={id}
      label={label}
      required={required}
      optional={optional}
      floated={floated}
      state={state}
      message={message}
      className={className}
    >
      <LeadIcon as={icon} state={state} />
      <input
        {...rest}
        id={id}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false);
          onBlur?.();
        }}
        className={cn(
          CONTROL_BASE,
          controlTone(state),
          "text-foreground placeholder:text-muted-foreground/70",
          !floated && "placeholder:text-transparent",
          inputClassName,
        )}
      />
      {trailing}
      {state === "valid" && !trailing && (
        <Check
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-brand"
          aria-hidden="true"
        />
      )}
    </FieldShell>
  );
}

function FloatingSelect({
  label,
  icon,
  value,
  onValueChange,
  options,
  placeholder,
  disabled,
  required,
  state = "idle",
  message,
  className,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onValueChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
  disabled?: boolean;
  required?: boolean;
  state?: FieldState;
  message?: string;
  className?: string;
}) {
  const floated = true; // select labels stay floated so the placeholder remains visible
  return (
    <FieldShell
      label={label}
      required={required}
      floated={floated}
      state={state}
      message={message}
      className={className}
    >
      <LeadIcon as={icon} state={state} />
      <Select value={value || undefined} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          aria-label={label}
          className={cn(
            CONTROL_BASE,
            controlTone(state),
            "justify-between data-[placeholder]:text-muted-foreground/70 disabled:opacity-50",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-72 rounded-xl border-hairline bg-popover/95 p-1.5 shadow-lux backdrop-blur-xl">
          {options.map((o) => (
            <SelectItem
              key={o}
              value={o}
              className="cursor-pointer rounded-lg px-2 py-2.5 text-sm transition-colors duration-200 focus:bg-brand/10 focus:text-brand data-[state=checked]:text-brand"
            >
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  );
}

function CountryCombobox({
  value,
  onChange,
  state,
  message,
}: {
  value: string;
  onChange: (code: string) => void;
  state: FieldState;
  message?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = COUNTRIES.find((c) => c.code === value);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q)) : COUNTRIES;
  }, [query]);

  return (
    <FieldShell label="Country" required floated state={state} message={message}>
      <LeadIcon as={Globe} state={state} />
      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (!o) setQuery("");
        }}
      >
        <PopoverTrigger asChild>
          <button
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-label="Country"
            className={cn(
              CONTROL_BASE,
              controlTone(state),
              "flex items-center justify-between gap-2 text-left",
            )}
          >
            <span className={cn("truncate", !selected && "text-muted-foreground/70")}>
              {selected ? `${selected.flag}  ${selected.name}` : "Search country"}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] min-w-64 rounded-xl border-hairline bg-popover/95 p-0 shadow-lux backdrop-blur-xl"
        >
          <div className="relative border-b border-hairline">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country…"
              aria-label="Search country"
              className="h-11 w-full bg-transparent pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/70"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto p-1.5">
            {results.length === 0 && (
              <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                No country found
              </li>
            )}
            {results.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors duration-200 hover:bg-brand/10 hover:text-brand",
                    c.code === value && "bg-brand/10 text-brand",
                  )}
                >
                  <span aria-hidden="true" className="text-base leading-none">
                    {c.flag}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.dial}</span>
                  {c.code === value && <Check className="size-4" aria-hidden="true" />}
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </FieldShell>
  );
}

function SectionCard({
  step,
  title,
  icon: IconCmp,
  complete,
  children,
  delay = 0,
}: {
  step: number;
  title: string;
  icon: React.ElementType;
  complete?: boolean;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.fieldset
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE_LUX }}
      className="plate rounded-2xl p-4 sm:p-5"
    >
      <legend className="sr-only">{title}</legend>
      <div className="mb-5 flex items-center gap-2.5">
        <span
          className={cn(
            "grid size-8 shrink-0 place-items-center rounded-lg border transition-colors duration-300",
            complete
              ? "border-brand bg-brand text-primary-foreground"
              : "border-brand/30 bg-brand/10 text-brand",
          )}
        >
          {complete ? (
            <Check className="size-4" aria-hidden="true" />
          ) : (
            <IconCmp className="size-4" aria-hidden="true" />
          )}
        </span>
        <h2 className="text-sm font-bold tracking-tight">
          {step}. {title}
        </h2>
      </div>
      {children}
    </motion.fieldset>
  );
}

/* ------------------------------------------------------------------ */
/* validation helpers (frontend only)                                  */
/* ------------------------------------------------------------------ */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const URL_RE = /^https?:\/\/[^\s.]+\.[^\s]{2,}$/;

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const STRENGTH = [
  { label: "Too short", tone: "bg-destructive", text: "text-destructive" },
  { label: "Weak", tone: "bg-destructive", text: "text-destructive" },
  { label: "Medium", tone: "bg-amber-500", text: "text-amber-500" },
  { label: "Strong", tone: "bg-brand", text: "text-brand" },
  { label: "Strong", tone: "bg-brand", text: "text-brand" },
] as const;

/* ------------------------------------------------------------------ */
/* form                                                                */
/* ------------------------------------------------------------------ */

const INITIAL = {
  fullName: "",
  email: "",
  mobile: "",
  company: "",
  website: "",
  role: "",
  gst: "",
  country: "",
  state: "",
  city: "",
  pincode: "",
  password: "",
  confirmPassword: "",
};

type Values = typeof INITIAL;
type FieldKey = keyof Values;

export function PublisherForm() {
  const [values, setValues] = useState<Values>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [traffic, setTraffic] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");
  const [needsVerification, setNeedsVerification] = useState(true);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const set = (key: FieldKey, v: string) =>
    setValues((prev) => {
      const next = { ...prev, [key]: v };
      if (key === "country") {
        next.state = "";
        next.city = "";
      }
      if (key === "state") next.city = "";
      return next;
    });

  const blur = (key: FieldKey) => setTouched((t) => ({ ...t, [key]: true }));

  const errors = useMemo(() => {
    const e: Partial<Record<FieldKey, string>> = {};
    if (!values.fullName.trim()) e.fullName = "Full name is required.";
    if (!values.email.trim()) e.email = "Business email is required.";
    else if (!EMAIL_RE.test(values.email.trim())) e.email = "Enter a valid email address.";
    if (!values.mobile.trim()) e.mobile = "Mobile number is required.";
    else if (values.mobile.replace(/\D/g, "").length < 8) e.mobile = "Enter a valid mobile number.";
    if (!values.company.trim()) e.company = "Company name is required.";
    if (values.website.trim() && !URL_RE.test(values.website.trim()))
      e.website = "Use a full URL, e.g. https://yourdomain.com";
    if (!values.role) e.role = "Select an option.";
    if (!values.country) e.country = "Select your country.";
    if (!values.state) e.state = "Select your state.";
    if (!values.city) e.city = "Select your city.";
    if (!values.pincode.trim()) e.pincode = "Pincode is required.";
    else if (!/^[A-Za-z0-9\s-]{4,10}$/.test(values.pincode.trim()))
      e.pincode = "Enter a valid pincode.";
    if (!values.password) e.password = "Password is required.";
    else if (values.password.length < 8) e.password = "Use at least 8 characters.";
    if (!values.confirmPassword) e.confirmPassword = "Confirm your password.";
    else if (values.confirmPassword !== values.password)
      e.confirmPassword = "Passwords do not match.";
    return e;
  }, [values]);

  const stateOptions = statesOf(values.country);
  const cityOptions = citiesOf(values.country, values.state);

  const stateOf = (key: FieldKey): FieldState => {
    if (errors[key]) return touched[key] ? "error" : "idle";
    return values[key].trim() ? "valid" : "idle";
  };
  const msgOf = (key: FieldKey) => (touched[key] ? errors[key] : undefined);

  const stepDone = [
    !errors.fullName && !errors.email && !errors.mobile && !errors.company && !errors.website,
    !errors.role && traffic.length > 0,
    !errors.country && !errors.state && !errors.city && !errors.pincode,
    !errors.password && !errors.confirmPassword,
  ];
  const activeStep = stepDone.findIndex((d) => !d);
  const currentStep = activeStep === -1 ? STEPS.length : activeStep + 1;
  const completion = Math.round((stepDone.filter(Boolean).length / STEPS.length) * 100);

  const pwScore = scorePassword(values.password);
  const strength = STRENGTH[values.password.length === 0 ? 0 : pwScore];

  const canSubmit =
    Object.keys(errors).length === 0 && traffic.length > 0 && agreed && Boolean(turnstileToken);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    if (!canSubmit) {
      setTouched(
        Object.keys(INITIAL).reduce(
          (acc, k) => ({ ...acc, [k]: true }),
          {} as Record<FieldKey, boolean>,
        ),
      );
      if (!turnstileToken) setTurnstileError("Please complete the security check to continue.");
      toast.error("Please complete all required fields", {
        description: "Highlighted fields need your attention.",
      });
      return;
    }

    setStatus("loading");
    const email = values.email.trim().toLowerCase();

    try {
      const supabase = getSupabase();
      const profilePayload = {
        full_name: values.fullName.trim(),
        email,
        mobile: values.mobile.trim(),
        company_name: values.company.trim(),
        website: values.website.trim() || null,
        role: values.role,
        traffic_sources: traffic,
        gst_number: values.gst.trim() || null,
        country: values.country,
        state: values.state,
        city: values.city,
        pincode: values.pincode.trim(),
        account_type: "publisher" as const,
      };

      const { data, error } = await supabase.auth.signUp({
        email,
        password: values.password,
        options: {
          emailRedirectTo: getAuthRedirectUrl("/"),
          data: profilePayload,
          captchaToken: turnstileToken ?? undefined,
        },
      });

      if (error) throw error;

      // The profile row is created server-side by a signup trigger from the
      // metadata above. When email confirmation is off we already have a
      // session, so we can safely reconcile the row as the signed-in user.
      const userId = data.user?.id;
      if (userId && data.session) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ id: userId, ...profilePayload }, { onConflict: "id" });
        if (profileError) {
          console.error("[profiles] insert failed:", profileError.message);
          toast.error("Profile could not be saved", {
            description: `${profileError.message} — your login was created, our team will complete your profile.`,
          });
        }
      }

      setSubmittedEmail(email);
      setNeedsVerification(!data.session);
      setStatus("done");
      toast.success(data.session ? "Account created" : "Verify your email to continue", {
        description: data.session
          ? "Welcome to CrosX."
          : `We sent a confirmation link to ${email}.`,
      });
    } catch (err) {
      setStatus("idle");
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error("Registration failed", { description: message });
    }
  };

  const toggleTraffic = (source: string) =>
    setTraffic((prev) =>
      prev.includes(source) ? prev.filter((s) => s !== source) : [...prev, source],
    );

  if (status === "done") {
    return (
      <motion.section
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: EASE_LUX }}
        className="glass relative overflow-hidden rounded-3xl p-7 shadow-lux sm:p-10"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-brand/15 blur-[120px]"
        />
        <div className="relative flex flex-col items-center text-center">
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5, ease: EASE_LUX }}
            className="relative inline-flex size-20 items-center justify-center rounded-2xl border border-brand/40 bg-brand/10 text-brand shadow-[0_20px_60px_-24px_var(--brand)]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 animate-ping rounded-2xl bg-brand/10"
              style={{ animationDuration: "2.6s" }}
            />
            {needsVerification ? (
              <Mail className="size-9" aria-hidden="true" />
            ) : (
              <Check className="size-9" aria-hidden="true" />
            )}
          </motion.span>

          <span className="mt-6 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
            {needsVerification ? "Verify your email" : "Account created"}
          </span>

          <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {needsVerification ? (
              <>
                Check your <span className="text-brand">inbox</span>
              </>
            ) : (
              <>
                Welcome to <span className="text-brand">CrosX</span>
              </>
            )}
          </h2>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            {needsVerification ? (
              <>
                We&apos;ve sent a confirmation link to{" "}
                <span className="font-semibold text-foreground">{submittedEmail}</span>. Please
                verify your email address before signing in to your publisher dashboard.
              </>
            ) : (
              <>
                Your publisher account is ready. Our partnerships team will reach out with your
                onboarding details shortly.
              </>
            )}
          </p>

          {needsVerification && (
            <div className="mt-7 grid w-full max-w-md gap-3 text-left">
              {[
                "Open the email from CrosX and click “Confirm your account”.",
                "Return here and sign in with your business email and password.",
                "Didn’t receive it? Check spam or promotions — links expire in 24 hours.",
              ].map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.09, duration: 0.5, ease: EASE_LUX }}
                  className="flex items-start gap-3 rounded-2xl border border-hairline bg-background/40 px-4 py-3"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/15 text-[11px] font-bold text-brand">
                    {i + 1}
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{line}</span>
                </motion.div>
              ))}
            </div>
          )}

          <p className="mt-7 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-3.5 text-brand" aria-hidden="true" />
            Your information is encrypted and never shared.
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      noValidate
      className="glass relative overflow-hidden rounded-3xl p-5 shadow-lux sm:p-7 lg:p-8"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-brand/10 blur-[110px]"
      />

      <header className="relative grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Create Your <span className="text-brand">Publisher</span> Account
          </h2>
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            Fill the details below to get started with CrosX.
          </p>
        </div>
        <span className="shrink-0 rounded-full border border-brand/40 bg-brand/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand">
          Publisher
        </span>
      </header>

      {/* Multi-step progress indicator */}
      <nav aria-label="Registration progress" className="relative mt-6">
        <ol className="grid grid-cols-4 gap-2 sm:gap-3">
          {STEPS.map((s, i) => {
            const done = stepDone[i];
            const active = currentStep === s.id && !done;
            return (
              <li key={s.id} className="flex min-w-0 flex-col gap-2">
                <div className="relative h-1 overflow-hidden rounded-full bg-hairline">
                  <motion.span
                    initial={false}
                    animate={{ scaleX: done ? 1 : active ? 0.45 : 0 }}
                    transition={{ duration: 0.5, ease: EASE_LUX }}
                    className="absolute inset-0 origin-left rounded-full bg-brand"
                  />
                </div>
                <div className="flex min-w-0 items-center gap-1.5">
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border text-[10px] font-bold transition-colors duration-300",
                      done
                        ? "border-brand bg-brand text-primary-foreground"
                        : active
                          ? "border-brand text-brand"
                          : "border-input text-muted-foreground",
                    )}
                  >
                    {done ? <Check className="size-3" aria-hidden="true" /> : s.id}
                  </span>
                  <span
                    className={cn(
                      "truncate text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300 sm:text-[11px]",
                      done || active ? "text-foreground" : "text-muted-foreground",
                    )}
                  >
                    <span className="sm:hidden">{s.short}</span>
                    <span className="hidden sm:inline">{s.label}</span>
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[11px] font-medium text-muted-foreground">
          {completion}% complete · Step {Math.min(currentStep, STEPS.length)} of {STEPS.length}
        </p>
      </nav>

      <div className="relative mt-6 flex flex-col gap-4">
        <SectionCard
          step={1}
          title="Personal Information"
          icon={User}
          complete={stepDone[0]}
          delay={0.05}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FloatingInput
              id="fullName"
              label="Full Name"
              required
              icon={User}
              autoComplete="name"
              placeholder="Enter your full name"
              value={values.fullName}
              onValueChange={(v) => set("fullName", v)}
              onBlur={() => blur("fullName")}
              state={stateOf("fullName")}
              message={msgOf("fullName")}
            />
            <FloatingInput
              id="email"
              label="Business Email"
              required
              icon={Mail}
              type="email"
              autoComplete="email"
              placeholder="you@company.com"
              value={values.email}
              onValueChange={(v) => set("email", v)}
              onBlur={() => blur("email")}
              state={stateOf("email")}
              message={msgOf("email")}
            />
            <FloatingInput
              id="mobile"
              label="Mobile Number"
              required
              icon={Phone}
              type="tel"
              autoComplete="tel"
              placeholder="+91 00000 00000"
              value={values.mobile}
              onValueChange={(v) => set("mobile", v)}
              onBlur={() => blur("mobile")}
              state={stateOf("mobile")}
              message={msgOf("mobile")}
            />
            <FloatingInput
              id="company"
              label="Company Name"
              required
              icon={Building2}
              autoComplete="organization"
              placeholder="Enter your company name"
              value={values.company}
              onValueChange={(v) => set("company", v)}
              onBlur={() => blur("company")}
              state={stateOf("company")}
              message={msgOf("company")}
            />
            <FloatingInput
              id="website"
              label="Website"
              optional
              icon={Globe}
              type="url"
              placeholder="https://yourdomain.com"
              className="sm:col-span-2"
              value={values.website}
              onValueChange={(v) => set("website", v)}
              onBlur={() => blur("website")}
              state={stateOf("website")}
              message={msgOf("website")}
            />
          </div>
        </SectionCard>

        <SectionCard
          step={2}
          title="Business Profile"
          icon={UserCog}
          complete={stepDone[1]}
          delay={0.1}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <FloatingSelect
              label="I am a"
              required
              icon={UserCog}
              value={values.role}
              onValueChange={(v) => {
                set("role", v);
                blur("role");
              }}
              options={ROLE_OPTIONS}
              placeholder="Select an option"
              state={stateOf("role")}
              message={msgOf("role")}
            />
            <FloatingInput
              id="gst"
              label="GST Number"
              optional
              icon={Receipt}
              placeholder="Enter GST number if any"
              value={values.gst}
              onValueChange={(v) => set("gst", v)}
              state={values.gst.trim() ? "valid" : "idle"}
            />
          </div>

          {/* Traffic source — selectable chips (multi-select) */}
          <div className="mt-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground">
                <Megaphone className="size-4 text-brand" aria-hidden="true" />
                Traffic Source
                <RequiredMark required />
              </p>
              <span className="text-[11px] font-medium text-muted-foreground">
                {traffic.length} selected
              </span>
            </div>
            <ul className="mt-3 flex flex-wrap gap-2">
              {TRAFFIC_SOURCES.map((source) => {
                const on = traffic.includes(source);
                return (
                  <li key={source}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleTraffic(source)}
                      className={cn(
                        "inline-flex min-h-10 items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-[transform,background-color,border-color,box-shadow] duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40",
                        on
                          ? "border-brand/60 bg-brand/15 text-brand shadow-[0_10px_28px_-16px_var(--brand)]"
                          : "border-input bg-surface/60 text-muted-foreground hover:border-brand/40 hover:text-foreground",
                      )}
                    >
                      {on && <Check className="size-3.5" aria-hidden="true" />}
                      {source}
                    </button>
                  </li>
                );
              })}
            </ul>
            {traffic.length === 0 && touched.role && (
              <p className="mt-2 flex items-center gap-1.5 px-1 text-[11px] font-medium text-destructive">
                <AlertTriangle className="size-3" aria-hidden="true" />
                Select at least one traffic source.
              </p>
            )}
          </div>
        </SectionCard>

        <SectionCard
          step={3}
          title="Address Information"
          icon={MapPin}
          complete={stepDone[2]}
          delay={0.15}
        >
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <CountryCombobox
              value={values.country}
              onChange={(code) => {
                set("country", code);
                blur("country");
              }}
              state={values.country ? "valid" : touched.country ? "error" : "idle"}
              message={touched.country ? errors.country : undefined}
            />
            <FloatingSelect
              label="State"
              required
              icon={MapPin}
              value={values.state}
              onValueChange={(v) => {
                set("state", v);
                blur("state");
              }}
              options={stateOptions}
              placeholder={values.country ? "Select state" : "Select country first"}
              disabled={!values.country}
              state={stateOf("state")}
              message={msgOf("state")}
            />
            <FloatingSelect
              label="City"
              required
              icon={Building2}
              value={values.city}
              onValueChange={(v) => {
                set("city", v);
                blur("city");
              }}
              options={cityOptions}
              placeholder={values.state ? "Select city" : "Select state first"}
              disabled={!values.state}
              state={stateOf("city")}
              message={msgOf("city")}
            />
            <FloatingInput
              id="pincode"
              label="Pincode"
              required
              icon={Hash}
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="Enter pincode"
              value={values.pincode}
              onValueChange={(v) => set("pincode", v)}
              onBlur={() => blur("pincode")}
              state={stateOf("pincode")}
              message={msgOf("pincode")}
            />
          </div>
        </SectionCard>

        <SectionCard
          step={4}
          title="Account Security"
          icon={Lock}
          complete={stepDone[3]}
          delay={0.2}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <FloatingInput
                id="password"
                label="Password"
                required
                icon={Lock}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a strong password"
                inputClassName="pr-11"
                value={values.password}
                onValueChange={(v) => set("password", v)}
                onBlur={() => blur("password")}
                state={stateOf("password")}
                message={msgOf("password")}
                trailing={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors duration-200 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                }
              />
              {/* Live password strength */}
              <AnimatePresence initial={false}>
                {values.password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: EASE_LUX }}
                    className="px-1"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hairline">
                        <motion.span
                          initial={false}
                          animate={{ scaleX: Math.max(pwScore, 1) / 4 }}
                          transition={{ duration: 0.4, ease: EASE_LUX }}
                          className={cn("block h-full origin-left rounded-full", strength.tone)}
                        />
                      </div>
                      <span
                        className={cn(
                          "text-[11px] font-bold uppercase tracking-[0.12em]",
                          strength.text,
                        )}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Use 12+ characters with uppercase, numbers and a symbol.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <FloatingInput
              id="confirmPassword"
              label="Confirm Password"
              required
              icon={ShieldCheck}
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              inputClassName="pr-11"
              value={values.confirmPassword}
              onValueChange={(v) => set("confirmPassword", v)}
              onBlur={() => blur("confirmPassword")}
              state={stateOf("confirmPassword")}
              message={msgOf("confirmPassword")}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors duration-200 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              }
            />
          </div>
        </SectionCard>

        {/* Consent + verification */}
        <div className="flex flex-col gap-4">
          <label className="group plate flex cursor-pointer items-start gap-3 rounded-xl p-4 text-xs leading-relaxed text-muted-foreground transition-colors duration-300 hover:border-brand/40 sm:text-sm">
            <span
              className={cn(
                "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-[background-color,border-color] duration-200",
                agreed
                  ? "border-brand bg-brand text-primary-foreground"
                  : "border-input bg-surface/60 group-hover:border-brand/50",
              )}
            >
              {agreed && <Check className="size-3.5" aria-hidden="true" />}
            </span>
            <input
              type="checkbox"
              className="sr-only"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>
              I agree to the{" "}
              <a
                href="/terms"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-brand underline-offset-4 transition-colors duration-200 hover:underline"
              >
                Terms &amp; Conditions
              </a>
              ,{" "}
              <a
                href="/privacy"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-brand underline-offset-4 transition-colors duration-200 hover:underline"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="/payment-policy"
                onClick={(e) => e.stopPropagation()}
                className="font-semibold text-brand underline-offset-4 transition-colors duration-200 hover:underline"
              >
                Payment Policy
              </a>{" "}
              of CrosX.
            </span>
          </label>

          {/* Cloudflare Turnstile */}
          <div className="flex flex-col gap-2">
            <Turnstile
              siteKey={TURNSTILE_SITE_KEY}
              onVerify={(token) => {
                setTurnstileToken(token);
                setTurnstileError(null);
              }}
              onExpire={() => setTurnstileToken(null)}
              onError={setTurnstileError}
              className="w-full max-w-sm"
            />
            {/* Token kept for future server-side verification */}
            <input
              type="hidden"
              name="cf-turnstile-response"
              value={turnstileToken ?? ""}
              readOnly
            />
            <AnimatePresence initial={false}>
              {turnstileError && (
                <motion.div
                  role="alert"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25, ease: EASE_LUX }}
                  className="flex w-full max-w-sm items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 px-3.5 py-3 text-xs font-medium text-destructive"
                >
                  <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                  <span>{turnstileError}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          type="submit"
          disabled={status !== "idle"}
          aria-disabled={!canSubmit}
          className={cn(
            "sheen group relative mt-1 inline-flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-2xl px-6 text-[15px] font-bold transition-[transform,background-color,box-shadow,opacity] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-soft focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "bg-brand text-primary-foreground shadow-[0_16px_40px_-18px_var(--brand)] hover:-translate-y-0.5 hover:bg-brand-soft hover:shadow-[0_22px_54px_-18px_var(--brand)] active:scale-[0.99]",
            !canSubmit && status === "idle" && "opacity-60 hover:translate-y-0",
            status !== "idle" && "pointer-events-none",
          )}
        >
          {status === "loading" && <Loader2 className="size-5 animate-spin" aria-hidden="true" />}
          {status === "idle" ? "Create Account" : "Creating account…"}
          {status === "idle" && (
            <ArrowRight
              className="size-5 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />
          )}
        </button>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="size-3.5 text-brand" aria-hidden="true" />
          We respect your privacy — your information will never be shared.
        </p>
      </div>
    </form>
  );
}

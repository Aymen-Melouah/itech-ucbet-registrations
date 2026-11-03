"use client";

import Image from "next/image";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { FACULTIES, LEVELS } from "@/data/faculties";

/** Set NEXT_PUBLIC_FORM_ENDPOINT to post applications somewhere (Formspree, Apps Script, your API…). */
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

type Key = "name" | "email" | "phone" | "faculty" | "department" | "level" | "letter";
type Values = Record<Key, string>;
type Errors = Partial<Record<Key, boolean>>;
type Status = "idle" | "sending" | "error" | "sent";
type Language = "en" | "ar";

const ORDER: Key[] = ["name", "email", "phone", "faculty", "department", "level", "letter"];
const EMPTY: Values = { name: "", email: "", phone: "", faculty: "", department: "", level: "", letter: "" };

const rules: Record<Key, (v: Values) => boolean> = {
  name: (v) => v.name.trim().split(/\s+/).filter((s) => s.length > 1).length >= 2,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()),
  phone: (v) => /^(?:\+213|00213|0)[567]\d{8}$/.test(v.phone.replace(/[\s.\-()]/g, "")),
  faculty: (v) => !!v.faculty,
  department: (v) => !!v.department,
  level: (v) => !!v.level,
  letter: (v) => v.letter.trim().length >= 100,
};

const copy = {
  en: {
    messages: {
      name: "Enter your first and last name.",
      email: "Enter a valid email address.",
      phone: "Enter an Algerian mobile number, like 0550 12 34 56.",
      faculty: "Choose your faculty.",
      department: "Choose your department.",
      level: "Pick your current level.",
      letter: "Write at least 100 characters so we can get to know you.",
    },
    name: "Full name",
    namePlaceholder: "Your first and last name",
    email: "Email",
    phone: "Phone number",
    faculty: "Faculty",
    chooseFaculty: "Choose your faculty",
    department: "Department",
    chooseDepartment: "Choose your department",
    chooseFacultyFirst: "Choose a faculty first",
    level: "Level",
    letter: "Motivation letter",
    letterHint: "Why do you want to join i-Tech, and what would you like to learn or build with us?",
    letterPlaceholder: "Write at least 100 characters…",
    sending: "Sending application…",
    error: "Couldn’t send. Try again",
    send: "Send application",
    privacy: "We only use your details to contact you about i-Tech.",
    sentTitle: "Application sent",
    sentMessage: (name: string, email: string) => `Thanks, ${name}. We’ll reach out to ${email} once the club team has read your application.`,
    sendAnother: "Send another application",
  },
  ar: {
    messages: {
      name: "أدخل اسمك الأول واسم العائلة.",
      email: "أدخل بريدًا إلكترونيًا صحيحًا.",
      phone: "أدخل رقم هاتف جوال جزائريًا، مثل 0550 12 34 56.",
      faculty: "اختر الكلية.",
      department: "اختر القسم.",
      level: "اختر مستواك الدراسي الحالي.",
      letter: "اكتب 100 حرف على الأقل لنتعرف عليك أكثر.",
    },
    name: "الاسم الكامل",
    namePlaceholder: "اسمك الأول واسم العائلة",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    faculty: "الكلية",
    chooseFaculty: "اختر الكلية",
    department: "القسم",
    chooseDepartment: "اختر القسم",
    chooseFacultyFirst: "اختر الكلية أولًا",
    level: "المستوى الدراسي",
    letter: "رسالة التحفيز",
    letterHint: "لماذا تريد الانضمام إلى i-Tech؟ وماذا تود أن تتعلم أو تبني معنا؟",
    letterPlaceholder: "اكتب 100 حرف على الأقل…",
    sending: "جارٍ إرسال الطلب…",
    error: "تعذر الإرسال. حاول مرة أخرى",
    send: "إرسال الطلب",
    privacy: "نستخدم معلوماتك فقط للتواصل معك بشأن i-Tech.",
    sentTitle: "تم إرسال الطلب",
    sentMessage: (name: string, email: string) => `شكرًا لك، ${name}. سنتواصل معك عبر ${email} بعد أن يقرأ فريق النادي طلبك.`,
    sendAnother: "إرسال طلب آخر",
  },
};

const facultyArabic: Record<string, string> = {
  "Faculté des Sciences et de la Technologie": "كلية العلوم والتكنولوجيا",
  "Faculté des Sciences de la Nature et de la Vie": "كلية علوم الطبيعة والحياة",
  "Faculté des Sciences Économiques, Commerciales et des Sciences de Gestion": "كلية العلوم الاقتصادية والتجارية وعلوم التسيير",
  "Faculté des Lettres et des Langues": "كلية الآداب واللغات",
  "Faculté de Droit et des Sciences Politiques": "كلية الحقوق والعلوم السياسية",
  "Faculté des Sciences Humaines et Sociales": "كلية العلوم الإنسانية والاجتماعية",
  "Annexe de l’École Normale Supérieure (formation des professeurs)": "ملحقة المدرسة العليا للأساتذة (تكوين الأساتذة)",
};

const departmentArabic: Record<string, string> = {
  Informatique: "الإعلام الآلي",
  Mathématiques: "الرياضيات",
  "Mathématiques et Informatique": "الرياضيات والإعلام الآلي",
  Physique: "الفيزياء",
  Chimie: "الكيمياء",
  Biologie: "علم الأحياء",
  "Sciences Agronomiques": "العلوم الفلاحية",
  "Sciences Vétérinaires": "العلوم البيطرية",
  "Sciences de la Mer": "علوم البحار",
  "Sciences Économiques": "العلوم الاقتصادية",
  "Sciences Commerciales": "العلوم التجارية",
  "Sciences de Gestion": "علوم التسيير",
  "Sciences Financières et Comptabilité": "العلوم المالية والمحاسبة",
  "Langue et Littérature Arabes": "اللغة والأدب العربي",
  "Langue et Littérature Françaises": "اللغة والأدب الفرنسي",
  "Langue et Littérature Anglaises": "اللغة والأدب الإنجليزي",
  Droit: "الحقوق",
  "Sciences Politiques": "العلوم السياسية",
  "Sciences Humaines": "العلوم الإنسانية",
  "Sciences Sociales": "العلوم الاجتماعية",
  "Professeur de l’enseignement primaire – Langue arabe": "أستاذ التعليم الابتدائي – اللغة العربية",
  "Professeur de l’enseignement primaire – Langue française": "أستاذ التعليم الابتدائي – اللغة الفرنسية",
  "Professeur de l’enseignement primaire – Langue anglaise": "أستاذ التعليم الابتدائي – اللغة الإنجليزية",
  "Professeur de l’enseignement moyen – Langue arabe": "أستاذ التعليم المتوسط – اللغة العربية",
  "Professeur de l’enseignement moyen – Langue française": "أستاذ التعليم المتوسط – اللغة الفرنسية",
  "Professeur de l’enseignement moyen – Langue anglaise": "أستاذ التعليم المتوسط – اللغة الإنجليزية",
  "Professeur de l’enseignement secondaire – Informatique": "أستاذ التعليم الثانوي – الإعلام الآلي",
  "Professeur de l’enseignement secondaire – Sciences naturelles et de la vie": "أستاذ التعليم الثانوي – علوم الطبيعة والحياة",
};

/* ---------- shared Tailwind class strings ---------- */
const control =
  "w-full rounded-[14px] border border-line bg-black/65 px-4 font-[inherit] text-[17px] text-white outline-none " +
  "transition-[box-shadow,border-color] duration-150 motion-reduce:transition-none placeholder:text-white/40 " +
  "hover:border-white focus-visible:border-white focus-visible:shadow-[0_0_0_1px_#fff,0_0_0_5px_rgba(255,255,255,.22)] " +
  "aria-[invalid=true]:border-2 aria-[invalid=true]:border-dashed aria-[invalid=true]:pl-[15px]";
const input = `${control} h-14`;
const select =
  `${control} h-14 cursor-pointer appearance-none truncate bg-chevron bg-[position:right_18px_center] bg-no-repeat pr-[46px] ` +
  "invalid:text-white/50 disabled:cursor-not-allowed disabled:border-dashed disabled:opacity-50 [&>option]:bg-black [&>option]:text-white";
const label = "text-base font-medium";
const errCls = "text-sm before:font-bold before:content-['!_']";

function Field({ htmlFor, text, hint, error, children }: { htmlFor: string; text: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="grid min-w-0 gap-2">
      <label htmlFor={htmlFor} className={label}>
        {text}
      </label>
      {hint && <div className="-mt-0.5 text-sm font-light text-dim">{hint}</div>}
      {children}
      {error && (
        <div id={`e-${htmlFor}`} role="alert" className={errCls}>
          {error}
        </div>
      )}
    </div>
  );
}

export default function MembershipForm() {
  const [language, setLanguage] = useState<Language>("en");
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const refs = useRef<Partial<Record<Key, HTMLElement | null>>>({});
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "sent") doneRef.current?.focus();
  }, [status]);

  const validate = (key: Key, v: Values) => {
    const ok = rules[key](v);
    setErrors((e) => ({ ...e, [key]: !ok }));
    return ok;
  };

  const update = (key: Key, value: string) => {
    const next: Values = { ...values, [key]: value };
    if (key === "faculty") next.department = "";
    setValues(next);

    const live = key === "faculty" || key === "department" || key === "level" || errors[key];
    if (live) validate(key, next);
    if (key === "faculty") setErrors((e) => ({ ...e, department: false }));
  };

  const blur = (key: Key) => {
    if (values[key]) validate(key, values);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    let first: Key | undefined;
    for (const k of ORDER) {
      const bad = !rules[k](values);
      next[k] = bad;
      if (bad && !first) first = k;
    }
    setErrors(next);
    if (first) {
      const el = refs.current[first];
      el?.focus({ preventScroll: true });
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    setStatus("sending");
    try {
      if (FORM_ENDPOINT) {
        const r = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            phone: values.phone.trim(),
            faculty: values.faculty,
            department: values.department,
            level: values.level,
            letter: values.letter.trim(),
            sentAt: new Date().toISOString(),
          }),
        });
        if (!r.ok) throw new Error("bad status");
      }
      setStatus("sent");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setStatus("error");
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setStatus("idle");
    requestAnimationFrame(() => refs.current.name?.focus());
  };

  const bind = (key: Key) => ({
    id: key,
    name: key,
    value: values[key],
    "aria-invalid": errors[key] ? (true as const) : undefined,
    "aria-describedby": errors[key] ? `e-${key}` : undefined,
    ref: (el: HTMLElement | null) => {
      refs.current[key] = el;
    },
  });

  const departments = values.faculty ? FACULTIES[values.faculty] ?? [] : [];
  const t = copy[language];
  const displayFaculty = (faculty: string) => language === "ar" ? facultyArabic[faculty] ?? faculty : faculty;
  const displayDepartment = (department: string) => language === "ar" ? departmentArabic[department] ?? department : department;

  return (
    <section dir={language === "ar" ? "rtl" : "ltr"} lang={language} className={`rounded-[22px] border border-white bg-black/80 p-[clamp(20px,4.5vw,40px)] ${language === "ar" ? "font-arabic" : ""}`}>
      <div className="mb-7 flex justify-end gap-2" dir="ltr">
        {(["en", "ar"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            aria-pressed={language === option}
            className={`h-9 min-w-12 rounded-lg border px-3 text-sm font-medium transition-colors ${language === option ? "bg-white text-black" : "border-line bg-transparent text-white hover:border-white"}`}
          >
            {option.toUpperCase()}
          </button>
        ))}
      </div>
      {status === "sent" ? (
        <div ref={doneRef} tabIndex={-1} role="status" aria-live="polite" className="text-left outline-none">
          <Image src="/checking-mark.png" alt="" width={128} height={128} priority className="mb-[18px] h-auto w-[128px]" />
          <h2 className="mb-2.5 text-[clamp(34px,7vw,52px)] font-bold leading-none tracking-[-0.03em]">{t.sentTitle}</h2>
          <p className="mb-[22px] max-w-[42ch] text-lg font-light text-dim">
            {t.sentMessage(values.name.trim().split(/\s+/)[0], values.email.trim())}
          </p>
          <button
            type="button"
            onClick={reset}
            className="h-[52px] cursor-pointer rounded-[14px] border border-white bg-transparent px-[22px] font-[inherit] text-[17px] font-medium text-white hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            {t.sendAnother}
          </button>
        </div>
      ) : (
        <form noValidate onSubmit={onSubmit} className="grid gap-[26px]">
          <Field htmlFor="name" text={t.name} error={errors.name ? t.messages.name : undefined}>
            <input {...bind("name")} type="text" autoComplete="name" placeholder={t.namePlaceholder} className={input}
              onChange={(e) => update("name", e.target.value)} onBlur={() => blur("name")} />
          </Field>

          <div className="grid grid-cols-2 gap-[26px] max-[620px]:grid-cols-1">
            <Field htmlFor="email" text={t.email} error={errors.email ? t.messages.email : undefined}>
              <input {...bind("email")} type="email" autoComplete="email" inputMode="email" placeholder="name@example.com" className={input}
                onChange={(e) => update("email", e.target.value)} onBlur={() => blur("email")} />
            </Field>
            <Field htmlFor="phone" text={t.phone} error={errors.phone ? t.messages.phone : undefined}>
              <input {...bind("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="0550 12 34 56" className={input}
                onChange={(e) => update("phone", e.target.value)} onBlur={() => blur("phone")} />
            </Field>
          </div>

          <Field htmlFor="faculty" text={t.faculty} error={errors.faculty ? t.messages.faculty : undefined}>
            <select {...bind("faculty")} required className={select} onChange={(e) => update("faculty", e.target.value)}>
              <option value="" disabled>
                {t.chooseFaculty}
              </option>
              {Object.keys(FACULTIES).map((f) => (
                <option key={f} value={f}>
                  {displayFaculty(f)}
                </option>
              ))}
            </select>
          </Field>

          <Field htmlFor="department" text={t.department} error={errors.department ? t.messages.department : undefined}>
            <select {...bind("department")} required disabled={!values.faculty} className={select} onChange={(e) => update("department", e.target.value)}>
              <option value="" disabled>
                {values.faculty ? t.chooseDepartment : t.chooseFacultyFirst}
              </option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {displayDepartment(d)}
                </option>
              ))}
            </select>
          </Field>

          <fieldset className="grid min-w-0 gap-2 border-0 p-0" aria-describedby={errors.level ? "e-level" : undefined}>
            <legend className={`${label} p-0`}>{t.level}</legend>
            <div className="grid grid-cols-5 gap-2">
              {LEVELS.map((l, idx) => (
                <div key={l} className="relative">
                  <input
                    type="radio"
                    name="level"
                    id={`l-${l}`}
                    value={l}
                    checked={values.level === l}
                    onChange={() => update("level", l)}
                    ref={idx === 0 ? (el) => { refs.current.level = el; } : undefined}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor={`l-${l}`}
                    className={
                      "grid h-14 cursor-pointer place-items-center rounded-[14px] border border-line bg-black/65 text-[18px] font-medium " +
                      "transition-colors duration-100 motion-reduce:transition-none hover:border-white " +
                      "peer-checked:border-white peer-checked:bg-white peer-checked:text-black " +
                      "peer-focus-visible:shadow-[0_0_0_2px_#000,0_0_0_4px_#fff]" +
                      (errors.level ? " border-dashed" : "")
                    }
                  >
                    {l}
                  </label>
                </div>
              ))}
            </div>
            {errors.level && (
              <div id="e-level" role="alert" className={errCls}>
                {t.messages.level}
              </div>
            )}
          </fieldset>

          <Field
            htmlFor="letter"
            text={t.letter}
            hint={t.letterHint}
            error={errors.letter ? t.messages.letter : undefined}
          >
            <textarea
              {...bind("letter")}
              maxLength={1500}
              placeholder={t.letterPlaceholder}
              className={`${control} min-h-[210px] resize-y py-3.5 leading-[1.55]`}
              onChange={(e) => update("letter", e.target.value)}
              onBlur={() => blur("letter")}
            />
            <div className="justify-self-end text-sm font-light text-dim">
              <b className="font-medium text-white">{values.letter.length}</b> / 1500
            </div>
          </Field>

          <button
            type="submit"
            disabled={status === "sending"}
            className="h-[60px] cursor-pointer appearance-none rounded-2xl border border-white bg-white font-[inherit] text-[19px] font-semibold tracking-[-0.01em] text-black transition-colors duration-150 motion-reduce:transition-none hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-progress disabled:opacity-60"
          >
            {status === "sending" ? t.sending : status === "error" ? t.error : t.send}
          </button>
          <p className="m-0 text-center text-sm font-light text-dim">{t.privacy}</p>
        </form>
      )}
    </section>
  );
}

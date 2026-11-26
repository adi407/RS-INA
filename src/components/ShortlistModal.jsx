import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Send, X } from "lucide-react";
import useDialog from "../useDialog.js";
import { BTN_PRIMARY } from "./ui.jsx";
import { CallLine, ErrorSummary, Field, Honeypot, RequiredNote, SendError, SubmitButton, SuccessPanel, isEmail, isPhone, useForm } from "./form.jsx";
import { EMPLOYERS, REGIONS } from "../content.js";

const EMPTY = { company: "", name: "", email: "", phone: "", headcount: "", region: "middle-east", message: "", sectors: [] };

/**
 * "Request Talent Shortlist" dialog for one talent pool. Employers can tick more
 * sectors than the one they opened it from. Sends through /api/send.
 */
export default function ShortlistModal({ sectorId, onClose }) {
  const open = !!sectorId;
  const ref = useDialog(open, onClose);
  const sector = EMPLOYERS.sectors.find((s) => s.id === sectorId);

  const f = useForm({
    form: "shortlist",
    prefix: "sl",
    initial: EMPTY,
    validate: (v) => {
      const e = {};
      if (!v.company.trim()) e.company = "Enter your company name.";
      if (!v.name.trim()) e.name = "Enter the contact person’s name.";
      if (!isEmail(v.email)) e.email = "Enter an email address like name@example.com.";
      if (!isPhone(v.phone)) e.phone = "Enter a phone number with at least 8 digits.";
      if (!(Number(v.headcount) > 0)) e.headcount = "Enter how many workers you need.";
      if (!v.sectors.length) e.sectors = "Choose at least one sector.";
      return e;
    },
    build: (v) => {
      const names = EMPLOYERS.sectors.filter((s) => v.sectors.includes(s.id)).map((s) => s.title);
      return {
        subject: `Talent shortlist request — ${names.join(", ")}`,
        replyTo: v.email,
        fields: [
          ["Company", v.company],
          ["Contact person", v.name],
          ["Email", v.email],
          ["Phone", v.phone],
          ["Sectors", names.join(", ")],
          ["Headcount", v.headcount],
          ["Destination", REGIONS.find((r) => r.id === v.region)?.label],
          ["Requirement details", v.message],
        ],
      };
    },
  });

  // Each time the dialog opens, start from the sector it was opened for
  const { setValue, reset } = f;
  useEffect(() => {
    if (!open) return;
    reset();
    setValue("sectors", [sectorId]);
  }, [open, sectorId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const toggle = (id) => setValue("sectors", f.values.sectors.includes(id) ? f.values.sectors.filter((s) => s !== id) : [...f.values.sectors, id]);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[#0A0F1D]/60 backdrop-blur-sm motion-safe:animate-[fade-in_0.25s_ease-out]"
      />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortlist-title"
        className="relative max-h-[92svh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-3xl bg-white shadow-2xl shadow-black/40 sm:rounded-3xl motion-safe:animate-[fade-up_0.35s_ease-out]"
      >
        <div className="relative h-32 overflow-hidden sm:h-36">
          <img src={sector.image} alt="" className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D]/90 via-[#0A0F1D]/50 to-[#0A0F1D]/20" />
          <div className="absolute inset-x-6 bottom-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-300">{sector.title} talent pool</p>
            <h2 id="shortlist-title" className="mt-1 font-display text-2xl font-bold tracking-tight">
              Request Talent Shortlist
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-black/30 text-white backdrop-blur transition-colors hover:bg-black/50"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>

        {f.status === "sent" ? (
          <div className="p-6 sm:p-8">
            <SuccessPanel
              title="Request sent — thank you."
              text="Our team will share pre-screened candidate profiles with you."
              sent={f.sent}
              action={
                <button type="button" onClick={onClose} className={`${BTN_PRIMARY} mt-7`}>
                  Done
                </button>
              }
            />
          </div>
        ) : (
          <form ref={f.formRef} noValidate onSubmit={f.onSubmit} className="relative space-y-4 p-6 sm:p-8">
            <p className="text-sm text-slate-700">Tell us your requirement and we’ll share pre-screened candidate profiles.</p>
            <RequiredNote />
            <ErrorSummary errors={f.errors} id={f.id} />
            <Honeypot inputRef={f.honeypot} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field {...f.field("company")} label="Company" required autoComplete="organization" />
              <Field {...f.field("name")} label="Contact person" required autoComplete="name" />
              <Field {...f.field("email")} label="Email" required type="email" autoComplete="email" />
              <Field {...f.field("phone")} label="Phone" required type="tel" autoComplete="tel" inputMode="tel" />
            </div>

            <fieldset aria-describedby={f.errors.sectors ? "sl-sectors-error" : undefined}>
              <legend className="mb-2 text-sm font-medium text-slate-800">
                Sectors <span aria-hidden className="text-rose-700">*</span>
              </legend>
              <div id="sl-sectors" tabIndex={-1} aria-invalid={!!f.errors.sectors} className="flex flex-wrap gap-2 outline-none">
                {EMPLOYERS.sectors.map((s) => {
                  const on = f.values.sectors.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus-within:ring-2 focus-within:ring-emerald-700/50 ${
                        on ? "border-emerald-700 bg-emerald-50 text-emerald-900" : "border-slate-500 text-slate-700 hover:border-emerald-700"
                      }`}
                    >
                      <input type="checkbox" checked={on} onChange={() => toggle(s.id)} className="size-4 accent-emerald-700" />
                      {s.title}
                    </label>
                  );
                })}
              </div>
              {f.errors.sectors && (
                <p id="sl-sectors-error" className="mt-1.5 text-sm text-rose-700">
                  {f.errors.sectors}
                </p>
              )}
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field {...f.field("headcount")} label="Headcount" required type="number" min={1} inputMode="numeric" />
              <Field as="select" id="sl-region" label="Destination" value={f.values.region} onChange={f.set("region")}>
                {REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </Field>
            </div>
            <Field {...f.field("message")} valid={false} as="textarea" rows={3} optional label="Requirement details" />
            {f.status === "error" && <SendError message={f.message} href={f.fallback()} />}
            <SubmitButton status={f.status} progress={f.progress}>
              Request shortlist
              <Send className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </SubmitButton>
            <CallLine />
          </form>
        )}
      </div>
    </div>,
    document.body
  );
}

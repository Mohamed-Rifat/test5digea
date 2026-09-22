"use client";

import Link from "next/link";
import {
    FormEvent,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import {
    AlertCircle,
    ArrowRight,
    BadgeCheck,
    Check,
    CheckCircle2,
    ChevronDown,
    Loader2,
    Mail,
    MapPin,
    MessageCircle,
    Search,
    Sparkles,
    TrendingUp,
    User,
    Users2,
    X,
} from "lucide-react";

import { useCategories } from "@/features/categories/hooks/useCategories";
import { submitVendorApplication } from "@/features/vendorApplications/api";
import { getApiErrorMessage } from "@/lib/error";
import { useLanguage } from "@/context/LanguageContext";
import {
    GOVERNORATES,
    governorateLabel,
    searchGovernorates,
    type Governorate,
} from "@/lib/governorates";

type FormState = {
    fullName: string;
    whatsappNumber: string;
    personalEmail: string;
    brandName: string;
    governorate: string;
};

type TouchedState = Partial<Record<keyof FormState | "categories", boolean>>;

export default function BecomeAVendorPage() {
    const { t, language, isArabic } = useLanguage();
    const { categories, loading: categoriesLoading } = useCategories();
    const activeCategories = categories.filter((category) => category.isActive);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState<FormState>({
        fullName: "",
        whatsappNumber: "",
        personalEmail: "",
        brandName: "",
        governorate: "",
    });
    const [touched, setTouched] = useState<TouchedState>({});
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        []
    );
    const [governorateOpen, setGovernorateOpen] = useState(false);
    const [governorateSearch, setGovernorateSearch] = useState("");
    const governorateRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                governorateRef.current &&
                !governorateRef.current.contains(event.target as Node)
            ) {
                setGovernorateOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    // `form.governorate` keeps storing the stable English key (unchanged
    // logic) — only the label shown to the person switches with language.
    const selectedGovernorate: Governorate | undefined = useMemo(
        () => GOVERNORATES.find((governorate) => governorate.en === form.governorate),
        [form.governorate]
    );

    const filteredGovernorates = useMemo(
        () => searchGovernorates(governorateSearch),
        [governorateSearch]
    );

    const validateField = (
        name: keyof FormState,
        value: string
    ): string => {
        const trimmed = value.trim();

        if (!trimmed) {
            switch (name) {
                case "fullName":
                    return t("becomeVendor.validation.fullNameRequired");
                case "whatsappNumber":
                    return t("becomeVendor.validation.whatsappRequired");
                case "personalEmail":
                    return t("becomeVendor.validation.emailRequired");
                case "brandName":
                    return t("becomeVendor.validation.brandNameRequired");
                case "governorate":
                    return t("becomeVendor.validation.governorateRequired");
            }
        }

        if (name === "fullName" && trimmed.length < 3) {
            return t("becomeVendor.validation.fullNameMin");
        }

        if (name === "brandName" && trimmed.length < 2) {
            return t("becomeVendor.validation.brandNameMin");
        }

        if (name === "personalEmail") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(trimmed)) {
                return t("becomeVendor.validation.emailInvalid");
            }
        }

        if (name === "whatsappNumber") {
            const digits = value.replace(/\D/g, "");

            if (digits.length < 8) {
                return t("becomeVendor.validation.whatsappInvalid");
            }
        }

        return "";
    };

    const fieldErrors = {
        fullName: validateField("fullName", form.fullName),
        whatsappNumber: validateField(
            "whatsappNumber",
            form.whatsappNumber
        ),
        personalEmail: validateField(
            "personalEmail",
            form.personalEmail
        ),
        brandName: validateField("brandName", form.brandName),
        governorate: validateField(
            "governorate",
            form.governorate
        ),
    };

    const isFormValid =
        Object.values(fieldErrors).every((value) => !value) &&
        selectedCategoryIds.length > 0 &&
        !categoriesLoading &&
        activeCategories.length > 0;

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleBlur = (name: keyof FormState) => {
        setTouched((previous) => ({
            ...previous,
            [name]: true,
        }));
    };

    const toggleCategory = (categoryId: string) => {
        setSelectedCategoryIds((previous) =>
            previous.includes(categoryId)
                ? previous.filter((id) => id !== categoryId)
                : [...previous, categoryId]
        );

        setTouched((previous) => ({
            ...previous,
            categories: true,
        }));

        setError("");
    };

    const selectGovernorate = (governorate: Governorate) => {
        setForm((previous) => ({
            ...previous,
            governorate: governorate.en,
        }));

        setTouched((previous) => ({
            ...previous,
            governorate: true,
        }));

        setGovernorateSearch("");
        setGovernorateOpen(false);
        setError("");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setError("");

        setTouched({
            fullName: true,
            whatsappNumber: true,
            personalEmail: true,
            brandName: true,
            governorate: true,
            categories: true,
        });

        if (!isFormValid) {
            return;
        }

        try {
            setLoading(true);

            await submitVendorApplication({
                fullName: form.fullName.trim(),
                whatsappNumber: form.whatsappNumber.trim(),
                personalEmail: form.personalEmail.trim(),
                brandName: form.brandName.trim(),
                categoryIds: selectedCategoryIds,
                governorate: form.governorate,
            });

            setSubmitted(true);
        } catch (err: unknown) {
            setError(
                getApiErrorMessage(
                    err,
                    t("becomeVendor.validation.submitError")
                )
            );
        } finally {
            setLoading(false);
        }
    };

    const inputBase =
        "w-full rounded-xl border bg-[#fcfaf8] px-4 py-3.5 text-sm text-[#30251f] outline-none transition-all placeholder:text-[#b3a9a2] focus:bg-white focus:ring-4";

    const getInputClass = (
        name: keyof FormState
    ) => {
        const hasError =
            touched[name] && Boolean(fieldErrors[name]);

        if (hasError) {
            return `${inputBase} border-[#d88f86] focus:border-[#c66e63] focus:ring-[#c66e63]/10`;
        }

        return `${inputBase} border-[#e7ded7] focus:border-[#b99a62] focus:ring-[#b99a62]/10`;
    };

    return (
        <main className="min-h-screen bg-[#f7f3ee] px-4 py-10 text-[#30251f] sm:px-6 sm:py-14 lg:px-8">
            <div className="mx-auto lg:max-w-10/12">

                <section className="mx-auto max-w-3xl text-center">

                    <h1 className="mt-5 font-serif text-3xl font-light leading-[1.15] tracking-tight text-[#30251f] sm:text-4xl lg:text-[46px]">
                        {t("becomeVendor.hero.titleLine1")}
                        <span className="block italic text-[#a47e43]">
                            {t("becomeVendor.hero.titleLine2")}
                        </span>
                    </h1>

                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#766d67] sm:text-[15px]">
                        {t("becomeVendor.hero.subtitle")}
                    </p>
                </section>

                <div className="mt-10 grid gap-6 lg:mt-12 2xl:grid-cols-[1.50fr_0.50fr] lg:items-start lg:gap-8">

                    <section className="overflow-hidden rounded-3xl border border-[#e8dfd8] bg-white shadow-[0_16px_60px_rgba(71,52,36,0.07)]">
                        {submitted ? (
                            <div className="flex min-h-130 flex-col items-center justify-center px-6 py-12 text-center sm:px-10">
                                <div className="relative">
                                    <div className="absolute inset-0 rounded-full bg-[#b8d99a]/30 blur-xl" />

                                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#eef7e7] text-[#4f7b2c] ring-8 ring-[#f7fbf3]">
                                        <CheckCircle2 size={30} strokeWidth={1.8} />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a47e43]">
                                        {t("becomeVendor.success.eyebrow")}
                                    </p>

                                    <h2 className="mt-2 font-serif text-2xl font-light text-[#30251f] sm:text-3xl">
                                        {t("becomeVendor.success.heading")}
                                    </h2>

                                    <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#766d67]">
                                        {t("becomeVendor.success.body")}
                                    </p>
                                </div>

                                <Link
                                    href="/"
                                    className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#ded3ca] bg-white px-6 py-3 text-xs font-semibold text-[#5f544d] transition hover:border-[#b99a62] hover:bg-[#faf7f4] hover:text-[#30251f]"
                                >
                                    {t("becomeVendor.success.backHome")}
                                    <ArrowRight size={14} className={isArabic ? "rotate-180" : ""} />
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="border-b border-[#eee7e1] px-5 py-5 sm:px-7">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf6f1] text-[#a47e43]">
                                                <MessageCircle size={18} strokeWidth={1.7} />
                                            </div>

                                            <div>
                                                <h2 className="text-sm font-semibold text-[#30251f]">
                                                    {t("becomeVendor.formCard.heading")}
                                                </h2>

                                                <p className="mt-0.5 text-[11px] text-[#958980]">
                                                    {t("becomeVendor.formCard.subheading")}
                                                </p>
                                            </div>
                                        </div>

                                        <span className="hidden rounded-full bg-[#faf6f1] px-3 py-1.5 text-[10px] font-medium text-[#8d796b] sm:block">
                                            {t("becomeVendor.formCard.step")}
                                        </span>
                                    </div>
                                </div>

                                <div className="px-5 py-6 sm:px-7 sm:py-7">
                                    {error && (
                                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#efd0cb] bg-[#fdf3f1] px-4 py-3.5 text-xs text-[#a3453c]">
                                            <AlertCircle
                                                size={16}
                                                className="mt-0.5 shrink-0"
                                            />

                                            <div className="min-w-0">
                                                <p className="font-semibold">{t("becomeVendor.error.heading")}</p>
                                                <p className="mt-0.5 leading-5">{error}</p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => setError("")}
                                                className="ml-auto shrink-0 rounded-md p-1 text-[#a3453c]/60 transition hover:bg-[#f4dedb] hover:text-[#a3453c]"
                                                aria-label={t("becomeVendor.error.dismiss")}
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <form
                                        onSubmit={handleSubmit}
                                        noValidate
                                        className="space-y-5"
                                    >
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="fullName"
                                                    className="mb-2 block text-xs font-semibold text-[#493b32]"
                                                >
                                                    {t("becomeVendor.fields.fullName.label")}
                                                    <span className="ml-1 text-[#b77b70]">*</span>
                                                </label>

                                                <div className="relative">
                                                    <User
                                                        size={16}
                                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a89c92]"
                                                        strokeWidth={1.7}
                                                    />

                                                    <input
                                                        id="fullName"
                                                        name="fullName"
                                                        type="text"
                                                        value={form.fullName}
                                                        onChange={handleChange}
                                                        onBlur={() => handleBlur("fullName")}
                                                        placeholder={t("becomeVendor.fields.fullName.placeholder")}
                                                        autoComplete="name"
                                                        className={`${getInputClass(
                                                            "fullName"
                                                        )} pl-11`}
                                                    />
                                                </div>

                                                {touched.fullName && fieldErrors.fullName && (
                                                    <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#b45b51]">
                                                        <AlertCircle size={11} />
                                                        {fieldErrors.fullName}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Brand */}
                                            <div>
                                                <label
                                                    htmlFor="brandName"
                                                    className="mb-2 block text-xs font-semibold text-[#493b32]"
                                                >
                                                    {t("becomeVendor.fields.brandName.label")}
                                                    <span className="ml-1 text-[#b77b70]">*</span>
                                                </label>

                                                <input
                                                    id="brandName"
                                                    name="brandName"
                                                    type="text"
                                                    value={form.brandName}
                                                    onChange={handleChange}
                                                    onBlur={() => handleBlur("brandName")}
                                                    placeholder={t("becomeVendor.fields.brandName.placeholder")}
                                                    autoComplete="organization"
                                                    className={getInputClass("brandName")}
                                                />

                                                {touched.brandName && fieldErrors.brandName && (
                                                    <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#b45b51]">
                                                        <AlertCircle size={11} />
                                                        {fieldErrors.brandName}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="whatsappNumber"
                                                    className="mb-2 block text-xs font-semibold text-[#493b32]"
                                                >
                                                    {t("becomeVendor.fields.whatsapp.label")}
                                                    <span className="ml-1 text-[#b77b70]">*</span>
                                                </label>

                                                <div className="relative">
                                                    <MessageCircle
                                                        size={16}
                                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a89c92]"
                                                        strokeWidth={1.7}
                                                    />

                                                    <input
                                                        id="whatsappNumber"
                                                        name="whatsappNumber"
                                                        type="tel"
                                                        value={form.whatsappNumber}
                                                        onChange={handleChange}
                                                        onBlur={() =>
                                                            handleBlur("whatsappNumber")
                                                        }
                                                        placeholder={t("becomeVendor.fields.whatsapp.placeholder")}
                                                        autoComplete="tel"
                                                        className={`${getInputClass(
                                                            "whatsappNumber"
                                                        )} pl-11`}
                                                    />
                                                </div>

                                                {touched.whatsappNumber &&
                                                    fieldErrors.whatsappNumber && (
                                                        <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#b45b51]">
                                                            <AlertCircle size={11} />
                                                            {fieldErrors.whatsappNumber}
                                                        </p>
                                                    )}
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="personalEmail"
                                                    className="mb-2 block text-xs font-semibold text-[#493b32]"
                                                >
                                                    {t("becomeVendor.fields.email.label")}
                                                    <span className="ml-1 text-[#b77b70]">*</span>
                                                </label>

                                                <div className="relative">
                                                    <Mail
                                                        size={16}
                                                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#a89c92]"
                                                        strokeWidth={1.7}
                                                    />

                                                    <input
                                                        id="personalEmail"
                                                        name="personalEmail"
                                                        type="email"
                                                        value={form.personalEmail}
                                                        onChange={handleChange}
                                                        onBlur={() =>
                                                            handleBlur("personalEmail")
                                                        }
                                                        placeholder={t("becomeVendor.fields.email.placeholder")}
                                                        autoComplete="email"
                                                        className={`${getInputClass(
                                                            "personalEmail"
                                                        )} pl-11`}
                                                    />
                                                </div>

                                                {touched.personalEmail &&
                                                    fieldErrors.personalEmail && (
                                                        <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#b45b51]">
                                                            <AlertCircle size={11} />
                                                            {fieldErrors.personalEmail}
                                                        </p>
                                                    )}
                                            </div>
                                        </div>

                                        <div ref={governorateRef}>
                                            <label
                                                htmlFor="governorate"
                                                className="mb-2 block text-xs font-semibold text-[#493b32]"
                                            >
                                                {t("becomeVendor.fields.governorate.label")}
                                                <span className="ml-1 text-[#b77b70]">*</span>
                                            </label>

                                            <div className="relative">
                                                <button
                                                    id="governorate"
                                                    type="button"
                                                    onClick={() =>
                                                        setGovernorateOpen((previous) => !previous)
                                                    }
                                                    className={`flex w-full items-center gap-3 rounded-xl border bg-[#fcfaf8] px-4 py-3.5 text-left text-sm outline-none transition-all hover:bg-white focus:ring-4 ${touched.governorate &&
                                                        fieldErrors.governorate
                                                        ? "border-[#d88f86] focus:border-[#c66e63] focus:ring-[#c66e63]/10"
                                                        : governorateOpen
                                                            ? "border-[#b99a62] bg-white ring-4 ring-[#b99a62]/10"
                                                            : "border-[#e7ded7]"
                                                        }`}
                                                >
                                                    <MapPin
                                                        size={16}
                                                        className="shrink-0 text-[#a89c92]"
                                                        strokeWidth={1.7}
                                                    />

                                                    <span
                                                        className={
                                                            form.governorate
                                                                ? "flex-1 text-[#30251f]"
                                                                : "flex-1 text-[#b3a9a2]"
                                                        }
                                                    >
                                                        {selectedGovernorate
                                                            ? governorateLabel(selectedGovernorate, language)
                                                            : t("becomeVendor.fields.governorate.placeholder")}
                                                    </span>

                                                    <ChevronDown
                                                        size={16}
                                                        className={`shrink-0 text-[#958980] transition-transform ${governorateOpen ? "rotate-180" : ""
                                                            }`}
                                                    />
                                                </button>

                                                {governorateOpen && (
                                                    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-2xl border border-[#e4dbd3] bg-white p-2 shadow-[0_18px_50px_rgba(48,37,31,0.15)]">
                                                        <div className="relative mb-2">
                                                            <Search
                                                                size={14}
                                                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a89c92]"
                                                            />

                                                            <input
                                                                type="text"
                                                                value={governorateSearch}
                                                                onChange={(event) =>
                                                                    setGovernorateSearch(
                                                                        event.target.value
                                                                    )
                                                                }
                                                                placeholder={t("becomeVendor.fields.governorate.searchPlaceholder")}
                                                                autoFocus
                                                                className="w-full rounded-xl border border-[#eee6df] bg-[#faf7f4] py-2.5 pl-9 pr-3 text-xs text-[#30251f] outline-none transition focus:border-[#c8ab79] focus:bg-white"
                                                            />
                                                        </div>

                                                        <div className="max-h-56 overflow-y-auto pr-1">
                                                            {filteredGovernorates.length === 0 ? (
                                                                <div className="px-3 py-8 text-center text-xs text-[#9a8f87]">
                                                                    {t("becomeVendor.fields.governorate.empty")}
                                                                </div>
                                                            ) : (
                                                                filteredGovernorates.map(
                                                                    (governorate) => {
                                                                        const selected =
                                                                            form.governorate ===
                                                                            governorate.en;

                                                                        return (
                                                                            <button
                                                                                key={governorate.en}
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    selectGovernorate(
                                                                                        governorate
                                                                                    )
                                                                                }
                                                                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-xs transition ${selected
                                                                                    ? "bg-[#30251f] font-semibold text-white"
                                                                                    : "text-[#554940] hover:bg-[#faf6f1]"
                                                                                    }`}
                                                                            >
                                                                                <span>{governorateLabel(governorate, language)}</span>

                                                                                {selected && (
                                                                                    <Check size={14} />
                                                                                )}
                                                                            </button>
                                                                        );
                                                                    }
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {touched.governorate &&
                                                fieldErrors.governorate && (
                                                    <p className="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-[#b45b51]">
                                                        <AlertCircle size={11} />
                                                        {fieldErrors.governorate}
                                                    </p>
                                                )}
                                        </div>

                                        <div>
                                            <div className="mb-3 flex items-end justify-between gap-3">
                                                <div>
                                                    <p className="text-xs font-semibold text-[#493b32]">
                                                        {t("becomeVendor.fields.categories.label")}
                                                        <span className="ml-1 text-[#b77b70]">*</span>
                                                    </p>

                                                    <p className="mt-1 text-[10px] leading-5 text-[#9a8f87]">
                                                        {t("becomeVendor.fields.categories.helper")}
                                                    </p>
                                                </div>

                                                {selectedCategoryIds.length > 0 && (
                                                    <span className="shrink-0 rounded-full bg-[#f5efe7] px-2.5 py-1 text-[9px] font-semibold text-[#8e7044]">
                                                        {t("becomeVendor.fields.categories.selectedCount", {
                                                            count: selectedCategoryIds.length,
                                                        })}
                                                    </span>
                                                )}
                                            </div>

                                            {categoriesLoading ? (
                                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                                        <div
                                                            key={item}
                                                            className="h-10 animate-pulse rounded-xl bg-[#f7f3ef]"
                                                        />
                                                    ))}
                                                </div>
                                            ) : activeCategories.length === 0 ? (
                                                <div className="rounded-xl border border-dashed border-[#e4dbd3] bg-[#faf7f4] px-4 py-6 text-center text-xs text-[#9a8f87]">
                                                    {t("becomeVendor.fields.categories.empty")}
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                                    {activeCategories.map((category) => {
                                                        const selected =
                                                            selectedCategoryIds.includes(
                                                                category.id
                                                            );

                                                        return (
                                                            <button
                                                                key={category.id}
                                                                type="button"
                                                                onClick={() =>
                                                                    toggleCategory(category.id)
                                                                }
                                                                aria-pressed={selected}
                                                                className={`group flex min-h-11 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-[11px] font-medium transition-all duration-200 ${selected
                                                                    ? "border-[#30251f] bg-[#30251f] text-white shadow-[0_5px_15px_rgba(48,37,31,0.12)]"
                                                                    : "border-[#e7ded7] bg-[#fcfaf8] text-[#5f544d] hover:-translate-y-0.5 hover:border-[#c8ab79] hover:bg-white hover:shadow-sm"
                                                                    }`}
                                                            >
                                                                <span className="min-w-0 truncate">
                                                                    {category.name}
                                                                </span>

                                                                <span
                                                                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${selected
                                                                        ? "border-white/20 bg-white/15 text-white"
                                                                        : "border-[#ded4cc] bg-white text-transparent group-hover:border-[#c8ab79]"
                                                                        }`}
                                                                >
                                                                    <Check size={11} strokeWidth={2.5} />
                                                                </span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {touched.categories &&
                                                selectedCategoryIds.length === 0 &&
                                                !categoriesLoading &&
                                                activeCategories.length > 0 && (
                                                    <p className="mt-2 flex items-center gap-1 text-[10px] font-medium text-[#b45b51]">
                                                        <AlertCircle size={11} />
                                                        {t("becomeVendor.fields.categories.error")}
                                                    </p>
                                                )}
                                        </div>

                                        <div className="pt-1">
                                            <button
                                                type="submit"
                                                disabled={!isFormValid || loading}
                                                className={`flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all duration-200 ${isFormValid && !loading
                                                    ? "bg-[#30251f] text-white shadow-[0_8px_25px_rgba(48,37,31,0.14)] hover:-translate-y-0.5 hover:bg-[#403129] hover:shadow-[0_12px_30px_rgba(48,37,31,0.18)] active:translate-y-0"
                                                    : "cursor-not-allowed border border-[#e7ded7] bg-[#f2eeea] text-[#b0a69f]"
                                                    }`}
                                            >
                                                {loading ? (
                                                    <>
                                                        <Loader2
                                                            size={16}
                                                            className="animate-spin"
                                                        />
                                                        {t("becomeVendor.submit.sending")}
                                                    </>
                                                ) : (
                                                    <>
                                                        {t("becomeVendor.submit.button")}
                                                        <ArrowRight size={16} className={isArabic ? "rotate-180" : ""} />
                                                    </>
                                                )}
                                            </button>

                                            <div className="mt-3 flex items-center justify-center gap-1.5 text-center text-[10px] leading-5 text-[#a0968f]">
                                                <BadgeCheck
                                                    size={12}
                                                    className="shrink-0 text-[#b99a62]"
                                                />
                                                <span>
                                                    {t("becomeVendor.submit.note")}
                                                </span>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </>
                        )}
                    </section>

                    <aside className="space-y-3">
                        <div className="mb-5 hidden px-1 lg:block">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a28d7e]">
                                {t("becomeVendor.perks.eyebrow")}
                            </p>

                            <h2 className="mt-2 font-serif text-2xl font-light text-[#30251f]">
                                {t("becomeVendor.perks.heading")}
                            </h2>
                        </div>

                        {[
                            {
                                icon: Users2,
                                title: t("becomeVendor.perks.reach.title"),
                                description: t("becomeVendor.perks.reach.description"),
                            },
                            {
                                icon: BadgeCheck,
                                title: t("becomeVendor.perks.verified.title"),
                                description: t("becomeVendor.perks.verified.description"),
                            },
                            {
                                icon: TrendingUp,
                                title: t("becomeVendor.perks.grow.title"),
                                description: t("becomeVendor.perks.grow.description"),
                            },
                        ].map((perk, index) => {
                            const Icon = perk.icon;

                            return (
                                <div
                                    key={perk.title}
                                    className="group rounded-2xl border border-[#e9e0d9] bg-white p-5 shadow-[0_6px_25px_rgba(71,52,36,0.035)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#d9c8b5] hover:shadow-[0_12px_35px_rgba(71,52,36,0.07)]"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#faf6f1] text-[#a47e43]">
                                            <Icon size={19} strokeWidth={1.7} />

                                            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#30251f] text-[8px] font-semibold text-white">
                                                {index + 1}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-semibold text-[#30251f]">
                                                {perk.title}
                                            </h3>

                                            <p className="mt-1.5 text-xs leading-6 text-[#81746d]">
                                                {perk.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="relative overflow-hidden rounded-2xl bg-[#30251f] p-5 text-white shadow-[0_12px_35px_rgba(48,37,31,0.12)]">
                            <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#c6a66f]/10 blur-2xl" />

                            <div className="relative">
                                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#d8bd89]">
                                    <Sparkles size={13} />
                                    {t("becomeVendor.alreadyVendor.eyebrow")}
                                </p>

                                <p className="mt-2 max-w-sm text-xs leading-6 text-white/65">
                                    {t("becomeVendor.alreadyVendor.body")}
                                </p>

                                <Link
                                    href="/login"
                                    className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-white transition hover:text-[#d8bd89]"
                                >
                                    {t("becomeVendor.alreadyVendor.cta")}
                                    <ArrowRight size={13} className={isArabic ? "rotate-180" : ""} />
                                </Link>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </main>
    );
}

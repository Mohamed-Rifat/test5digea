/**
 * Everything a brand-new vendor sees BEFORE the admin approves the account:
 * the "tell us about your business" form, the "under review" page and the
 * "welcome aboard" screen shown right after approval.
 *
 * The about / policy copy lives here too so the whole story can be edited in
 * one place (it is shown next to the form and again on the review page).
 */
const vendorOnboarding = {
  header: {
    portal: "بوابة مقدمي الخدمة",
    logout: "تسجيل الخروج",
  },

  journey: {
    eyebrow: "رحلتك معانا",
    step1: "ابعت بياناتك",
    step2: "مراجعة الفريق",
    step3: "ابدأ شغلك",
    stepOf: "الخطوة {current} من {total}",
  },

  // ---------------------------------------------------------------
  // Stage 1 — the form (also reopened when the admin asks for changes)
  // ---------------------------------------------------------------
  form: {
    eyebrow: "أهلًا بيك في 5digea",
    title: "يلا نتعرّف على نشاطك",
    subtitle:
      "حسابك اتفعّل بنجاح. اكتب بيانات نشاطك في الفورم وابعتها لفريقنا يراجعها، وأول ما نوافق هنفتحلك لوحة التحكم كاملة.",
    requiredNote: "الحقول اللي جنبها * مطلوبة.",
    progress: "{done} من {total} حقول مطلوبة مكتملة",
    logoTitle: "لوجو النشاط",
    logoHint: "صورة واضحة بتظهر للعرسان على صفحتك.",
    logoChoose: "اختار صورة",
    logoChange: "غيّر الصورة",
    logoRemove: "شيل الصورة",
    logoInvalid: "اختار ملف صورة صالح من فضلك.",
    submit: "ابعت بياناتي للمراجعة",
    submitting: "جارٍ الإرسال...",
    submitNote:
      "بعد الإرسال هتتقفل البيانات لحد ما فريقنا يراجعها ويرد عليك.",
    sentToast: "وصلتنا بياناتك! فريقنا هيبدأ مراجعتها دلوقتي.",
    rejectedTitle: "محتاجين منك تعديل بسيط",
    rejectedReason: "ملاحظات فريق المراجعة",
    rejectedNoReason:
      "فريق المراجعة طلب تعديل بعض البيانات. راجعها وابعتها تاني.",
    rejectedHint:
      "عدّل البيانات المطلوبة وابعتها من جديد، وهنراجعها بأسرع وقت.",
    resubmit: "عدّل وابعت تاني",
    resubmitting: "جارٍ إعادة الإرسال...",
  },

  // ---------------------------------------------------------------
  // Stage 2 — "your data is under review"
  // ---------------------------------------------------------------
  review: {
    eyebrow: "طلبك وصلنا",
    title: "بياناتك قيد المراجعة",
    subtitle:
      "شكرًا يا {name}! فريقنا بيراجع بيانات نشاطك دلوقتي. أول ما ناخد القرار هتلاقي النتيجة هنا على طول.",
    statusLabel: "الحالة الحالية",
    statusValue: "تحت المراجعة",
    refresh: "تحديث الحالة",
    refreshing: "جارٍ التحديث...",
    lastChecked: "آخر فحص: {time}",
    stillPending: "لسه تحت المراجعة. هنبلغك أول ما يبقى في قرار.",
    checkFailed: "معرفناش نفحص الحالة دلوقتي. جرّب تاني بعد شوية.",
    autoCheck:
      "بنفحص حالة طلبك تلقائيًا كل شوية، فمش لازم تفضل تحدّث الصفحة.",
    timelineTitle: "مراحل طلبك",
    timelineSubmitted: "تم إرسال البيانات",
    timelineSubmittedText: "وصلتنا بيانات نشاطك بنجاح.",
    timelineSubmittedAt: "اتبعت في {date}",
    timelineReview: "فريقنا بيراجع بياناتك",
    timelineReviewText: "بنتأكد إن كل حاجة واضحة ومظبوطة قبل ما تظهر للعرسان.",
    timelineDecision: "القرار",
    timelineDecisionText:
      "موافقة وفتح لوحة التحكم، أو ملاحظات لتعديل بسيط.",
    dataTitle: "بياناتك اللي أرسلتها",
    dataLocked: "البيانات مقفولة أثناء المراجعة ومينفعش تتعدّل.",
    readOnly: "للقراءة فقط",
    nextTitle: "بعد المراجعة إيه اللي هيحصل؟",
    nextApproved:
      "لو اتوافق: هتوصلك رسالة ترحيب وتدخل لوحة التحكم على طول.",
    nextRejected:
      "لو محتاج تعديل: هنوريك السبب هنا وهيتفتحلك الفورم تاني تعدّل وتبعت.",
  },

  // ---------------------------------------------------------------
  // Stage 3 — approved
  // ---------------------------------------------------------------
  welcome: {
    eyebrow: "تمت الموافقة",
    title: "مبروووك! بقيت واحد من التيم 🎉",
    text: "يسعدنا انضمام {name} لعيلة 5digea. أنت دلوقتي جزء من رحلة العروسين، ونتمنالك رحلة نجاح حلوة مليانة تقييمات وعملاء يحبوا شغلك.",
    wish: "ونتمنى تكون من شركاء النجاح.",
    tipsTitle: "أول خطوات مقترحة ليك",
    tip1: "كمّل بروفايلك وأضف صورة ولوجو",
    tip2: "اختار فئات نشاطك",
    tip3: "أضف خدماتك وأسعارك وصورك",
    cta: "يلا على لوحة التحكم",
  },

  // ---------------------------------------------------------------
  // About us / the idea / steps / benefits / policy
  // (shown beside the form and again on the review page)
  // ---------------------------------------------------------------
  about: {
    eyebrow: "عن 5digea",
    whoTitle: "إحنا مين؟",
    whoText:
      "إحنا شباب نوبي، أصحاب فكرة 5digea. بنحاول بكل حب وشغف إن كل قصة حب تلاقي بداية تليق بيها، وإن يوم العروسين يطلع زي ما بيحلموا بيه بالظبط.",
    ideaTitle: "فكرة الموقع",
    ideaText:
      "5digea سوق أفراح بيجمع العرسان ومقدمي الخدمات الموثوقين في مكان واحد. العرسان بيكتشفوا الخدمات ويقارنوا بينها ويخططوا فرحهم خطوة بخطوة، وإنت بتعرض شغلك قدام ناس بتدوّر عليك فعلًا.",
    couplesTitle: "العرسان بيعملوا إيه عندنا؟",
    couplesDiscover: "بيدوّروا ويكتشفوا الخدمات المناسبة لفرحهم",
    couplesCompare: "بيقارنوا بين مقدمي الخدمات",
    couplesFavorites: "بيحفظوا المفضّل عندهم في قايمة واحدة",
    couplesRoadmap: "بيخططوا فرحهم في خريطة طريق واضحة",
    couplesReviews: "بيقروا تقييمات حقيقية قبل ما يقرروا",

    stepsEyebrow: "خطواتك معانا",
    stepsTitle: "هتمشي إزاي؟",
    step1Title: "املا بياناتك",
    step1Text: "اسم النشاط، وبيانات التواصل، ومواعيد الشغل، وحسابات السوشيال.",
    step2Title: "فريقنا يراجع",
    step2Text: "بنتأكد إن البيانات واضحة ومظبوطة قبل ما تظهر للعرسان.",
    step3Title: "الموافقة وفتح لوحة التحكم",
    step3Text: "أول ما نوافق بتوصلك رسالة ترحيب وتدخل لوحة التحكم على طول.",
    step4Title: "ابدأ اعرض شغلك",
    step4Text:
      "أضف فئات نشاطك وخدماتك وأسعارك وصورك، وابدأ استقبل تقييمات العرسان.",

    benefitsEyebrow: "مميزاتك عندنا",
    benefitsTitle: "ليه تكون شريك 5digea؟",
    benefitReachTitle: "اوصل لعرسان حقيقيين",
    benefitReachText:
      "ناس بتخطط لفرحها فعلًا وبتدوّر على مقدم خدمة زيك.",
    benefitTrustTitle: "ختم الثقة",
    benefitTrustText:
      "بعد المراجعة بيظهر على بروفايلك إنك مقدم خدمة موثوق.",
    benefitDashboardTitle: "لوحة تحكم كاملة",
    benefitDashboardText:
      "أدِر بروفايلك وفئاتك وخدماتك وأسعارك من مكان واحد.",
    benefitReviewsTitle: "تقييمات تبني سمعتك",
    benefitReviewsText: "كل تقييم حقيقي بيزوّد ثقة العرسان فيك.",
    benefitNotificationsTitle: "إشعارات أول بأول",
    benefitNotificationsText: "هتعرف فورًا لما يحصل جديد على حسابك.",
    benefitSupportTitle: "دعم جنبك",
    benefitSupportText: "فريقنا موجود يساعدك في أي خطوة.",

    policyEyebrow: "سياستنا",
    policyTitle: "التزاماتنا والتزاماتك",
    policyAccurateTitle: "بيانات صادقة",
    policyAccurateText:
      "بيانات نشاطك وصورك وأسعارك لازم تكون حقيقية ومحدّثة.",
    policyReviewTitle: "مراجعة قبل النشر",
    policyReviewText:
      "أي بيانات جديدة أو تعديل بيتراجع من فريقنا قبل ما يظهر للعرسان.",
    policyRespectTitle: "احترام العرسان",
    policyRespectText:
      "رد على الاستفسارات بسرعة وبأدب، والتزم بوعودك ومواعيدك.",
    policyReviewsTitle: "تقييمات حقيقية",
    policyReviewsText:
      "التقييمات بتعبّر عن تجارب فعلية، وبنراجعها للحفاظ على مصداقيتها.",

    helpTitle: "محتاج مساعدة؟",
    helpText: "فريقنا جاهز يرد على أي سؤال في أي وقت.",
    helpCta: "تواصل معانا",
    helpEmailLabel: "أو ابعتلنا على",
  },
};

export default vendorOnboarding;

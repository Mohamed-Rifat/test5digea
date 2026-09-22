const roadmap = {
  loading: {
    title: "بنجهزلك رحلتك...",
    subtitle: "شوية سحر بيتحمّل.",
  },
  errorState: {
    title: "حصل خطأ ما",
  },
  create: {
    heading: "يلا نبدأ حكايتك.",
    weddingDateLabel: "تاريخ الفرح",
    optional: "(اختياري)",
    submit: {
      creating: "جارٍ إنشاء رحلتك...",
      button: "ابدأ رحلتنا",
    },
    groom: {
      eyebrow: "بتخطط ليومها المميز",
      subheading:
        "احكيلنا عنها، وإمتى هيبقى الأمر رسمي — كل تفصيلة بتساعدنا نخطط ليومكم صح.",
      noDateReassurance:
        "لسه ما حددتش الميعاد؟ محدش هيضغط عليك خالص — هنفضل جنبك في الرحلة، نساعدك تخطط كل تفصيلة ونخلي يومها ميتنساش.",
      partnerLabel: "اسم العروسة",
      partnerPlaceholder: "اسم عروستك المستقبلية",
      partnerFallback: "عروستك",
      partnerHeaderFallback: "بتخطط ليومها المميز",
    },
    bride: {
      eyebrow: "بتخططي ليوم أحلامك",
      subheading:
        "احكيلنا عنه، وإمتى هتبدأ حكايتكم — والباقي علينا.",
      noDateReassurance:
        "لسه ما حددتيش ميعاد؟ متقلقيش — هنبقى معاكِ في كل خطوة، لحد ما يومك يطلع بالظبط زي ما كنتِ حالمة بيه.",
      partnerLabel: "اسم العريس",
      partnerPlaceholder: "اسم عريسك المستقبلي",
      partnerFallback: "عريسك",
      partnerHeaderFallback: "بتخططي ليوم أحلامك",
    },
    neutral: {
      eyebrow: "رحلة فرحك",
      subheading:
        "احكيلنا مع مين بتحتفل، ويومك الحلو هيبدأ إمتى.",
      noDateReassurance:
        "لسه ما حددتش ميعاد؟ عادي جدًا — هنكون معاك في كل خطوة، لحد ما تكون جاهز.",
      partnerLabel: "اسم شريك حياتك",
      partnerPlaceholder: "اسم شريك حياتك",
      partnerFallback: "حبيبك",
      partnerHeaderFallback: "رحلة فرحك",
    },
  },
  hero: {
    tagline: "قلبين · رحلة واحدة · للأبد",
    stepsCloser: "كل خطوة بتقربك أكتر",
    countdownUntil: "لحد يومك الكبير",
    countdownYourBigDay: "يومك الكبير",
    progressLabel: "رحلتنا",
    footerTagline: "الأبدية بتبدأ من هنا",
  },
  card: {
    status: {
      completed: "مكتمل",
      vendorSelected: "تم اختيار مقدم الخدمة",
      step: "الخطوة {number}",
    },
    noVendorHint:
      "اختار مقدم خدمة من هنا، أو علّم الخطوة دي مكتملة لو حجزتها من برا Wedistry.",
    tooltip: {
      reopen: "إعادة فتح الفئة",
      markComplete: "علّم كمكتمل",
      markCompleteExternal: "علّم كمكتمل (حجزته من برا Wedistry؟)",
      writeReview: "اكتب تقييم",
      removeVendor: "احذف مقدم الخدمة",
    },
    action: {
      change: "غيّر",
      explore: "استكشف",
    },
  },
  progressRing: {
    complete: "مكتمل",
  },
  externalModal: {
    title: "حجزت من برا Wedistry؟",
    bodyBefore: "محدش هيزعل خالص — لسه تقدر تعلّم",
    bodyAfter:
      "كمكتملة. لو تجربتك كانت حلوة، شاركنا شوية تفاصيل عن اللي اشتغلت معاه وممكن نتواصل معاه ندعوه ينضم لـ Wedistry.",
    fields: {
      vendorName: {
        label: "اسم مقدم الخدمة أو المكان",
        placeholder: "مثال: استوديو الوردة الذهبية، القاهرة",
      },
      phone: {
        label: "رقم التليفون (اختياري)",
        placeholder: "+20 1xx xxx xxxx",
      },
      link: {
        label: "لينك الموقع أو الصفحة (اختياري)",
        placeholder: "https://instagram.com/...",
      },
    },
    buttons: {
      skip: "تخطي وعلّم كمكتمل",
      send: "إرسال وعلّم كمكتمل",
    },
  },
  reviewPrompt: {
    heading: "خلصت {category}!",
    body:
      "عايز تشارك تجربتك وهي لسه فريش؟ تقدر تعمل كده في أي وقت لاحقًا من صفحة رحلتك.",
    reviewNow: "اكتب تقييم دلوقتي",
    later: "ممكن بعدين",
  },
  summary: {
    label: "تفاصيل الفرح",
    planningWith: "بتخططوا مع {name}",
    dateComingSoon: "الميعاد قريب — إحنا معاك على أي حال.",
    editButton: "عدّل التفاصيل",
    editEyebrow: "عدّل حكايتك",
    cancel: "إلغاء",
    saving: "جارٍ الحفظ...",
    saveChanges: "احفظ التغييرات",
    toast: {
      updated: "تفاصيل الفرح اتحدثت.",
      updateFailed: "معرفناش نحدّث خطتك.",
    },
  },
  main: {
    eyebrow: "خريطة رحلتنا",
    heading: "خطوة حلوة في كل مرة",
    subheading:
      "من أول قرار لحد آخر لمسة، كل تفصيلة صغيرة بتقربك من يومك.",
    journeyLabel: "الرحلة",
    journeyHeading: "خريطة فرحك",
    completedLabel: "مكتمل",
  },
  toast: {
    categoryCompleted: "الفئة اكتملت!",
    categoryCompleteFailed: "معرفناش نكمّل الفئة دي.",
    categoryReopened: "الفئة اتفتحت تاني.",
    categoryReopenFailed: "معرفناش نفتح الفئة دي تاني.",
    vendorRemoved: "اتشال مقدم الخدمة من رحلتك.",
    vendorRemoveFailed: "معرفناش نشيل مقدم الخدمة.",
  },
  progress: {
    label: "تقدم الرحلة",
    heading: "بتحققه فعلاً.",
    subheading:
      "{completed} من {total} فئات اكتملوا. كل قرار صغير بيقربك من احتفالك.",
    completedCount: "{count} مكتملة",
    remainingCount: "{count} متبقية",
    enjoyHeading: "استمتع بالرحلة.",
    enjoyBody: "دي مش مجرد ليستة. دي بداية حكايتكم مع بعض.",
    oneStepCloser: "خطوة أقرب",
  },
  footer: {
    flexibleNote:
      "رحلتك مرنة. تقدر تغيّر مقدم الخدمة في أي وقت من غير ما تفقد الفئة أو تقدمك.",
  },
};

export default roadmap;

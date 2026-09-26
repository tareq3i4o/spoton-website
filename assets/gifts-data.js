// Promotional gifts catalog. Edit this file to change products.
// - icon: one of pen, mug, tumbler, cup, bottle, notebook, planner, tote, backpack,
//   tshirt, cap, powerbank, usb, keychain, lanyard, umbrella, giftbox
// - image (optional): path to a product photo, e.g. 'assets/gifts/mug.jpg' — shown instead of the icon.
// - min: minimum order quantity.
window.SPOTON_GIFTS = {
  whatsapp: '966554342450',
  email: 'tqabbish@ahwazllc.com',
  categories: [
    { id: 'pens', name: 'الأقلام' },
    { id: 'drinkware', name: 'الأكواب والمطارات' },
    { id: 'notebooks', name: 'الدفاتر والأجندات' },
    { id: 'bags', name: 'الحقائب' },
    { id: 'apparel', name: 'الملابس' },
    { id: 'tech', name: 'التقنية' },
    { id: 'accessories', name: 'الإكسسوارات' },
    { id: 'sets', name: 'أطقم الهدايا' }
  ],
  products: [
    {
      id: 'metal-pen', cat: 'pens', icon: 'pen', min: 100,
      name: 'قلم معدني فاخر',
      desc: 'قلم معدني أنيق بحبر أزرق، مناسب للمؤتمرات وهدايا العملاء.',
      colors: [{ name: 'فضي', hex: '#c0c4c8' }, { name: 'أسود', hex: '#1b1b1b' }, { name: 'كحلي', hex: '#1f3a5f' }],
      prints: ['حفر ليزر', 'طباعة']
    },
    {
      id: 'plastic-pen', cat: 'pens', icon: 'pen', min: 250,
      name: 'قلم بلاستيك بشعار',
      desc: 'قلم عملي بتكلفة مناسبة للتوزيع بكميات كبيرة.',
      colors: [{ name: 'أبيض', hex: '#f2f2f2' }, { name: 'أزرق', hex: '#1e6fd9' }, { name: 'أحمر', hex: '#d63b3b' }, { name: 'أسود', hex: '#1b1b1b' }],
      prints: ['طباعة']
    },
    {
      id: 'ceramic-mug', cat: 'drinkware', icon: 'mug', min: 50,
      name: 'كوب سيراميك',
      desc: 'كوب سيراميك 330 مل بطباعة شعاركم بالألوان الكاملة.',
      colors: [{ name: 'أبيض', hex: '#f2f2f2' }, { name: 'أسود', hex: '#1b1b1b' }, { name: 'أزرق', hex: '#1e6fd9' }],
      prints: ['طباعة حرارية']
    },
    {
      id: 'thermal-tumbler', cat: 'drinkware', icon: 'tumbler', min: 50,
      name: 'مطارة حرارية ستانلس',
      desc: 'مطارة ستانلس ستيل تحفظ حرارة المشروب، بغطاء محكم.',
      colors: [{ name: 'فضي', hex: '#c0c4c8' }, { name: 'أسود', hex: '#1b1b1b' }, { name: 'أبيض', hex: '#f2f2f2' }],
      prints: ['حفر ليزر', 'طباعة']
    },
    {
      id: 'travel-cup', cat: 'drinkware', icon: 'cup', min: 50,
      name: 'كوب قهوة للسفر',
      desc: 'كوب بغطاء محكم، مناسب للمكاتب والفعاليات.',
      colors: [{ name: 'أسود', hex: '#1b1b1b' }, { name: 'أبيض', hex: '#f2f2f2' }, { name: 'زيتي', hex: '#5b6b3a' }],
      prints: ['طباعة', 'حفر ليزر']
    },
    {
      id: 'water-bottle', cat: 'drinkware', icon: 'bottle', min: 50,
      name: 'قارورة ماء رياضية',
      desc: 'قارورة خفيفة وقابلة لإعادة الاستخدام للفرق والفعاليات الرياضية.',
      colors: [{ name: 'شفاف', hex: '#dfe8ec' }, { name: 'أزرق', hex: '#1e6fd9' }, { name: 'أسود', hex: '#1b1b1b' }],
      prints: ['طباعة']
    },
    {
      id: 'a5-notebook', cat: 'notebooks', icon: 'notebook', min: 50,
      name: 'دفتر A5 بغلاف جلد',
      desc: 'دفتر بغلاف جلد صناعي ورباط مطاطي وشريط للعلامة.',
      colors: [{ name: 'أسود', hex: '#1b1b1b' }, { name: 'كحلي', hex: '#1f3a5f' }, { name: 'بني', hex: '#6b4a2f' }],
      prints: ['حفر ليزر', 'ختم ذهبي']
    },
    {
      id: 'planner', cat: 'notebooks', icon: 'planner', min: 50,
      name: 'أجندة سنوية',
      desc: 'أجندة مؤرخة بغلاف فاخر، هدية مناسبة لبداية العام.',
      colors: [{ name: 'أسود', hex: '#1b1b1b' }, { name: 'كحلي', hex: '#1f3a5f' }, { name: 'رمادي', hex: '#7a7d80' }],
      prints: ['ختم ذهبي', 'حفر ليزر']
    },
    {
      id: 'tote-bag', cat: 'bags', icon: 'tote', min: 100,
      name: 'حقيبة قماش قطنية',
      desc: 'حقيبة قماش للفعاليات والمعارض بطباعة واضحة للشعار.',
      colors: [{ name: 'طبيعي', hex: '#e9dfc9' }, { name: 'أسود', hex: '#1b1b1b' }, { name: 'كحلي', hex: '#1f3a5f' }],
      prints: ['طباعة سلك سكرين']
    },
    {
      id: 'laptop-backpack', cat: 'bags', icon: 'backpack', min: 25,
      name: 'حقيبة ظهر للابتوب',
      desc: 'حقيبة ظهر عملية بجيوب متعددة لفرق العمل.',
      colors: [{ name: 'أسود', hex: '#1b1b1b' }, { name: 'رمادي', hex: '#7a7d80' }],
      prints: ['تطريز', 'طباعة']
    },
    {
      id: 'cotton-tshirt', cat: 'apparel', icon: 'tshirt', min: 50,
      name: 'تيشيرت قطن',
      desc: 'تيشيرت بمقاسات متعددة لفرق العمل والفعاليات.',
      colors: [{ name: 'أبيض', hex: '#f2f2f2' }, { name: 'أسود', hex: '#1b1b1b' }, { name: 'كحلي', hex: '#1f3a5f' }, { name: 'سماوي', hex: '#0db2d9' }],
      prints: ['طباعة', 'تطريز']
    },
    {
      id: 'cap', cat: 'apparel', icon: 'cap', min: 50,
      name: 'كاب بشعار مطرّز',
      desc: 'كاب قطني بشعار مطرّز في المقدمة.',
      colors: [{ name: 'أسود', hex: '#1b1b1b' }, { name: 'أبيض', hex: '#f2f2f2' }, { name: 'كحلي', hex: '#1f3a5f' }],
      prints: ['تطريز']
    },
    {
      id: 'power-bank', cat: 'tech', icon: 'powerbank', min: 25,
      name: 'شاحن متنقل',
      desc: 'شاحن متنقل بسعة 10,000 ملي أمبير، هدية يستخدمها العميل يوميًا.',
      colors: [{ name: 'أسود', hex: '#1b1b1b' }, { name: 'أبيض', hex: '#f2f2f2' }],
      prints: ['طباعة', 'حفر ليزر']
    },
    {
      id: 'usb-drive', cat: 'tech', icon: 'usb', min: 50,
      name: 'فلاش USB',
      desc: 'فلاش بسعات مختلفة بتصميم معدني أو خشبي.',
      colors: [{ name: 'فضي', hex: '#c0c4c8' }, { name: 'خشبي', hex: '#a0764a' }],
      prints: ['حفر ليزر']
    },
    {
      id: 'metal-keychain', cat: 'accessories', icon: 'keychain', min: 100,
      name: 'ميدالية مفاتيح معدنية',
      desc: 'ميدالية معدنية بشعار محفور، خفيفة وأنيقة.',
      colors: [{ name: 'فضي', hex: '#c0c4c8' }, { name: 'ذهبي', hex: '#c9a349' }],
      prints: ['حفر ليزر']
    },
    {
      id: 'lanyard', cat: 'accessories', icon: 'lanyard', min: 100,
      name: 'حبل تعليق بطاقات',
      desc: 'حبل للبطاقات بطباعة الشعار على كامل الشريط، للمؤتمرات والموظفين.',
      colors: [{ name: 'أزرق', hex: '#1e6fd9' }, { name: 'أسود', hex: '#1b1b1b' }, { name: 'أحمر', hex: '#d63b3b' }],
      prints: ['طباعة']
    },
    {
      id: 'umbrella', cat: 'accessories', icon: 'umbrella', min: 50,
      name: 'مظلة بشعار',
      desc: 'مظلة كبيرة بشعار مطبوع، مناسبة للفعاليات الخارجية.',
      colors: [{ name: 'أسود', hex: '#1b1b1b' }, { name: 'كحلي', hex: '#1f3a5f' }, { name: 'أبيض', hex: '#f2f2f2' }],
      prints: ['طباعة']
    },
    {
      id: 'executive-set', cat: 'sets', icon: 'giftbox', min: 20,
      name: 'طقم هدايا تنفيذي',
      desc: 'علبة فاخرة تضم دفترًا وقلمًا ومطارة، بتغليف حسب هويتكم.',
      colors: [{ name: 'أسود', hex: '#1b1b1b' }, { name: 'كحلي', hex: '#1f3a5f' }],
      prints: ['حفر ليزر', 'ختم ذهبي']
    }
  ]
};

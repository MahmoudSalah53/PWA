'use client';

import { useRouter } from 'next/navigation';

export interface MCPAction {
  name: string;
  description: string;
  keywords: string[];
  handler: (params?: any) => void;
}

export interface Intent {
  action: string;
  confidence: number;
  params?: any;
}

export class NavigationMCP {
  private router: any;
  private actions: Map<string, MCPAction> = new Map();

  constructor(router: any) {
    this.router = router;
    this.initializeActions();
  }

  private initializeActions() {
    this.registerAction({
      name: 'navigate_home',
      description: 'الصفحة الرئيسية',
      keywords: [
        // Direct home page references
        'الرئيسية', 'هوم', 'البداية', 'الصفحة الرئيسية', 'home',
        'الصفحة الاولى', 'الصفحة الرئيسيه', 'الرئيسيه',
        
        // Navigation commands + home
        'روح الرئيسيه', 'روح الرئيسية', 'روح الصفحة الرئيسية', 'روح الصفحة الرئيسيه',
        'روح الهوم', 'روح للرئيسية', 'روح للصفحة الرئيسية', 'روح للصفحة الرئيسيه',
        'روح للرئيسيه', 'روح للهوم', 'روح للبداية', 'روح للصفحة الاولى',
        
        // Take me to + home
        'وديني الهوم', 'وديني الرئيسية', 'وديني الرئيسيه', 'وديني الصفحة الرئيسية',
        'وديني الصفحة الرئيسيه', 'وديني البداية', 'وديني الصفحة الاولى',
        
        // Open + home
        'افتح الهوم', 'افتح الرئيسية', 'افتح الرئيسيه', 'افتح الصفحة الرئيسية',
        'افتح الصفحة الرئيسيه', 'افتح البداية', 'افتح الصفحة الاولى',
        
        // Go to + home
        'اذهب للرئيسية', 'اذهب للرئيسيه', 'اذهب للصفحة الرئيسية', 'اذهب للصفحة الرئيسيه',
        'اذهب للهوم', 'اذهب للبداية', 'اذهب للصفحة الاولى',
        
        // Navigate to + home
        'انتقل للرئيسية', 'انتقل للرئيسيه', 'انتقل للصفحة الرئيسية', 'انتقل للصفحة الرئيسيه',
        'انتقل للهوم', 'انتقل للبداية', 'انتقل للصفحة الاولى',
        
        // With "please" or polite forms
        'روح لو سمحت الرئيسية', 'روح لو سمحت الرئيسيه', 'روح لو سمحت الصفحة الرئيسية',
        'روح لو سمحت الصفحة الرئيسيه', 'روح لو سمحت الهوم', 'روح لو سمحت البداية',
        'وديني لو سمحت الرئيسية', 'وديني لو سمحت الرئيسيه', 'افتح لو سمحت الرئيسية',
        'افتح لو سمحت الرئيسيه', 'اذهب لو سمحت للرئيسية', 'اذهب لو سمحت للرئيسيه',
        
        // More variations
        'خليني في الرئيسية', 'خليني في الرئيسيه', 'خليني في الهوم', 'خليني في البداية',
        'بدي اروح على الرئيسية', 'بدي اروح على الرئيسيه', 'بدي اروح على الهوم',
        'بدي اروح على البداية', 'نقلني للرئيسية', 'نقلني للرئيسيه', 'نقلني للهوم',
        'نقلني للبداية', 'اريد الذهاب للرئيسية', 'اريد الذهاب للرئيسيه', 'اريد الذهاب للهوم',
        'اريد الذهاب للبداية', 'ارجع للرئيسية', 'ارجع للرئيسيه', 'ارجع للهوم',
        'ارجع للبداية', 'خذني للرئيسية', 'خذني للرئيسيه', 'خذني للهوم', 'خذني للبداية'
      ],
      handler: () => {
        console.log('Navigating to home page');
        this.router.push('/');
      }
    });

    this.registerAction({
      name: 'navigate_products',
      description: 'صفحة المنتجات',
      keywords: [
        // Direct products references
        'المنتجات', 'البضائع', 'السلع', 'products', 'المنتجات',
        'المنتجات', 'البضائع', 'السلع', 'products', 'المنتجات',
        
        // Navigation commands + products
        'روح المنتجات', 'روح للمنتجات', 'روح على المنتجات', 'روح للبضائع',
        'روح على البضائع', 'روح للسلع', 'روح على السلع',
        
        // Take me to + products
        'وديني المنتجات', 'وديني للمنتجات', 'وديني على المنتجات', 'وديني البضائع',
        'وديني للبضائع', 'وديني على البضائع', 'وديني السلع', 'وديني للسلع',
        
        // Open + products
        'افتح المنتجات', 'افتح المنتجات', 'افتح البضائع', 'افتح السلع',
        
        // Show me + products
        'شوف المنتجات', 'شوف لي المنتجات', 'شوف البضائع', 'شوف السلع',
        'اعرض المنتجات', 'اعرض لي المنتجات', 'اعرض البضائع', 'اعرض السلع',
        
        // Go to + products
        'اذهب للمنتجات', 'اذهب للبضائع', 'اذهب للسلع',
        
        // Navigate to + products
        'انتقل للمنتجات', 'انتقل للبضائع', 'انتقل للسلع',
        
        // Enter + products
        'خش على المنتجات', 'ادخل على المنتجات', 'خش المنتجات', 'ادخل المنتجات',
        'خش على البضائع', 'ادخل على البضائع', 'خش البضائع', 'ادخل البضائع',
        
        // With "please" or polite forms
        'روح لو سمحت المنتجات', 'وديني لو سمحت المنتجات', 'افتح لو سمحت المنتجات',
        'شوف لي لو سمحت المنتجات', 'اعرض لي لو سمحت المنتجات',
        
        // More variations
        'بدي اروح على المنتجات', 'بدي اشوف المنتجات', 'اريد المنتجات',
        'نقلني للمنتجات', 'اريد الذهاب للمنتجات', 'خليني في المنتجات',
        'شوف كل المنتجات', 'اعرض كل المنتجات', 'القائمة', 'قائمة المنتجات'
      ],
      handler: () => {
        console.log('Navigating to products page');
        this.router.push('/products');
      }
    });

    this.registerAction({
      name: 'navigate_product_details',
      description: 'تفاصيل منتج معين',
      keywords: [
        // Direct product details references
        'تفاصيل المنتج', 'عرض المنتج', 'شوف المنتج', 'product details', 'بيانات المنتج',
        'تفاصيل المنتج', 'معلومات المنتج', 'مواصفات المنتج',
        
        // Navigation commands + product details
        'روح تفاصيل المنتج', 'روح لتفاصيل المنتج', 'روح على تفاصيل المنتج',
        'روح عرض المنتج', 'روح لعرض المنتج', 'روح على عرض المنتج',
        'روح شوف المنتج', 'روح لشوف المنتج', 'روح على شوف المنتج',
        
        // Take me to + product details
        'وديني تفاصيل المنتج', 'وديني لتفاصيل المنتج', 'وديني على تفاصيل المنتج',
        'وديني عرض المنتج', 'وديني لعرض المنتج', 'وديني على عرض المنتج',
        
        // Open + product details
        'افتح تفاصيل المنتج', 'افتح عرض المنتج', 'افتح شوف المنتج',
        
        // Show me + product details
        'شوف تفاصيل المنتج', 'شوف لي تفاصيل المنتج', 'اعرض تفاصيل المنتج',
        'اعرض لي تفاصيل المنتج', 'شوف المنتج', 'شوف لي المنتج',
        
        // Go to + product details
        'اذهب لتفاصيل المنتج', 'اذهب لعرض المنتج', 'اذهب لشوف المنتج',
        
        // Navigate to + product details
        'انتقل لتفاصيل المنتج', 'انتقل لعرض المنتج', 'انتقل لشوف المنتج',
        
        // With "please" or polite forms
        'روح لو سمحت تفاصيل المنتج', 'وديني لو سمحت تفاصيل المنتج',
        'افتح لو سمحت تفاصيل المنتج', 'شوف لي لو سمحت تفاصيل المنتج',
        
        // More variations
        'بدي اروح على تفاصيل المنتج', 'بدي اشوف تفاصيل المنتج', 'اريد تفاصيل المنتج',
        'نقلني لتفاصيل المنتج', 'اريد الذهاب لتفاصيل المنتج', 'خليني في تفاصيل المنتج',
        
        // Product number variations
        'تفاصيل المنتج رقم', 'تفاصيل المنتج كود', 'عرض المنتج رقم', 'عرض المنتج كود',
        'شوف المنتج رقم', 'شوف المنتج كود', 'منتج رقم', 'منتج كود'
      ],
      handler: (params) => {
        console.log('Navigating to product details with params:', params);
        if (params?.productId) {
          this.router.push(`/products/${params.productId}`);
        } else {
          // If no product ID, go to products page
          this.router.push('/products');
        }
      }
    });

    this.registerAction({
      name: 'navigate_cart',
      description: 'عربة التسوق (السلة)',
      keywords: [
        // Direct cart references
        'السلة', 'عربة التسوق', 'الكارت', 'cart', 'سلتي', 'السلة',
        'عربة التسوق', 'الكارت', 'cart', 'سلتي', 'عربتي',
        
        // Navigation commands + cart
        'روح السلة', 'روح للسلة', 'روح على السلة', 'روح لعربة التسوق',
        'روح على عربة التسوق', 'روح للكارت', 'روح على الكارت', 'روح لسلتي',
        'روح على سلتي', 'روح لعربتي', 'روح على عربتي',
        
        // Take me to + cart
        'وديني السلة', 'وديني للسلة', 'وديني على السلة', 'وديني عربة التسوق',
        'وديني لعربة التسوق', 'وديني على عربة التسوق', 'وديني الكارت', 'وديني للكارت',
        'وديني على الكارت', 'وديني سلتي', 'وديني لسلتي', 'وديني على سلتي',
        
        // Open + cart
        'افتح السلة', 'افتح عربة التسوق', 'افتح الكارت', 'افتح سلتي', 'افتح عربتي',
        
        // Show me + cart
        'شوف السلة', 'شوف لي السلة', 'شوف عربة التسوق', 'شوف لي عربة التسوق',
        'شوف الكارت', 'شوف لي الكارت', 'شوف سلتي', 'شوف لي سلتي',
        
        // Go to + cart
        'اذهب للسلة', 'اذهب لعربة التسوق', 'اذهب للكارت', 'اذهب لسلتي', 'اذهب لعربتي',
        
        // Navigate to + cart
        'انتقل للسلة', 'انتقل لعربة التسوق', 'انتقل للكارت', 'انتقل لسلتي', 'انتقل لعربتي',
        
        // With "please" or polite forms
        'روح لو سمحت السلة', 'وديني لو سمحت السلة', 'افتح لو سمحت السلة',
        'شوف لي لو سمحت السلة', 'روح لو سمحت الكارت', 'وديني لو سمحت الكارت',
        
        // More variations
        'بدي اروح على السلة', 'بدي اشوف السلة', 'اريد السلة', 'نقلني للسلة',
        'اريد الذهاب للسلة', 'خليني في السلة', 'بدي اشوف مشترياتي', 'شوف مشترياتي',
        'مشترياتي', 'عناصري', 'طلباتي'
      ],
      handler: () => {
        console.log('Navigating to cart page');
        this.router.push('/cart');
      }
    });

    this.registerAction({
      name: 'navigate_checkout',
      description: 'صفحة الدفع',
      keywords: [
        // Direct checkout references
        'الدفع', 'إتمام الشراء', 'checkout', 'اشتري', 'ادفع', 'كمل الشراء',
        'الدفع', 'إتمام الشراء', 'checkout', 'اشتري', 'ادفع', 'كمل الشراء',
        'صفحة الدفع', 'صفحة الشراء', 'انهاء الطلب',
        
        // Navigation commands + checkout
        'روح الدفع', 'روح للدفع', 'روح على الدفع', 'روح لإتمام الشراء',
        'روح لإتمام الشراء', 'روح على إتمام الشراء', 'روح اشتري', 'روح لاشتري',
        'روح ادفع', 'روح لادفع', 'روح كمل الشراء', 'روح لكمل الشراء',
        'روح صفحة الدفع', 'روح لصفحة الدفع', 'روح على صفحة الدفع',
        
        // Take me to + checkout
        'وديني الدفع', 'وديني للدفع', 'وديني على الدفع', 'وديني إتمام الشراء',
        'وديني لإتمام الشراء', 'وديني على إتمام الشراء', 'وديني اشتري', 'وديني لاشتري',
        'وديني ادفع', 'وديني لادفع', 'وديني كمل الشراء', 'وديني لكمل الشراء',
        
        // Open + checkout
        'افتح الدفع', 'افتح إتمام الشراء', 'افتح اشتري', 'افتح ادفع', 'افتح كمل الشراء',
        'افتح صفحة الدفع', 'افتح صفحة الشراء',
        
        // Go to + checkout
        'اذهب للدفع', 'اذهب لإتمام الشراء', 'اذهب اشتري', 'اذهب ادفع', 'اذهب كمل الشراء',
        'اذهب لصفحة الدفع', 'اذهب لصفحة الشراء',
        
        // Navigate to + checkout
        'انتقل للدفع', 'انتقل لإتمام الشراء', 'انتقل اشتري', 'انتقل ادفع', 'انتقل كمل الشراء',
        'انتقل لصفحة الدفع', 'انتقل لصفحة الشراء',
        
        // With "please" or polite forms
        'روح لو سمحت الدفع', 'وديني لو سمحت الدفع', 'افتح لو سمحت الدفع',
        'روح لو سمحت صفحة الدفع', 'وديني لو سمحت صفحة الدفع',
        
        // More variations
        'بدي اروح على الدفع', 'بدي ادفع', 'اريد الدفع', 'نقلني للدفع',
        'اريد الذهاب للدفع', 'خليني في صفحة الدفع', 'بدي اتمم الشراء', 'اريد انهاء الطلب',
        'بدي اشتري الان', 'اشتري الان', 'ادفع الان', 'كمل عملية الشراء',
        'انهاء الطلب', 'تأكيد الطلب', 'اتمام الطلب'
      ],
      handler: () => {
        console.log('Navigating to checkout page');
        this.router.push('/checkout');
      }
    });

    this.registerAction({
      name: 'navigate_signin',
      description: 'تسجيل الدخول',
      keywords: [
        // Direct signin references
        'تسجيل الدخول', 'دخول', 'login', 'signin', 'تسجيل الدخول', 'دخول',
        'login', 'signin', 'تسجيل دخول', 'صفحة الدخول',
        
        // Navigation commands + signin
        'روح تسجيل الدخول', 'روح لتسجيل الدخول', 'روح على تسجيل الدخول',
        'روح دخول', 'روح للدخول', 'روح على الدخول', 'روح login', 'روح signin',
        'روح صفحة الدخول', 'روح لصفحة الدخول', 'روح على صفحة الدخول',
        
        // Take me to + signin
        'وديني تسجيل الدخول', 'وديني لتسجيل الدخول', 'وديني على تسجيل الدخول',
        'وديني دخول', 'وديني للدخول', 'وديني على الدخول', 'وديني login', 'وديني signin',
        'وديني صفحة الدخول', 'وديني لصفحة الدخول', 'وديني على صفحة الدخول',
        
        // Open + signin
        'افتح تسجيل الدخول', 'افتح دخول', 'افتح login', 'افتح signin', 'افتح صفحة الدخول',
        
        // Go to + signin
        'اذهب لتسجيل الدخول', 'اذهب للدخول', 'اذهب login', 'اذهب signin', 'اذهب صفحة الدخول',
        
        // Navigate to + signin
        'انتقل لتسجيل الدخول', 'انتقل للدخول', 'انتقل login', 'انتقل signin', 'انتقل صفحة الدخول',
        
        // With "please" or polite forms
        'روح لو سمحت تسجيل الدخول', 'وديني لو سمحت تسجيل الدخول', 'افتح لو سمحت تسجيل الدخول',
        'روح لو سمحت صفحة الدخول', 'وديني لو سمحت صفحة الدخول',
        
        // More variations
        'بدي اروح على تسجيل الدخول', 'بدي اسجل دخول', 'اريد تسجيل الدخول',
        'نقلني لتسجيل الدخول', 'اريد الذهاب لتسجيل الدخول', 'خليني في صفحة الدخول',
        'عايز اسجل', 'بدي اسجل', 'اريد اسجل', 'محتاج اسجل', 'محتاج ادخل',
        'بدي ادخل على حسابي', 'اريد ادخل على حسابي', 'ادخل على حسابي',
        'تسجيل', 'سجل دخول', 'دخول حسابي'
      ],
      handler: () => {
        console.log('Navigating to signin page');
        this.router.push('/auth/signin');
      }
    });

    this.registerAction({
      name: 'navigate_signup',
      description: 'إنشاء حساب جديد',
      keywords: [
        // Direct signup references
        'إنشاء حساب', 'تسجيل', 'signup', 'register', 'حساب جديد', 'إنشاء حساب',
        'تسجيل', 'signup', 'register', 'حساب جديد', 'انشاء حساب جديد',
        'صفحة التسجيل', 'تسجيل جديد',
        
        // Navigation commands + signup
        'روح إنشاء حساب', 'روح لإنشاء حساب', 'روح على إنشاء حساب', 'روح تسجيل',
        'روح للتسجيل', 'روح على التسجيل', 'روح signup', 'روح register', 'روح حساب جديد',
        'روح لحساب جديد', 'روح على حساب جديد', 'روح انشاء حساب جديد', 'روح لانشاء حساب جديد',
        'روح صفحة التسجيل', 'روح لصفحة التسجيل', 'روح على صفحة التسجيل',
        
        // Take me to + signup
        'وديني إنشاء حساب', 'وديني لإنشاء حساب', 'وديني على إنشاء حساب', 'وديني تسجيل',
        'وديني للتسجيل', 'وديني على التسجيل', 'وديني signup', 'وديني register', 'وديني حساب جديد',
        'وديني لحساب جديد', 'وديني على حساب جديد', 'وديني انشاء حساب جديد', 'وديني لانشاء حساب جديد',
        'وديني صفحة التسجيل', 'وديني لصفحة التسجيل', 'وديني على صفحة التسجيل',
        
        // Open + signup
        'افتح إنشاء حساب', 'افتح تسجيل', 'افتح signup', 'افتح register', 'افتح حساب جديد',
        'افتح انشاء حساب جديد', 'افتح صفحة التسجيل',
        
        // Go to + signup
        'اذهب لإنشاء حساب', 'اذهب للتسجيل', 'اذهب signup', 'اذهب register', 'اذهب حساب جديد',
        'اذهب لانشاء حساب جديد', 'اذهب صفحة التسجيل',
        
        // Navigate to + signup
        'انتقل لإنشاء حساب', 'انتقل للتسجيل', 'انتقل signup', 'انتقل register', 'انتقل حساب جديد',
        'انتقل لانشاء حساب جديد', 'انتقل صفحة التسجيل',
        
        // With "please" or polite forms
        'روح لو سمحت إنشاء حساب', 'وديني لو سمحت إنشاء حساب', 'افتح لو سمحت إنشاء حساب',
        'روح لو سمحت صفحة التسجيل', 'وديني لو سمحت صفحة التسجيل',
        
        // More variations
        'بدي اروح على إنشاء حساب', 'بدي اعمل حساب', 'اريد انشاء حساب', 'نقلني لإنشاء حساب',
        'اريد الذهاب لإنشاء حساب', 'خليني في صفحة التسجيل', 'اعمل حساب جديد', 'سجل حساب جديد',
        'بدي سجل', 'اريد اسجل', 'محتاج اسجل', 'محتاج اعمل حساب', 'بدي اعمل حساب جديد',
        'اريد اعمل حساب جديد', 'اعمل لي حساب', 'سجلني', 'حساب جديد', 'انشاء حساب'
      ],
      handler: () => {
        console.log('Navigating to signup page');
        this.router.push('/auth/signup');
      }
    });

    this.registerAction({
      name: 'navigate_profile',
      description: 'الملف الشخصي',
      keywords: [
        // Direct profile references
        'الملف الشخصي', 'بروفايل', 'profile', 'حسابي', 'شوف حسابي', 'وديني البروفايل',
        'الملف الشخصي', 'بروفايل', 'profile', 'حسابي', 'شوف حسابي', 'وديني البروفايل',
        'صفحتي الشخصية', 'معلوماتي', 'بياناتي',
        
        // Navigation commands + profile
        'روح الملف الشخصي', 'روح للملف الشخصي', 'روح على الملف الشخصي', 'روح بروفايل',
        'روح للبروفايل', 'روح على البروفايل', 'روح profile', 'روح لحسابي', 'روح على حسابي',
        'روح شوف حسابي', 'روح لشوف حسابي', 'روح على شوف حسابي', 'روح صفحتي الشخصية',
        'روح لصفحتي الشخصية', 'روح على صفحتي الشخصية', 'روح معلوماتي', 'روح لمعلوماتي',
        'روح على معلوماتي', 'روح بياناتي', 'روح لبياناتي', 'روح على بياناتي',
        
        // Take me to + profile
        'وديني الملف الشخصي', 'وديني للملف الشخصي', 'وديني على الملف الشخصي', 'وديني بروفايل',
        'وديني للبروفايل', 'وديني على البروفايل', 'وديني profile', 'وديني لحسابي', 'وديني على حسابي',
        'وديني شوف حسابي', 'وديني لشوف حسابي', 'وديني على شوف حسابي', 'وديني صفحتي الشخصية',
        'وديني لصفحتي الشخصية', 'وديني على صفحتي الشخصية', 'وديني معلوماتي', 'وديني لمعلوماتي',
        'وديني على معلوماتي', 'وديني بياناتي', 'وديني لبياناتي', 'وديني على بياناتي',
        
        // Open + profile
        'افتح الملف الشخصي', 'افتح بروفايل', 'افتح profile', 'افتح حسابي', 'افتح شوف حسابي',
        'افتح صفحتي الشخصية', 'افتح معلوماتي', 'افتح بياناتي',
        
        // Show me + profile
        'شوف الملف الشخصي', 'شوف لي الملف الشخصي', 'شوف بروفايل', 'شوف لي بروفايل',
        'شوف profile', 'شوف لي profile', 'شوف حسابي', 'شوف لي حسابي', 'شوف صفحتي الشخصية',
        'شوف لي صفحتي الشخصية', 'شوف معلوماتي', 'شوف لي معلوماتي', 'شوف بياناتي', 'شوف لي بياناتي',
        
        // Go to + profile
        'اذهب للملف الشخصي', 'اذهب للبروفايل', 'اذهب profile', 'اذهب لحسابي', 'اذهب لشوف حسابي',
        'اذهب لصفحتي الشخصية', 'اذهب لمعلوماتي', 'اذهب لبياناتي',
        
        // Navigate to + profile
        'انتقل للملف الشخصي', 'انتقل للبروفايل', 'انتقل profile', 'انتقل لحسابي', 'انتقل لشوف حسابي',
        'انتقل لصفحتي الشخصية', 'انتقل لمعلوماتي', 'انتقل لبياناتي',
        
        // With "please" or polite forms
        'روح لو سمحت الملف الشخصي', 'وديني لو سمحت الملف الشخصي', 'افتح لو سمحت الملف الشخصي',
        'شوف لي لو سمحت الملف الشخصي', 'روح لو سمحت بروفايل', 'وديني لو سمحت بروفايل',
        
        // More variations
        'بدي اروح على الملف الشخصي', 'بدي اشوف الملف الشخصي', 'اريد الملف الشخصي',
        'نقلني للملف الشخصي', 'اريد الذهاب للملف الشخصي', 'خليني في الملف الشخصي',
        'بدي اشوف حسابي', 'اريد اشوف حسابي', 'شوف معلومات حسابي', 'اعرض معلومات حسابي',
        'شوف بياناتي', 'اعرض بياناتي', 'شوف اعداداتي', 'اعدادات حسابي',
        'حسابي الشخصي', 'معلومات الحساب', 'بيانات الحساب'
      ],
      handler: () => {
        console.log('Navigating to profile page');
        this.router.push('/profile');
      }
    });

    this.registerAction({
      name: 'navigate_store',
      description: 'صفحة المتجر',
      keywords: [
        // Direct store references
        'المتجر', 'store', 'shop', 'المتجر', 'store', 'shop', 'المتجر الرئيسي',
        'صفحة المتجر', 'المتجر الالكتروني',
        
        // Navigation commands + store
        'روح المتجر', 'روح للمتجر', 'روح على المتجر', 'روح store', 'روح shop',
        'روح للمتجر الرئيسي', 'روح على المتجر الرئيسي', 'روح صفحة المتجر', 'روح لصفحة المتجر',
        'روح على صفحة المتجر', 'روح المتجر الالكتروني', 'روح للمتجر الالكتروني', 'روح على المتجر الالكتروني',
        
        // Take me to + store
        'وديني المتجر', 'وديني للمتجر', 'وديني على المتجر', 'وديني store', 'وديني shop',
        'وديني للمتجر الرئيسي', 'وديني على المتجر الرئيسي', 'وديني صفحة المتجر', 'وديني لصفحة المتجر',
        'وديني على صفحة المتجر', 'وديني المتجر الالكتروني', 'وديني للمتجر الالكتروني', 'وديني على المتجر الالكتروني',
        
        // Open + store
        'افتح المتجر', 'افتح store', 'افتح shop', 'افتح المتجر الرئيسي', 'افتح صفحة المتجر',
        'افتح المتجر الالكتروني',
        
        // Go to + store
        'اذهب للمتجر', 'اذهب store', 'اذهب shop', 'اذهب للمتجر الرئيسي', 'اذهب صفحة المتجر',
        'اذهب للمتجر الالكتروني',
        
        // Navigate to + store
        'انتقل للمتجر', 'انتقل store', 'انتقل shop', 'انتقل للمتجر الرئيسي', 'انتقل صفحة المتجر',
        'انتقل للمتجر الالكتروني',
        
        // Enter + store
        'خش ع المتجر', 'ادخل ع المتجر', 'خش المتجر', 'ادخل المتجر', 'خش على المتجر', 'ادخل على المتجر',
        'خش ع store', 'ادخل ع store', 'خش store', 'ادخل store', 'خش على store', 'ادخل على store',
        'خش ع shop', 'ادخل ع shop', 'خش shop', 'ادخل shop', 'خش على shop', 'ادخل على shop',
        
        // With "please" or polite forms
        'روح لو سمحت المتجر', 'وديني لو سمحت المتجر', 'افتح لو سمحت المتجر',
        'روح لو سمحت store', 'وديني لو سمحت store', 'خش لو سمحت المتجر',
        
        // More variations
        'بدي اروح على المتجر', 'بدي اشوف المتجر', 'اريد المتجر', 'نقلني للمتجر',
        'اريد الذهاب للمتجر', 'خليني في المتجر', 'بدي اشوف المحل', 'اريد اشوف المحل',
        'شوف المحل', 'وديني المحل', 'روح المحل', 'افتح المحل', 'المتجر الالكتروني',
        'التسوق', 'صفحة التسوق', 'المتجر الرئيسي', 'المحل'
      ],
      handler: () => {
        console.log('Navigating to store page');
        this.router.push('/store');
      }
    });

    this.registerAction({
      name: 'navigate_back',
      description: 'الرجوع للصفحة السابقة',
      keywords: [
        // Direct back references
        'رجوع', 'ارجع', 'back', 'العودة', 'للخلف', 'رجعني', 'ارجع ورا',
        'رجوع', 'ارجع', 'back', 'العودة', 'للخلف', 'رجعني', 'ارجع ورا',
        'الصفحة السابقة', 'السابق', 'للخلف',
        
        // Navigation commands + back
        'روح ورا', 'روح للخلف', 'روح للصفحة السابقة', 'روح للسابق',
        'رجع للصفحة السابقة', 'ارجع للصفحة السابقة', 'ارجع للوراء', 'ارجع للخلف',
        
        // Take me back
        'وديني ورا', 'وديني للخلف', 'وديني للصفحة السابقة', 'وديني للسابق',
        'رجعني للصفحة السابقة', 'ارجعني للصفحة السابقة', 'ارجعني للوراء', 'ارجعني للخلف',
        
        // Go back
        'اذهب للخلف', 'اذهب للصفحة السابقة', 'اذهب للسابق', 'اذهب للوراء',
        
        // Navigate back
        'انتقل للخلف', 'انتقل للصفحة السابقة', 'انتقل للسابق', 'انتقل للوراء',
        
        // With "please" or polite forms
        'رجع لو سمحت', 'ارجع لو سمحت', 'روح للخلف لو سمحت', 'وديني للخلف لو سمحت',
        
        // More variations
        'بدي ارجع', 'اريد الرجوع', 'نقلني للخلف', 'اريد الذهاب للخلف',
        'ارجع خطوة للوراء', 'ارجع خطوة', 'السابق', 'الصفحة اللي فاتت', 'فين اللي فات',
        'فين اللي قبل', 'شوف اللي فات', 'وديني على اللي فات', 'روح على اللي فات',
        'الخلف', 'للوراء', 'ارجع للصفحة اللي قبل'
      ],
      handler: () => {
        console.log('Navigating back');
        this.router.back();
      }
    });
  }

  private registerAction(action: MCPAction) {
    this.actions.set(action.name, action);
  }

  public detectIntent(text: string): Intent | null {
    const normalizedText = text.toLowerCase().trim();
    console.log('Detecting intent for text:', normalizedText);
    
    let bestMatch: { action: string; confidence: number; params?: any } | null = null;

    for (const [actionName, action] of this.actions.entries()) {
      for (const keyword of action.keywords) {
        const keywordLower = keyword.toLowerCase();
        
        // Check for exact match first
        if (normalizedText === keywordLower) {
          const confidence = 1.0;
          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = {
              action: actionName,
              confidence,
              params: this.extractParams(normalizedText, actionName)
            };
          }
          continue;
        }
        
        // Check for partial match
        if (normalizedText.includes(keywordLower) || keywordLower.includes(normalizedText)) {
          const confidence = this.calculateConfidence(normalizedText, keywordLower);
          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = {
              action: actionName,
              confidence,
              params: this.extractParams(normalizedText, actionName)
            };
          }
        }
        
        // Check for word-level matching
        const words = normalizedText.split(/\s+/);
        const keywordWords = keywordLower.split(/\s+/);
        let matchCount = 0;
        
        for (const kw of keywordWords) {
          if (words.some(w => w.includes(kw) || kw.includes(w))) {
            matchCount++;
          }
        }
        
        if (matchCount > 0) {
          const confidence = matchCount / keywordWords.length;
          if (!bestMatch || confidence > bestMatch.confidence) {
            bestMatch = {
              action: actionName,
              confidence,
              params: this.extractParams(normalizedText, actionName)
            };
          }
        }
      }
    }

    console.log('Best match found:', bestMatch);
    return bestMatch && bestMatch.confidence > 0.3 ? bestMatch : null;
  }

  private calculateConfidence(text: string, keyword: string): number {
    const words = text.split(/\s+/);
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    let matchCount = 0;

    for (const kw of keywordWords) {
      if (words.some(w => w.includes(kw) || kw.includes(w))) matchCount++;
    }

    // Base confidence
    let confidence = matchCount / keywordWords.length;
    
    // Boost for exact match
    if (text.includes(keyword)) {
      confidence += 0.2;
    }
    
    // Boost for longer matches
    if (matchCount >= 2) {
      confidence += 0.1;
    }
    
    return Math.min(1, confidence);
  }

  private extractParams(text: string, actionName: string): any {
    const params: any = {};
    
    if (actionName === 'navigate_product_details') {
      // Extract product ID from various patterns
      const patterns = [
        /رقن (\d+)/i,
        /كود (\d+)/i,
        /منتج (\d+)/i,
        /id (\d+)/i,
        /(\d+)/
      ];
      
      for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
          params.productId = match[1];
          break;
        }
      }
    }
    
    return params;
  }

  public executeIntent(intent: Intent): boolean {
    const action = this.actions.get(intent.action);
    if (!action) {
      console.error('Action not found:', intent.action);
      return false;
    }

    try {
      console.log('Executing action:', intent.action, 'with params:', intent.params);
      action.handler(intent.params);
      return true;
    } catch (error) {
      console.error('Error executing action:', error);
      return false;
    }
  }

  public processVoiceCommand(text: string): {
    success: boolean;
    intent?: Intent;
    message: string;
  } {
    console.log('Processing voice command:', text);
    
    const intent = this.detectIntent(text);
    console.log('Detected intent:', intent);

    if (!intent) {
      return {
        success: false,
        message: 'لم أفهم الأمر. جرب أن تقول "افتح المنتجات" أو "اذهب للرئيسية" أو "روح السلة"'
      };
    }

    try {
      const executed = this.executeIntent(intent);
      const action = this.actions.get(intent.action);

      if (executed) {
        return { 
          success: true, 
          intent, 
          message: `✅ تم ${action?.description} بنجاح` 
        };
      } else {
        return { 
          success: false, 
          intent, 
          message: `❌ لم أتمكن من تنفيذ الأمر: ${action?.description}` 
        };
      }
    } catch (error) {
      console.error('Error executing command:', error);
      return { 
        success: false, 
        intent, 
        message: `❌ حدث خطأ أثناء تنفيذ الأمر: ${error instanceof Error ? error.message : 'خطأ غير معروف'}` 
      };
    }
  }

  public getAvailableCommands(): string[] {
    return Array.from(this.actions.values()).map(
      (action) =>
        `${action.description} → Examples: ${action.keywords
          .slice(0, 3)
          .join(", ")}`
    );
  }
}
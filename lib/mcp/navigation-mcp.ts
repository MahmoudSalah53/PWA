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
        'الرئيسية', 'هوم', 'البداية', 'الصفحة الرئيسية', 'home',
        'روح الرئيسيه','روح الرئيسية', 'وديني الهوم', 'افتح الهوم', 'روحي الصفحه الرئيسيه', 'روحي الصفحة الرئيسيه'
      ],
      handler: () => this.router.push('/')
    });

    this.registerAction({
      name: 'navigate_products',
      description: 'صفحة المنتجات',
      keywords: [
        'المنتجات', 'البضائع', 'السلع', 'products',
        'افتحي المنتجات', 'شوف المنتجات', 'خش على المنتجات', 'وديني المنتجات'
      ],
      handler: () => this.router.push('/products')
    });

    this.registerAction({
      name: 'navigate_product_details',
      description: 'تفاصيل منتج معين',
      keywords: [
        'تفاصيل المنتج', 'عرض المنتج', 'شوف المنتج', 'product details', 'بيانات المنتج'
      ],
      handler: (params) => {
        if (params?.productId) {
          this.router.push(`/products/${params.productId}`);
        }
      }
    });

    this.registerAction({
      name: 'navigate_cart',
      description: 'عربة التسوق (السلة)',
      keywords: [
        'السلة', 'عربة التسوق', 'الكارت', 'cart', 'سلتي',
        'افتح السلة', 'شوف السلة', 'وديني الكارت'
      ],
      handler: () => this.router.push('/cart')
    });

    this.registerAction({
      name: 'navigate_checkout',
      description: 'صفحة الدفع',
      keywords: [
        'الدفع', 'إتمام الشراء', 'checkout', 'اشتري', 'ادفع', 'كمل الشراء'
      ],
      handler: () => this.router.push('/checkout')
    });

    this.registerAction({
      name: 'navigate_signin',
      description: 'تسجيل الدخول',
      keywords: [
        'تسجيل الدخول', 'دخول', 'login', 'signin',
        'عايز اسجل', 'افتح صفحة الدخول'
      ],
      handler: () => this.router.push('/auth/signin')
    });

    this.registerAction({
      name: 'navigate_signup',
      description: 'إنشاء حساب جديد',
      keywords: [
        'إنشاء حساب', 'تسجيل', 'signup', 'register', 'حساب جديد',
        'اعمل حساب', 'افتح التسجيل'
      ],
      handler: () => this.router.push('/auth/signup')
    });

    this.registerAction({
      name: 'navigate_profile',
      description: 'الملف الشخصي',
      keywords: [
        'الملف الشخصي', 'بروفايل', 'profile', 'حسابي', 'شوف حسابي', 'وديني البروفايل'
      ],
      handler: () => this.router.push('/profile')
    });

    this.registerAction({
      name: 'navigate_store',
      description: 'صفحة المتجر',
      keywords: [
        'المتجر', 'store', 'shop', 'خش ع المتجر', 'وديني الشوب'
      ],
      handler: () => this.router.push('/store')
    });

    this.registerAction({
      name: 'navigate_back',
      description: 'الرجوع للصفحة السابقة',
      keywords: [
        'رجوع', 'ارجع', 'back', 'العودة', 'للخلف', 'رجعني', 'ارجع ورا'
      ],
      handler: () => this.router.back()
    });
  }

  private registerAction(action: MCPAction) {
    this.actions.set(action.name, action);
  }

  public detectIntent(text: string): Intent | null {
    const normalizedText = text.toLowerCase().trim();
    let bestMatch: { action: string; confidence: number; params?: any } | null = null;

    for (const [actionName, action] of this.actions.entries()) {
      for (const keyword of action.keywords) {
        if (normalizedText.includes(keyword.toLowerCase())) {
          const confidence = this.calculateConfidence(normalizedText, keyword);
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

    return bestMatch && bestMatch.confidence > 0.5 ? bestMatch : null;
  }

  private calculateConfidence(text: string, keyword: string): number {
    const words = text.split(/\s+/);
    const keywordWords = keyword.toLowerCase().split(/\s+/);
    let matchCount = 0;

    for (const kw of keywordWords) {
      if (words.some(w => w.includes(kw))) matchCount++;
    }

    return matchCount / keywordWords.length;
  }

  private extractParams(text: string, actionName: string): any {
    const params: any = {};
    if (actionName === 'navigate_product_details') {
      const numberMatch = text.match(/\d+/);
      if (numberMatch) params.productId = numberMatch[0];
    }
    return params;
  }

  public executeIntent(intent: Intent): boolean {
    const action = this.actions.get(intent.action);
    if (!action) return false;

    try {
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
    const intent = this.detectIntent(text);

    if (!intent) {
      return {
        success: false,
        message: 'معرفتش تقصد إيه بالظبط، جرّب تقول مثلاً "افتح المنتجات" أو "روح الرئيسية"'
      };
    }

    const executed = this.executeIntent(intent);
    const action = this.actions.get(intent.action);

    return executed
      ? { success: true, intent, message: `تم ${action?.description} بنجاح ` }
      : { success: false, intent, message: 'فيه مشكلة حصلت أثناء التنفيذ ' };
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
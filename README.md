# colab-xhttp-relay
XHTTP Relay for Google Colab

هذا المستودع هو نسخة معدّلة من [replit-xhttp-relay](https://github.com/alrufaaey-yahoo/replit-xhttp-relay) مصممة للعمل على [Google Colab](https://colab.research.google.com/). يوفر هذا التطبيق وسيطًا (relay) لطلبات HTTP، مما يسمح لك بتجاوز قيود CORS أو الوصول إلى الموارد المحظورة باستخدام نفق **Cloudflare Tunnel** المستقر.

## كيفية الاستخدام على Google Colab

1.  **افتح Google Colab:** انتقل إلى [Google Colab](https://colab.research.google.com/) وأنشئ دفتر ملاحظات جديدًا.

2.  **تثبيت الأدوات اللازمة:** قم بتشغيل الأوامر التالية في خلية Colab لتثبيت Node.js وأداة Cloudflared:

    ```bash
    # تثبيت Node.js
    !curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    !sudo apt-get install -y nodejs

    # تثبيت Cloudflared (للحصول على رابط مباشر ومستقر)
    !curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared
    !chmod +x /usr/local/bin/cloudflared
    ```

3.  **استنساخ المستودع:** قم باستنساخ هذا المستودع إلى بيئة Colab الخاصة بك:

    ```bash
    !git clone https://github.com/alrufaaey-yahoo/colab-xhttp-relay.git
    %cd colab-xhttp-relay
    ```

4.  **تشغيل الخادم:** قم بتشغيل الخادم. سيقوم `Cloudflare Tunnel` بإنشاء نفق عام تلقائيًا.

    ```bash
    !node index.js
    ```

    بعد تشغيل الخادم، ستحصل على رابط ينتهي بـ `.trycloudflare.com` في مخرجات الخلية (ابحث عن سطر يبدأ بـ `✅ Tunnel established!`). استخدم هذا الرابط للوصول إلى تطبيق الترحيل الخاص بك.

## التكوين

يمكنك تعيين `TARGET_DOMAIN` كمتغير بيئة لتحديد النطاق الهدف الذي سيقوم الخادم بالترحيل إليه. إذا لم يتم تعيينه، فسيتم استخدام `https://thumbayan.com:443` افتراضيًا.

```bash
!TARGET_DOMAIN=https://your-target-domain.com node index.js
```

## لماذا Cloudflare Tunnel؟

*   **استقرار عالٍ:** يوفر روابط مستقرة جداً مقارنة بالحلول الأخرى.
*   **أمان متقدم:** حماية مدمجة من Cloudflare.
*   **رابط HTTPS تلقائي:** تحصل على شهادة SSL مجانية وتلقائية للرابط العام.

## الترخيص

هذا المشروع مرخص بموجب ترخيص ISC.

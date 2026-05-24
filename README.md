# colab-xhttp-relay

هذا المستودع هو نسخة معدّلة من [replit-xhttp-relay](https://github.com/alrufaaey-yahoo/replit-xhttp-relay) مصممة للعمل على [Google Colab](https://colab.research.google.com/). يوفر هذا التطبيق وسيطًا (relay) لطلبات HTTP، مما يسمح لك بتجاوز قيود CORS أو الوصول إلى الموارد المحظورة باستخدام نفق **Localtunnel** المجاني.

## كيفية الاستخدام على Google Colab

1.  **افتح Google Colab:** انتقل إلى [Google Colab](https://colab.research.google.com/) وأنشئ دفتر ملاحظات جديدًا.

2.  **تثبيت Node.js:** قم بتشغيل الأوامر التالية في خلية Colab لتثبيت Node.js:

    ```bash
    !curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    !sudo apt-get install -y nodejs
    ```

3.  **استنساخ المستودع:** قم باستنساخ هذا المستودع إلى بيئة Colab الخاصة بك:

    ```bash
    !git clone https://github.com/alrufaaey-yahoo/colab-xhttp-relay.git
    %cd colab-xhttp-relay
    ```

4.  **تثبيت الاعتمادات:**

    ```bash
    !npm install
    ```

5.  **تشغيل الخادم:** قم بتشغيل الخادم. سيقوم `Localtunnel` بإنشاء نفق عام تلقائيًا باستخدام `npx`.

    ```bash
    !node index.js
    ```

    بعد تشغيل الخادم، ستحصل على رابط `localtunnel.me` عام في مخرجات الخلية (ابحث عن سطر يبدأ بـ `✅ Tunnel established!`). استخدم هذا الرابط للوصول إلى تطبيق الترحيل الخاص بك.

## التكوين

يمكنك تعيين `TARGET_DOMAIN` كمتغير بيئة لتحديد النطاق الهدف الذي سيقوم الخادم بالترحيل إليه. إذا لم يتم تعيينه، فسيتم استخدام `https://thumbayan.com:443` افتراضيًا.

```bash
!TARGET_DOMAIN=https://your-target-domain.com node index.js
```

## لماذا Localtunnel؟

*   **سهولة الاستخدام:** لا يتطلب تثبيت أدوات خارج نظام Node.js (يتم تشغيله عبر `npx`).
*   **رابط مباشر:** يوفر روابط واضحة وسهلة المشاركة.
*   **مجاني تماماً:** مثالي للتجارب السريعة ومشاريع التطوير.

## الترخيص

هذا المشروع مرخص بموجب ترخيص ISC.

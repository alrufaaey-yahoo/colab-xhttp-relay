# colab-xhttp-relay
XHTTP Relay for Google Colab

هذا المستودع هو نسخة معدّلة من [replit-xhttp-relay](https://github.com/alrufaaey-yahoo/replit-xhttp-relay) مصممة للعمل على [Google Colab](https://colab.research.google.com/). يوفر هذا التطبيق وسيطًا (relay) لطلبات HTTP باستخدام نفق **LocalXpose** القوي.

## كيفية الاستخدام على Google Colab

1.  **افتح Google Colab:** انتقل إلى [Google Colab](https://colab.research.google.com/) وأنشئ دفتر ملاحظات جديدًا.

2.  **تثبيت الأدوات اللازمة:** قم بتشغيل الأوامر التالية في خلية Colab لتثبيت Node.js وأداة LocalXpose:

    ```bash
    # تثبيت Node.js
    !curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    !sudo apt-get install -y nodejs

    # تثبيت LocalXpose CLI
    !wget https://api.localxpose.io/api/v2/downloads/loclx-linux-amd64.zip
    !unzip loclx-linux-amd64.zip
    !chmod +x loclx
    !sudo mv loclx /usr/local/bin/
    ```

3.  **استنساخ المستودع:** قم باستنساخ هذا المستودع:

    ```bash
    !git clone https://github.com/alrufaaey-yahoo/colab-xhttp-relay.git
    %cd colab-xhttp-relay
    ```

4.  **تشغيل الخادم:** قم بتشغيل الخادم مع التوكن الخاص بك، وسيتم إنشاء النفق تلقائياً.

    ```bash
    !LOCLX_AUTH_TOKEN=your_access_token_here node index.js
    ```

    بعد تشغيل الخادم، ابحث في المخرجات عن رابط ينتهي بـ `.loclx.io` (سيظهر بجانب عبارة `✅ Tunnel established!`). استخدم هذا الرابط للوصول إلى تطبيق الترحيل الخاص بك.

## التكوين

يمكنك تعيين المتغيرات التالية كمتغيرات بيئة:

*   `TARGET_DOMAIN`: النطاق الهدف الذي تريد الترحيل إليه (افتراضي: `https://thumbayan.com:443`).
*   `LOCLX_AUTH_TOKEN`: رمز الوصول الخاص بـ LocalXpose لتجنب خطأ `unauthenticated`.

مثال متكامل:
```bash
!TARGET_DOMAIN=https://your-target-domain.com LOCLX_AUTH_TOKEN=your_token node index.js
```

## لماذا LocalXpose؟

*   **سرعة وأداء:** يوفر اتصالات سريعة ومستقرة.
*   **مرونة:** يدعم بروتوكولات متعددة وميزات متقدمة للمطورين.
*   **سهولة التثبيت:** يتوفر سكربت تثبيت سريع لبيئات Linux.

## الترخيص

هذا المشروع مرخص بموجب ترخيص ISC.

# colab-xhttp-relay
XHTTP Relay for Google Colab

هذا المستودع هو نسخة معدّلة من [replit-xhttp-relay](https://github.com/alrufaaey-yahoo/replit-xhttp-relay) مصممة للعمل على [Google Colab](https://colab.research.google.com/). يوفر هذا التطبيق وسيطًا (relay) لطلبات HTTP باستخدام نفق **Pinggy**، وهو حل خفيف الوزن وغير مشهور يعمل عبر SSH مباشرة دون الحاجة لتثبيت برامج إضافية.

## كيفية الاستخدام على Google Colab

1.  **افتح Google Colab:** انتقل إلى [Google Colab](https://colab.research.google.com/) وأنشئ دفتر ملاحظات جديدًا.

2.  **تثبيت Node.js (إذا لم يكن مثبتاً):** قم بتشغيل الأوامر التالية في خلية Colab:

    ```bash
    !curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    !sudo apt-get install -y nodejs
    ```

3.  **استنساخ المستودع:** قم باستنساخ هذا المستودع:

    ```bash
    !git clone https://github.com/alrufaaey-yahoo/colab-xhttp-relay.git
    %cd colab-xhttp-relay
    ```

4.  **تشغيل الخادم:** لا يحتاج Pinggy لتثبيت أي أدوات، سيعمل تلقائياً عبر SSH.

    ```bash
    !node index.js
    ```

    بعد تشغيل الخادم، ابحث في المخرجات عن رابط ينتهي بـ `.a.pinggy.link` (سيظهر بجانب عبارة `✅ Tunnel established!`). استخدم هذا الرابط للوصول إلى تطبيق الترحيل الخاص بك.

## التكوين

يمكنك تعيين `TARGET_DOMAIN` كمتغير بيئة لتحديد النطاق الهدف:

```bash
!TARGET_DOMAIN=https://your-target-domain.com node index.js
```

## لماذا Pinggy؟

*   **بدون تثبيت (Zero Install):** يعمل مباشرة عبر أمر SSH الموجود مسبقاً في جميع أنظمة Linux بما في ذلك Colab.
*   **غير مشهور:** خيار ممتاز لمن يبحث عن بدائل بعيدة عن الأنفاق التقليدية المشهورة.
*   **سرعة عالية:** يعتمد على بروتوكول SSH الموثوق والسريع.

## الترخيص

هذا المشروع مرخص بموجب ترخيص ISC.

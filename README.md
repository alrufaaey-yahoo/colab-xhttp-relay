# colab-xhttp-relay

هذا المستودع هو نسخة معدّلة من [replit-xhttp-relay](https://github.com/alrufaaey-yahoo/replit-xhttp-relay) مصممة للعمل على [Google Colab](https://colab.research.google.com/). يوفر هذا التطبيق وسيطًا (relay) لطلبات HTTP، مما يسمح لك بتجاوز قيود CORS أو الوصول إلى الموارد المحظورة باستخدام نفق **Bore** المجاني والمستضاف على خوادم سحابية عالية الأداء (Oracle Cloud).

## كيفية الاستخدام على Google Colab

1.  **افتح Google Colab:** انتقل إلى [Google Colab](https://colab.research.google.com/) وأنشئ دفتر ملاحظات جديدًا.

2.  **تثبيت الأدوات اللازمة:** قم بتشغيل الأوامر التالية في خلية Colab لتثبيت Node.js وأداة Bore:

    ```bash
    # تثبيت Node.js
    !curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    !sudo apt-get install -y nodejs

    # تثبيت Bore (نفق مستضاف على Oracle Cloud)
    !curl -Ls https://github.com/ekzhang/bore/releases/latest/download/bore-linux-amd64.tar.gz | tar -xz -C /usr/local/bin
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

5.  **تشغيل الخادم:** قم بتشغيل الخادم. سيقوم `Bore` بإنشاء نفق عام تلقائيًا.

    ```bash
    !node index.js
    ```

    بعد تشغيل الخادم، ستحصل على رابط `bore.pub:PORT` عام في مخرجات الخلية (ابحث عن سطر يبدأ بـ `✅ Tunnel established!`). استخدم هذا الرابط للوصول إلى تطبيق الترحيل الخاص بك.

## التكوين

يمكنك تعيين `TARGET_DOMAIN` كمتغير بيئة لتحديد النطاق الهدف الذي سيقوم الخادم بالترحيل إليه. إذا لم يتم تعيينه، فسيتم استخدام `https://thumbayan.com:443` افتراضيًا.

```bash
!TARGET_DOMAIN=https://your-target-domain.com node index.js
```

## لماذا Bore على Oracle؟

*   **أداء فائق:** يتميز Bore بكونه مكتوباً بلغة Rust، مما يجعله سريعاً جداً وخفيفاً على الموارد.
*   **استضافة قوية:** خوادم Bore العامة مستضافة على بنية تحتية سحابية قوية (مثل Oracle Cloud) لضمان استقرار الاتصال.
*   **رابط مباشر:** يوفر رابطاً مباشراً عبر المنفذ (IP:Port) مما يقلل من طبقات المعالجة ويزيد السرعة.

## الترخيص

هذا المشروع مرخص بموجب ترخيص ISC.

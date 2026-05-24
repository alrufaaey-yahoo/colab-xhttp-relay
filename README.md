# colab-xhttp-relay

هذا المستودع هو نسخة معدّلة من [replit-xhttp-relay](https://github.com/alrufaaey-yahoo/replit-xhttp-relay) مصممة للعمل على [Google Colab](https://colab.research.google.com/). يوفر هذا التطبيق وسيطًا (relay) لطلبات HTTP، مما يسمح لك بتجاوز قيود CORS أو الوصول إلى الموارد المحظورة.

## كيفية الاستخدام على Google Colab

1.  **افتح Google Colab:** انتقل إلى [Google Colab](https://colab.research.google.com/) وأنشئ دفتر ملاحظات جديدًا.

2.  **تثبيت Node.js و npm:** قم بتشغيل الأوامر التالية في خلية Colab لتثبيت Node.js و npm:

    ```bash
    !curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    !sudo apt-get install -y nodejs
    ```

3.  **استنساخ المستودع:** قم باستنساخ هذا المستودع إلى بيئة Colab الخاصة بك:

    ```bash
    !git clone https://github.com/<YOUR_GITHUB_USERNAME>/colab-xhttp-relay.git
    %cd colab-xhttp-relay
    ```
    **ملاحظة:** استبدل `<YOUR_GITHUB_USERNAME>` باسم مستخدم GitHub الخاص بك.

4.  **تثبيت الاعتمادات:** قم بتثبيت الاعتمادات المطلوبة، بما في ذلك `ngrok`:

    ```bash
    !npm install
    ```

5.  **تشغيل الخادم:** قم بتشغيل الخادم. سيقوم `ngrok` بإنشاء نفق عام لتطبيقك. تأكد من استبدال `YOUR_NGROK_AUTH_TOKEN` برمز المصادقة الخاص بك من [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken).

    ```bash
    !NGROK_AUTHTOKEN=YOUR_NGROK_AUTH_TOKEN node index.js
    ```

    بعد تشغيل الخادم، ستحصل على رابط `ngrok` عام في مخرجات الخلية. استخدم هذا الرابط للوصول إلى تطبيق الترحيل الخاص بك.

## التكوين

يمكنك تعيين `TARGET_DOMAIN` كمتغير بيئة لتحديد النطاق الهدف الذي سيقوم الخادم بالترحيل إليه. إذا لم يتم تعيينه، فسيتم استخدام `https://thumbayan.com:443` افتراضيًا.

```bash
!TARGET_DOMAIN=https://your-target-domain.com node index.js
```

## الترخيص

هذا المشروع مرخص بموجب ترخيص ISC.

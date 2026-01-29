
Our goal is to replace our current sms/email sending with one that uses OneSignal service.
There we already added our app and templates to their system, os we only need to setup its functionality from our backend
Below I attached some additional info that is going to be useful to you for integration. If you have any issues reading the links, tell me. 
Also, do note that Onesignal uses specific api with specific ways to attach custom data, I attached info on how the dynamic data on some messages is displayed in templates on their servers (like we currently send our password reset email with a "{{resetLink}} in it but for Onesignal, their template will display it as "message.custom_data.reset_link" and you can check how these emails with custom data are pushed in documentations I attached).


Params in env for the integration:
ONE_SIGNAL_APP_ID - this is OneSignal App ID
ONE_SIGNAL_API_KEY - this is OneSignal REST API Key

EMAIL_PASSWORD_RESET_TEMPLATE_ID - this is email template for "Click the button below to reset your password" and in OneSignal's template it will display "{{ message.custom_data.reset_link }}".
EMAIL_VALIDATION_OTP_TEMPLATE_ID - this is email template for "Your Bonus&Spins verification code is " and in OneSignal's template it will display "{{ message.custom_data.verification_code }}".
SMS_BONUS_SPINS_OTP_TEMPLATE_ID - this is sms template for "The code is only active for 10 minutes. Once the code expires you will have to resend the code from mobile app." and in OneSignal's template it will display "{{ message.custom_data.verification_code }}".
SMS_DAILY_LUCKY_WHEEL_REMINDER_TEMPLATE_ID - this is template for daily bonus spin reminders (im not sure if we send it from backend or frontend, if later, no need to add it to backend).
SMS_RATING_TEMPLATE_ID - this is template for asking to rate our app(im not sure if we send it from backend or frontend, if later, no need to add it to backend).

Official Docs that can be useful for the integration:
https://documentation.onesignal.com/docs/en/email-messaging
https://documentation.onesignal.com/docs/en/email-setup
https://documentation.onesignal.com/docs/en/sms-messaging
https://documentation.onesignal.com/docs/en/message-personalization#api-custom-data
https://documentation.onesignal.com/docs/en/example-verification-magic-link-otp
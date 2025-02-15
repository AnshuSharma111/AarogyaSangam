# 📘 Aarogya Sangam - Setup Guide

## 🚀 Steps to Run Aarogya Sangam

### 1️⃣ Clone the Repository
```sh
git clone <repository-url>
cd AarogyaSangam
```

### 2️⃣ Install Dependencies
```sh
npm i
```

### 3️⃣ Install Frontend Server Dependencies
```sh
cd Frontend
npm i
```

### 4️⃣ Create a `.env` File
Aarogya Sangam requires multiple environment variables. Below are the necessary configurations:

#### 🔹 **SMS_API_TOKEN**
Aarogya Sangam uses a mobile phone as an SMS gateway instead of paid services like Twilio. Follow these steps to set up `httpSMS`:

1. Install `httpSMS` on your mobile phone.
2. Go to [httpsms.com](https://httpsms.com) and create an account.
3. Download the `httpSMS` APK file from the website.
4. Transfer the APK file to your mobile phone.
5. Disable Play Protect temporarily to install the APK:
   - Open **Google Play Store** → Tap on your **Profile Icon** → **Play Protect** → Turn it **Off**.
6. Install the `httpSMS` app.
7. Turn Play Protect back **On**.
8. Generate an API Key and link your device:
   - Visit [https://httpsms.com/settings/](https://httpsms.com/settings/).
   - Generate an API key.
   - Open the `httpSMS` app and scan the QR code from the settings page.

Set this API key in your `.env` file:
```sh
SMS_API_TOKEN=your_generated_api_key
```

#### 🔹 **SEND_PHONE_NUMBER**
This is the mobile number registered with `httpSMS`:
```sh
SEND_PHONE_NUMBER=your_phone_number
```

#### 🔹 **GEN_API_KEY**
Generate an API key from Google Gemini: [Get API Key](https://aistudio.google.com/app/apikey)
```sh
GEN_API_KEY=your_gemini_api_key
```

#### 🔹 **EMAIL_PASS** (For Nodemailer)
Aarogya Sangam uses Nodemailer to send appointment schedules via email. To allow this:

1. Ensure you have a **Google account with 2-Step Verification enabled**.
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords).
3. Select **Mail** as the app and **Windows Computer** as the device.
4. Click **Generate** and copy the password.

Set this in your `.env` file:
```sh
EMAIL_PASS=your_generated_app_password
```

#### 🔹 **EMAIL_USER**
The email associated with the account used for `EMAIL_PASS`.
```sh
EMAIL_USER=your_email@gmail.com
```

#### 🔹 **JWT_SECRET**
Aarogya Sangam uses JWT for authentication. You need to generate a secure JWT secret key.
```sh
JWT_SECRET=your_secure_jwt_secret
```

### 5️⃣ Configure Database & Server
Set up the required environment variables:
```sh
# MongoDB Connection String
DB_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/AarogyaSangam

# Port Number
PORT=5000

# Other Variables
SMS_API_TOKEN=your_sms_api_token
SEND_PHONE_NUMBER=your_phone_number
JWT_SECRET=your_jwt_secret
GEN_API_KEY=your_gemini_api_key
EMAIL_PASS=your_email_app_password
EMAIL_USER=your_email@gmail.com
```

### 6️⃣ Start the Application
#### 🖥️ Backend Server
```sh
npm start
```
#### 🌐 Frontend Server
```sh
cd Frontend
npm run dev
```
Go to the provided **localhost URL** to access the dashboard.

---

## 🔄 Webhook Setup for Incoming SMS

### 1️⃣ Configure Webhook on `httpsms.com`
1. Go to [https://httpsms.com/settings/](https://httpsms.com/settings/).
2. Navigate to **Webhooks** → Click **Add Webhook**.
3. In **Events**, deselect all except `message.phone.received`.
4. Set the **Callback URL** as shown below.

### 2️⃣ Expose Local Server using `ngrok`
Since we are in the development phase, we need to expose our local server:

#### 📌 Steps:
1. Ensure all API keys are set up.
2. Open a terminal and run the backend server:
   ```sh
   npm start
   ```
3. Open another terminal for the frontend:
   ```sh
   cd Frontend
   npm run dev
   ```
4. Run `ngrok`:
   ```sh
   ngrok http 5000
   ```
5. Copy the **ngrok forwarding URL** (e.g., `https://random-id.ngrok.io`).
6. Append `/api/sms/receive` to it. Your final Callback URL should be:
   ```
   https://random-id.ngrok.io/api/sms/receive
   ```
7. Paste this URL into the **Webhook settings** on `httpsms.com` and save.

📌 For a detailed guide on ngrok setup, visit: [How to Expose Localhost using ngrok](https://reyhann.medium.com/how-to-expose-your-localhost-server-using-ngrok-9928ac2e26b8)

---

## ✅ Final Notes
We understand that this setup involves multiple steps, but it is necessary due to the limitations of free SMS gateways. If you face any issues, feel free to reach out for support! 🚀

const axios = require('axios');
const readline = require('readline-sync');
const chalk = require('chalk');
const gradient = require('gradient-string');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const crypto = require('crypto');
const { chromium } = require('playwright-extra');
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);



const TOKO_HEADERS = {
    'Content-Type': 'application/json',
    'User-Agent': 'Tokopedia/2.368.0 (com.tokopedia.Tokopedia; build:202604172026; iOS 26.2.1) Alamofire/1.0.0',
    'Accept': 'application/json',
    'x-device': 'ios-2.368.0',
    'Connection': 'keep-alive'
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * BANNER TOKOPEDIA EDITION
 */
function displayBanner() {
    console.clear();
    console.log(gradient(['#42b549', '#b5f5be', '#2ecc71'])(`
    ████████╗ ██████╗ ██╗  ██╗ ██████╗ ██████╗ ███████╗██████╗ ██╗ █████╗ 
    ╚══██╔══╝██╔═══██╗██║ ██╔╝██╔═══██╗██╔══██╗██╔════╝██╔══██╗██║██╔══██╗
       ██║   ██║   ██║█████╔╝ ██║   ██║██████╔╝█████╗  ██║  ██║██║███████║
       ██║   ██║   ██║██╔═██╗ ██║   ██║██╔═══╝ ██╔══╝  ██║  ██║██║██╔══██║
       ██║   ╚██████╔╝██║  ██╗╚██████╔╝██║     ███████╗██████╔╝██║██║  ██║
       ╚═╝    ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚══════╝╚═════╝ ╚═╝╚═╝  ╚═╝
    TOKOPEDIA AUTO SYSTEM v1.1 - Ultra Precision
    By Paizutempest x Yaelanit | Mode: Dynamic Identity
    `));
    console.log(chalk.green(` 📅  ${new Date().toLocaleString('id-ID')} | [ TOKOPEDIA PROJECT ]\n`));
    console.log(chalk.gray(` ─────────────────────────────────────────────────────────`));
}

/**
 * GENERATOR DEVICE FINGERPRINT (ANTI-DETECTION)
 */
function generateDynamicDevice() {
    const idfa = uuidv4().toUpperCase();
    const uniqueId = uuidv4().toUpperCase();

    const appleDevices = [
        { model: "iPhone14,3", name: "iPhone 13 Pro Max", res: "2778x1284", os: "16_0", build: "20A362" }
    ];

    const selected = appleDevices[Math.floor(Math.random() * appleDevices.length)];
    const timezones = ["Asia/Jakarta"];
    const selectedTz = timezones[Math.floor(Math.random() * timezones.length)];

    const fpObject = {
        "device_name": selected.name,
        "timezone": selectedTz,
        "is_emulator": false,
        "versionName": "2.368.0",
        "unique_id": uniqueId,
        "user_agent": `Mozilla/5.0 (iPhone; CPU iPhone OS ${selected.os} like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/${selected.build}`,
        "location_latitude": "0",
        "device_manufacturer": "Apple",
        "device_system": "iOS",
        "location_longitude": "0",
        "language": "id-ID",
        "device_model": selected.model,
        "is_tablet": false,
        "current_os": "26.2.1",
        "screen_resolution": selected.res,
        "idfa": idfa,
        "access_type": 4,
        "is_jailbroken_rooted": false
    };

    const fpData = Buffer.from(JSON.stringify(fpObject)).toString('base64');
    const fpHash = crypto.createHash('md5').update(fpData).digest('hex');

    return { 
        fpData, 
        fpHash, 
        bdDeviceId: "763170" + Math.floor(Math.random() * 1000000000000) 
    };
}

/**
 * HELPER: GQL REQUEST SENDER
 */
async function sendGql(query, variables, session, device, path, stolenCookie, auth = null) {
    const bodyPayload = JSON.stringify({ query, variables });
    const STUB_FRESH = crypto.createHash('md5').update(bodyPayload).digest('hex').toUpperCase();
    const KHRONOS_AUTO = Math.floor(Date.now() / 1000).toString();
    //const GORGON_FRESH = '8404c0ee000020e699b636ec81583067ee8a30c38061fc043167'; 

    const headers = {
        'Host': 'gql.tokopedia.com',
        'Content-Type': 'application/json; encoding=utf-8',
        'User-Agent': 'Tokopedia/2.368.0 (com.tokopedia.Tokopedia; build:202604172026; iOS 26.2.1) Alamofire/1.0.0',
        'Accept': 'application/json',
        'Tkpd-SessionId': session,
        'X-Tkpd-Path': path,
        'Fingerprint-Data': device.fpData,
        'Fingerprint-Hash': device.fpHash,
        //'X-Gorgon': GORGON_FRESH,
        'X-SS-STUB': STUB_FRESH,
        'Cookie': stolenCookie || "",
        'X-Tkpd-Authorization': auth || 'TKPD Tokopedia:/C/jiL4y4Ut5fOcUOb8o+qClWEY=',
        'Authorization': auth || 'TKPD Tokopedia:/C/jiL4y4Ut5fOcUOb8o+qClWEY=',
        'X-Khronos': KHRONOS_AUTO,
        'bd-device-id': device.bdDeviceId,
        'Connection': 'keep-alive',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'id-ID;q=1.0, en-ID;q=0.9'
    };

    if (path.includes('register') || path.includes('secure')) {
        headers['Accounts-Authorization'] = 'dzFIWXBpZFNocmU=D90F';
    }

    try {
        return await axios.post('https://gql.tokopedia.com/graphql', 
            { query, variables }, 
            { headers, timeout: 10000 }
        );
    } catch (err) {
        return { data: { errors: [{ message: err.message }] } };
    }
}
/**
 * 👤 FUNGSI GET RANDOM NAME (INDONESIA)
 * URL diacak biar namanya nggak Unggul Nashiruddin terus
 */
async function getRandomName() {
    console.log(chalk.cyan(` [i] Mengambil Nama Random dari Web...`));
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        // Trik: Kita bikin angka random buat parameter 's' (seed) 
        // atau pake URL tanpa seed biar dapet yang fresh
        const randomSeed = Math.floor(Math.random() * 10000);
        const targetUrl = `https://www.random-name-generator.com/indonesia?s=${randomSeed}&n=1`;

        await page.goto(targetUrl, { 
            waitUntil: 'networkidle', 
            timeout: 60000 
        });

        const nameRaw = await page.evaluate(() => {
            // Target selector dl.row dd.h4.col-12
            const el = document.querySelector('dl.row dd.h4.col-12');
            if (el) {
                const clone = el.cloneNode(true);
                const smallTag = clone.querySelector('small');
                if (smallTag) smallTag.remove(); 
                return clone.innerText.trim();
            }
            return null;
        });

        await browser.close();

        if (nameRaw) {
            const cleanName = nameRaw.split('\n')[0].trim();
            console.log(chalk.green(` [✓] Nama Didapatkan: ${cleanName}`));
            return cleanName;
        } else {
            throw new Error("Selector Nama Tidak Ditemukan");
        }

    } catch (e) {
        if (browser) await browser.close();
        console.log(chalk.red(` [!] Gagal nangkep nama: ${e.message}. Pakai Fallback.`));
        const fallbacks = ["Budi Santoso", "Siti Aminah", "Andi Wijaya", "Rian Hidayat"];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }
}
/**
 * 📧 POLLING INBOX (STEALTH PLAYWRIGHT)
 */
async function waitEmailOtp(email) {
    const emailLink = `https://generator.email/${email}`;
    const startTime = Date.now();
    console.log(chalk.blue(` [i] Membuka Siluman Browser untuk Inbox: ${email}`));

    const browser = await chromium.launch({ 
        headless: true // Ganti false kalau mau liat browsernya gerak
    });
    
    const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    });

    const page = await context.newPage();

    try {
        // Buka halaman utama dulu biar dapet cookie session
        await page.goto(emailLink, { waitUntil: 'networkidle', timeout: 60000 });

        while (Date.now() - startTime < 120000) { // Polling 2 menit
            // Cek elemen OTP tanpa reload full (biar cepet)
            // Sesuai HTML lo: cari angka 6 digit di dalem div/b/p
            const otpValue = await page.evaluate(() => {
                const bodyText = document.body.innerText;
                // Pastikan ada kata kunci Tokopedia
                if (bodyText.includes("Tokopedia") || bodyText.includes("Toppers")) {
                    const match = bodyText.match(/(\d{6})/g);
                    if (match) {
                        // Ambil yang paling bawah/terbaru
                        return match[match.length - 1];
                    }
                }
                return null;
            });

            if (otpValue) {
                console.log(chalk.green(`\n [✓] OTP DITEMUKAN VIA SILUMAN: `) + chalk.white.bold(otpValue));
                await browser.close();
                return otpValue;
            }

            // Kalau belum ada, refresh halamannya
            await page.reload({ waitUntil: 'domcontentloaded' });
            
            const remaining = Math.floor((120000 - (Date.now() - startTime)) / 1000);
            process.stdout.write(chalk.gray(`    > Siluman memantau inbox... ${remaining}s \r`));
            await delay(7000); 
        }
    } catch (e) {
        console.log(chalk.red(`\n [!] Browser Error: ${e.message}`));
    } finally {
        await browser.close();
    }
    return null;
}

/**
 * CORE LOGIC: REGISTER (SINKRON SNIFF EMAIL)
 */
async function startAutoRegister(index) {
    const namaAkun = await getRandomName();
    
    const device = generateDynamicDevice();
    const sessionId = uuidv4().replace(/-/g, '');
    const passWeb = "Paizuu89101!!!";
    const passEnc = "jNfSPdvROAk6Wv9OJBQAU+aegTwwHfT93RBjsf4w59/hPWVX6ZvYIa8oJnh1uNwncKVQgtuM9LgZdcrQPobudnKiC5l9SEP2gU0X8Fd0qVXB4XmhyUwm6iwRsaLhH8uayQqwgSZ8Q/0X+0hLvATJxOcOdSRJzbN5LGzWBkvYQJwP92clgVmQLR7kLLcIrCTQ7YczjJP4wbgxcv8iHAhtGTuZrAAMzzg/H9adZssx+Sso26cQ+oF+AKsfO+v+IPqKsKlMV4sxKTNcd9TAZYQ+qXdamV/KN4gW2IgmI6vPeFEnSBq1F9Ek+Bq0K24JqVINW2Lt7Xaz67FrdbCJcG4uPA==";

    console.log(chalk.yellow(`\n [ AKUN #${index} ] IDENTITAS BARU DIAKTIFKAN...`));

    try {
        // --- STEP 1: ADD TOKEN ---
        await sendGql(`mutation cmAddTokenV2($input: Token_stV2!) { cmAddTokenV2(input: $input) { UserId } }`, {
            input: { loggedStatus: "LOGGED_OUT", appName: "Tokopedia", notificationToken: sessionId, appId: "com.tokopedia.Tokopedia", deviceModel: "iOS", bytedanceDeviceID: device.bdDeviceId, sdkVersion: "26.2.1", userId: "0", requestTimestamp: Math.floor(Date.now()/1000).toString(), deviceOS: "ios", appVersion: "2.368.0" }
        }, sessionId, device, "/graphql/AppDelegates/cmAddTokenV2", "");

        // --- STEP 2: FIND IDENTITY LOOP ---
        let finalEmail = null; 
        let vToken = null;

        while (true) {
            // AMBIL NAMA DULU
        const namaAkun = await getRandomName();
        
        // BUAT EMAIL DARI NAMA (TANPA SPASI)
        const nameForEmail = namaAkun.toLowerCase().replace(/\s+/g, '');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4 angka unik
        const email = `${nameForEmail}${randomSuffix}@konterkulo.com`;
            console.log(chalk.blue(` [i] Mencoba Email: ${email}`));

            const valData = await sendGql(`query User_validate_user_data($email: String, $fullname: String, $password: String, $h: String) { validate_user_data(email: $email, fullname: $fullname, password: $password, h: $h) { is_valid is_exist } }`, { email, fullname: "", password: passEnc, h: "3fec" }, sessionId, device, "/graphql/Authentication/User_validate_user_data", "");

            if (valData.data?.data?.validate_user_data?.is_exist || !valData.data?.data?.validate_user_data?.is_valid) continue;

            await sendGql(`query User_OTPRequestV2($otpType: String!, $mode: String, $email: String, $otpDigit: Int) { OTPRequestV2(otpType: $otpType, mode: $mode, email: $email, otpDigit: $otpDigit) { success } }`, { otpType: "126", mode: "email", email, otpDigit: 6 }, sessionId, device, "/graphql/UserAccount/requestCentralizedOtpGql", "");
            
            const otp = await waitEmailOtp(email);
            if (!otp) continue;

            const valRes = await sendGql(`query User_OTPValidateV2($code: String!, $otpType: String, $email: String, $mode: String) { OTPValidateV2(code: $code, otpType: $otpType, email: $email, mode: $mode) { success validateToken } }`, { code: otp, email, mode: "email", otpType: "126" }, sessionId, device, "/graphql/UserAccount/validateCentralizedOtpGql", "");
            
            if (valRes.data?.data?.OTPValidateV2?.success) {
                vToken = valRes.data.data.OTPValidateV2.validateToken;
                finalEmail = email; break;
            }
        }

        // --- STEP 3: FINAL REGISTER ---
        const regRes = await sendGql(`mutation User_register_v2($input: RegisterV2Request!) { register_v2(input: $input) { user_id_str access_token } }`, {
            input: { fullname: namaAkun, h: "3fec", email: finalEmail, reg_type: "email", validate_token: vToken, password: passEnc, os_type: "2" }
        }, sessionId, device, "/graphql/UserAccountSharedComponents/secureRegisterEmail", "");
        console.log(chalk.green(` [✓] Berhasil menggunakan nama: ${namaAkun}`));
        if (regRes.data?.data?.register_v2?.access_token) {
            console.log(chalk.green.bold(` [✓] SUKSES: ${finalEmail}|${passWeb}`));
            fs.appendFileSync('akuntokped.txt', `${finalEmail}|${passWeb}\n`);
        }

    } catch (e) { return await startAutoRegister(index); }
}

/**
 * 🚀 MAIN CONTROLLER (MENU SYSTEM)
 */
async function main() {
    displayBanner();
    
    console.log(chalk.white(` Pilih Mode Operasi:`));
    console.log(chalk.green(` 1. Register Auto (Email + Set Password + Add OTP + Add PIN)`));
    console.log(chalk.yellow(` 2. Login with Email + Check Voucher `) + chalk.red(`(Coming Soon)`));
    console.log(chalk.gray(` ─────────────────────────────────────────────────────────`));

    const menuChoice = readline.question(chalk.yellow(' > Pilih Menu (1/2): '));

    if (menuChoice === '1') {
        const totalAkun = readline.questionInt(chalk.white('\n > Mau buat berapa akun? : '));
        console.log(chalk.gray(` ─────────────────────────────────────────────────────────`));

        for (let i = 1; i <= totalAkun; i++) {
            // Jalankan fungsi register yang udah kita racik pake Playwright & GQL
            await startAutoRegister(i);
            
            if (i < totalAkun) {
                console.log(chalk.magenta(`\n [i] Cooling down... Tunggu 10 detik biar aman.`));
                await delay(10000);
            }
        }
        
        console.log(chalk.green.bold('\n [✓] SEMUA PROSES REGISTER SELESAI!'));
        console.log(chalk.white(` [i] Cek hasil di: akuntokped.txt`));

    } else if (menuChoice === '2') {
        console.log(chalk.red('\n [!] Fitur Login & Check Voucher masih dalam tahap pengembangan (Coming Soon).'));
        console.log(chalk.yellow(' [i] Balik lagi nanti ya Bang!'));
        
        // Kasih pilihan balik ke menu awal atau exit
        const back = readline.keyInYN(chalk.white(' > Balik ke menu utama?'));
        if (back) return main();
    } else {
        console.log(chalk.red('\n [!] Pilihan tidak valid!'));
        await delay(2000);
        return main();
    }
}

/**
 * START SCRIPT
 */
main().catch(err => {
    console.error(chalk.red(`\n [!!!] FATAL ERROR: ${err.message}`));
});
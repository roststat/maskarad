import { randomBytes, scryptSync } from "node:crypto";

const password = randomBytes(24).toString("base64url");
const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");

console.log("Сохраните пароль в менеджере паролей. Он будет показан только сейчас:");
console.log(password);
console.log("Установите на сервере LEAD_ADMIN_PASSWORD_HASH:");
console.log(`${salt}:${hash}`);

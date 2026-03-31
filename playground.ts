import { loadEnvFile } from "node:process";


loadEnvFile(".env");

console.log("环境变量加载成功，当前环境变量如下：");
console.log(process.env.MURMURS_PATH)

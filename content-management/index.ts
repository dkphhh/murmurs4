import { dailyTasksRunner } from "./tasks/daily-tasks.ts";
import { readdir } from "node:fs/promises";
import pLimit from "p-limit";
// import { oneTimeTasks } from "./tasks/one-time.ts";
import path from "path";
import { loadEnvFile } from "node:process";
// ------------ 脚本配置 --------------


loadEnvFile(".env");
// 目标目录
const TARGET_DIR = process.env.MURMURS_PATH;

// ------------ 任务配置 --------------

async function runTasks(filepath: string) {
  await dailyTasksRunner(filepath);
  // 在这里添加需要执行的任务
}

// -------- 任务执行区域 -------
async function main() {
  if (!TARGET_DIR) {
    throw new Error("环境变量 MURMURS_PATH 未设置");
  }
  const allFiles = await readdir(TARGET_DIR, { recursive: true });
  const filePaths = allFiles.filter(
    (f) => typeof f === "string" && f.endsWith(".md"),
  );
  const limit = pLimit(100); // 限制并发数为 100，避免过多请求
  const tasks: Promise<void>[] = [];
  for (const filePath of filePaths) {
    const fullPath = path.join(TARGET_DIR, filePath);
    tasks.push(
      limit(() =>
        runTasks(fullPath).catch((error) => {
          console.log(`❌ 处理文件 ${fullPath} 时出现错误:`);
          throw error;
        }),
      ),
    );
  }
  const result = await Promise.allSettled(tasks);

  result.forEach((res) => {
    if (res.status === "rejected") {
      console.error(res.reason);
    }
  });

  console.log("🎉 全部处理完成！");
}

main();

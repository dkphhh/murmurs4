import { dailyTasksRunner } from "./tasks/daily-tasks.ts";
import pLimit from "p-limit";
// import { oneTimeTasks } from "./tasks/one-time.ts";
import path from "path";

// ------------ 脚本配置 --------------

// 目标目录
const TARGET_DIR =
  "/Users/dkphhh/Library/Mobile Documents/27N4MQEA55~pro~writer/Documents/docs/murmurs";

// 处理的文件，这里处理目录内所有的 markdown 文件
const glob = new Bun.Glob("**/*.md");

// ------------ 任务配置 --------------

async function runTasks(filepath: string) {
  await dailyTasksRunner(filepath);
  // 在这里添加需要执行的任务
}

// -------- 任务执行区域 -------
async function main() {
  const filePaths = glob.scan(TARGET_DIR);
  const limit = pLimit(100); // 限制并发数为 100，避免过多请求
  const tasks: Promise<void>[] = [];
  for await (const filePath of filePaths) {
    const fullPath = path.join(TARGET_DIR, filePath);
    tasks.push(
      limit(() =>
        runTasks(fullPath).catch((error) => {
          throw error(`❌ 处理文件 ${fullPath} 时出现错误:`, error);
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

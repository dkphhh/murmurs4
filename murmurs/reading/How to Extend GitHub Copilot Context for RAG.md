---
category: clipping
title: How to Extend GitHub Copilot Context for RAG
published: "2024-11-22T12:00:00+08:00"
saved: "2025-08-27T14:37:00+08:00"
public: true
author: Bekir Çankaya
source:
  url: >-
    https://medium.com/@cnkbekir/how-to-extend-github-copilot-context-for-rag-273f436c6c22
  title: How to Extend GitHub Copilot Context for RAG
  text: Bekir Çankaya
description: >-
  After watching GitHub Universe 2024 presentations, I decided to explore and
  test some of the new features. While it works great in VSCode, I wanted to dig
  deeper into its background. Specifically, I aimed to explore whether I could
  enhance its context capabilities without relying on additional plugins or
  programs. In this post, I’ll share my somewhat scattered notes on
  experimenting with the context of GitHub Copilot in VSCode.
tags:
  - AI
uuid: 20250827143700xcl0
alias: How to Extend GitHub Copilot Context for RAG
---

After watching GitHub Universe 2024 presentations, I decided to explore and test some of the new features. While it works great in VSCode, I wanted to dig deeper into its background. Specifically, I aimed to explore whether I could enhance its context capabilities without relying on additional plugins or programs. In this post, I’ll share my somewhat scattered notes on experimenting with the context of GitHub Copilot in VSCode.

**Environment Setup**:

- VSCode Version: 1.95.2
- Copilot Version: v1.245.0
- Copilot Chat Version: v0.23.2024102903 (pre-release)

In VSCode, I frequently use the `@workspace` symbol while working with Copilot. This allows Copilot to index all files within the workspace (except those ignored in `.gitignore`).

**What Happens When You Ask a Question?**

- The question is converted into an embedding vector.
- This vector is compared to the pre-generated embeddings of your project files.
- The closest matches are retrieved and sent along with your question to the LLM.

This approach is known as Retrieval-Augmented Generation (RAG).

## Get Bekir Çankaya’s stories in your inbox

Join Medium for free to get updates from this writer.

**Advantages of This Approach**:

- **Speed and Efficiency**: In large file archives, this method is significantly faster than traditional keyword-based searches.
- **Semantic Search**: Embeddings allow for context-based retrieval, not just keyword matches. For instance, asking about “AI technologies” might surface files containing “artificial intelligence.”

**Notes:**

- To begin indexing, type 'Build local workspace index' into the command palette (⇧⌘P). Even if you do not run this command, the indexing process starts when you ask a question starting with the @workspace symbol in chat.
- To view logs, go to the Command Palette and select `Output: Show Output Channels`, then choose `GitHub Copilot Chat`. You can see more logs by clicking the settings button in the top right corner and selecting `Trace`.
- It’s essential to execute the “developer: reload window” command when adding a file to `.gitignore` or removing a directory from the workspace.
- For simultaneous use of different folders in the same chat, you can add different folders with the “Add folder to workspace” command.
- Typing `Build local workspace index` in the command palette (⇧⌘P) might return: “Could not build local workspace index. [@workspace](http://twitter.com/workspace)’s indexing currently is limited to 2000 files. Found 2504 potential files to index in the workspace. A sparse local index will be used to answer questions instead.”  
  If there are too many files, indexing won’t occur, and just the IDE’s indexing will be used, potentially leading to poorer answers. To overcome this, you can alter the plugin code.  
  Edit the `getAutoIndexFileCap` and `getManualIndexFileCap` functions in the extension file, `/Users/{computerUserName}/.vscode/extensions/github.copilot-chat-{version}/dist/extension.js` by replacing their contents with `return 3000` and `return 4e3`. The value `2e3` is in [scientific notation](https://coolconversion.com/math/scientific-notation-to-decimal/Convert_2e3_to-decimal), equating to 2000.
- On Windows, the extension file path is: `C:\Users\\{computerUserName}\\.vscode\extensions\github.copilot-chat-{version}\dist\extension.js`
- After modifying the extension file, run the window reload command or restart extension host command.
- Since the extension code is minimized, using `[js-beautify](https://github.com/beautifier/js-beautify)` can improve readability when inspecting the code.
- I inserted `console.log()` at places in the extension code I wanted to monitor. Open the console with the `Toggle Developer Tools` command and follow the logs from there.
- Given that my computer has 8 cores, I changed `parallelism: 2` to `parallelism: 8`, but I haven't measured any impact on performance.
- Upon asking questions while indexing isn’t complete, a warning appears: “Still building the workspace index, response may be less accurate.”  
  This indicates the usage of a local index (maybe IDE’s index).
- Cache files on my Mac are saved to `/Users/{computerUserName}/Library/Application Support/Code/User/workspaceStorage/{workspaceId}/GitHub.copilot-chat/workspaceEmbeddingsCache-text-embedding-3-small512.json`.
- A workspaceEmbeddingsCache file of maximum size 31.9 MB is generated, though I’m unsure of the reason and specifics behind this limit. Excess files might generate unhealthy data. To increase the limit, I incremented the `max: 5e3` when creating the `_embeddingsCache` value. I modified it to `20e3.`
- In sizable projects, a timeout error arises while searching in context. Hence, I changed `this.shouldSearchTimeout` from `!0` to `!1` in the extension file.
- I experimented with using symbolic links to index files with Copilot without transferring them to the project, but Copilot didn’t recognize them.
- We have the ability to index our repositories on GitHub and use them as context, but there are [certain limitations.](https://docs.github.com/en/copilot/customizing-copilot/indexing-repositories-for-copilot-chat#indexing-limits)
- I couldn’t find a file listing indexed items. Instead, I reviewed the references sent during the chat.
- We can use `cmd+enter` to submit questions without explicitly typing `@workspace`.
- We can navigate through previously asked questions using the up/down arrow keys.

I honestly don’t know what caused the removal of these restrictions, I just changed the allowed parts and learned information I didn’t know before. I hope it is useful information for those who read it.

Sources:

- [VSCode Documentation](https://code.visualstudio.com/docs/copilot/workspace-context)
- [GitHub Universe 2024 Video](https://www.youtube.com/watch?v=MqBBEgpYh0Y)
- [GitHub Blog](https://github.blog/ai-and-ml/llms/unlocking-the-power-of-unstructured-data-with-rag/#how-does-rag-extract-value-from-unstructured-data)

(() => {
  function downloadMarkdown(content, filename) {
    const blob = new Blob([content], { type: "text/markdown" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link); // Ensure it's in the DOM
    link.click();
    document.body.removeChild(link);
  }

  function getChatContent() {
    const messages = document.querySelectorAll(".text-base");
    const canvasMessages = document.querySelectorAll(".canmore-canvas");

    if (messages.length === 0 && canvasMessages.length === 0) {
      console.warn("No chat messages found. The structure may have changed.");
      alert("No chat messages found! Try refreshing the page.");
      return null;
    }

    let mdContent = "# ChatGPT Conversation\n\n";

    function extractMessages(msgElements) {
      msgElements.forEach(msg => {
        const sender = msg.closest(".flex")?.querySelector("h3")?.innerText || "Unknown";
        let text = msg.innerText.trim();

        // Detect code blocks
        const codeBlocks = msg.querySelectorAll("pre");
        if (codeBlocks.length > 0) {
          codeBlocks.forEach(codeBlock => {
            const codeContent = codeBlock.innerText.trim();
            const langMatch = codeBlock.querySelector("code")?.className.match(/language-(\w+)/);
            const lang = langMatch ? langMatch[1] : "";
            text = text.replace(codeContent, `\n\`\`\`${lang}\n${codeContent}\n\`\`\`\n`);
          });
        }

        mdContent += `## ${sender}\n\n${text}\n\n---\n\n`;
      });
    }

    extractMessages(messages);
    extractMessages(canvasMessages);

    return mdContent;
  }

  function createExportButton() {
    if (document.getElementById("exportChatGPT")) return; // Prevent duplicates

    const btn = document.createElement("button");
    btn.id = "exportChatGPT";
    btn.innerText = "Export Chat";
    btn.style.position = "fixed";
    btn.style.bottom = "20px";
    btn.style.right = "20px";
    btn.style.padding = "10px";
    btn.style.background = "#4CAF50";
    btn.style.color = "white";
    btn.style.border = "none";
    btn.style.cursor = "pointer";
    btn.style.zIndex = "9999";

    btn.onclick = () => {
      console.log("Export button clicked");
      const mdContent = getChatContent();
      if (mdContent) {
        downloadMarkdown(mdContent, "chatgpt_conversation.md");
        alert("Chat exported successfully!");
      }
    };

    document.body.appendChild(btn);
  }

  setTimeout(() => {
    console.log("Injecting Export Button");
    createExportButton();
  }, 3000);
})();

# HR Helper - 幸運抽獎 & 分組系統

一個現代化、美觀且流暢的抽獎與分組工具。

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>  

## ✨ 特色功能

- **幸運抽獎**: 流暢的滾動動畫，即時記錄中獎者。
- **智能分組**: 自動將名單打亂並分成指定數量的小組。 
- **名單管理**: 簡單的貼上匯入機制。
- **技術棧**: 使用 React 19 + TypeScript + Vite + Tailwind CSS。

## 🚀 本地開發

**前置作業:** 已安裝 Node.js (建議 v18 以上)

1. **安裝依賴:**
   ```bash
   npm install
   ```
2. **啟動開發伺服器:** 
   ```bash
   npm run dev
   ```
3. **建立測試/生產版本:**
   ```bash
   npm run build
   ```

## 📦 部署

本專案已配置 GitHub Actions，當程式碼推送到 `main` 分支時，會自動部署到 GitHub Pages。

### 手動觸發部署
1. 前往 GitHub Repo 的 **Actions** 頁籤。
2. 選擇 **Deploy to GitHub Pages**。
3. 點擊 **Run workflow**。

## 📄 專案結構

- `components/`: UI 元件 (抽獎、分組、匯入)。
- `App.tsx`: 主要邏輯與狀態管理。
- `.github/workflows/`: 自動化部署腳本。

---
*Powered by AI Studio*

/**
 * Utility functions for formatting and displaying data
 */

/**
 * Convert state code to human-readable text
 */
export function getStateText(state: number): string {
  switch (state) {
    case 0:
      return "未プレイ";
    case 100:
      return "失敗";
    case 230:
      return "通常クリア";
    case 300:
      return "Full Comboでクリア";
    case 400:
      return "All Perfectでクリア";
    case 500:
      return "All A-Perfectでクリア";
    default:
      return "不明";
  }
}

/**
 * Convert platform code to human-readable text
 */
export function getPlatformText(platform: number): string {
  switch (platform) {
    case 0:
      return "VRChat PCVR";
    case 1:
      return "VRChat PCDesktop";
    case 2:
      return "VRChat QuestVR";
    case 3:
      return "VRChat Mobile";
    case 4:
      return "Debug User";
    default:
      return "不明";
  }
}

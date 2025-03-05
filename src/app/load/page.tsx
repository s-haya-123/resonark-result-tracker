"use client";

import { useCallback, useState } from "react";
import { FileJsonIcon } from "@/components/icon/FileJsonIcon";
import { saveJsonData } from "./actions";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// JSON データ管理用のカスタムフック
const useJsonData = () => {
  const [jsonData, setJsonData] = useState<Record<string, unknown> | null>(
    null
  );
  const [jsonText, setJsonText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const resetError = () => setError(null);
  const resetSaveStatus = () => setSaveStatus(null);
  const resetAll = () => {
    setJsonData(null);
    setJsonText("");
    setError(null);
    setSaveStatus(null);
  };

  return {
    jsonData,
    setJsonData,
    jsonText,
    setJsonText,
    error,
    setError,
    fileName,
    setFileName,
    saveStatus,
    setSaveStatus,
    resetError,
    resetSaveStatus,
    resetAll,
  };
};

// ファイル選択処理用のカスタムフック
const useFileHandler = ({
  setJsonData,
  setJsonText,
  setError,
  setFileName,
  resetError,
  resetSaveStatus,
}: ReturnType<typeof useJsonData>) => {
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      resetError();
      resetSaveStatus();

      if (!file) {
        return;
      }

      if (file.type !== "application/json" && !file.name.endsWith(".json")) {
        setError("選択されたファイルはJSONファイルではありません。");
        return;
      }

      setFileName(file.name);

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);
          setJsonData(parsedData);
          setJsonText(JSON.stringify(parsedData, null, 2));
        } catch (err: unknown) {
          console.error("JSON parse error:", err);
          setError(
            "JSONの解析に失敗しました。ファイルが正しいJSON形式であることを確認してください。"
          );
          setJsonData(null);
          setJsonText("");
        }
      };

      reader.onerror = () => {
        setError("ファイルの読み込み中にエラーが発生しました。");
        setJsonData(null);
        setJsonText("");
      };

      reader.readAsText(file);
    },
    [
      setError,
      setFileName,
      setJsonData,
      setJsonText,
      resetError,
      resetSaveStatus,
    ]
  );

  return { handleFileChange };
};

// テキスト編集処理用のカスタムフック
const useTextHandler = ({
  setJsonData,
  setJsonText,
  setError,
  setSaveStatus,
  resetSaveStatus,
}: ReturnType<typeof useJsonData>) => {
  const handleTextChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const text = event.target.value;
      setJsonText(text);
      setSaveStatus(null);

      try {
        const parsedData = JSON.parse(text);
        setJsonData(parsedData);
        setError(null);
      } catch {
        setError("JSONの形式が正しくありません。");
        // Don't clear jsonData here to allow for temporary invalid JSON during editing
      }
    },
    [setError, setJsonData, setJsonText, setSaveStatus]
  );

  // クリップボードからのペースト処理
  const handlePaste = useCallback(async () => {
    try {
      resetSaveStatus();

      // Check if clipboard API is available
      if (!navigator.clipboard) {
        throw new Error(
          "お使いのブラウザはクリップボード機能をサポートしていません。"
        );
      }

      try {
        const text = await navigator.clipboard.readText();

        if (!text) {
          toast.error("クリップボードが空か、テキストデータではありません。");
          return;
        }

        setJsonText(text);

        try {
          const parsedData = JSON.parse(text);
          setJsonData(parsedData);
          setError(null);
          toast.success("クリップボードからデータを貼り付けました");
        } catch (parseErr) {
          console.error("JSON parse error:", parseErr);
          setError("JSONの形式が正しくありません。");
        }
      } catch (clipboardErr: unknown) {
        console.error("Clipboard read error:", clipboardErr);

        // Handle permission errors specifically
        if (
          clipboardErr instanceof Error &&
          clipboardErr.name === "NotAllowedError"
        ) {
          setError("クリップボードへのアクセス許可が必要です。");
          toast.error(
            "クリップボードへのアクセスが拒否されました。ブラウザの設定を確認してください。"
          );
        } else {
          setError("クリップボードからの読み込みに失敗しました。");
        }
      }
    } catch (err) {
      console.error("Clipboard error:", err);
      setError(
        `クリップボードエラー: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
    }
  }, [setError, setJsonData, setJsonText, resetSaveStatus]);

  return { handleTextChange, handlePaste };
};

// 保存処理用のカスタムフック
const useSaveHandler = (jsonState: ReturnType<typeof useJsonData>) => {
  const { jsonData, setError, setSaveStatus } = jsonState;

  const handleSave = async () => {
    if (!jsonData) {
      setError("保存するJSONデータがありません。");
      return;
    }

    setSaveStatus("保存中...");
    setError(null);

    try {
      // サーバーアクションを呼び出してデータを保存
      const result = await saveJsonData(jsonData);

      if (result.status === "success") {
        toast.success("データが正常に保存されました。");
        setSaveStatus(null);
      } else {
        throw new Error("保存に失敗しました。");
      }
    } catch (err) {
      console.error("Save error:", err);
      setError(
        `データの保存中にエラーが発生しました: ${
          err instanceof Error ? err.message : String(err)
        }`
      );
      setSaveStatus(null);
    }
  };

  return { handleSave };
};

export default function LoadPage() {
  const jsonState = useJsonData();
  const { handleFileChange } = useFileHandler(jsonState);
  const { handleTextChange, handlePaste } = useTextHandler(jsonState);
  const { handleSave } = useSaveHandler(jsonState);

  const { jsonData, jsonText, error, fileName, saveStatus } = jsonState;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Exportされたデータ読み込み</h1>

      <div className="mb-8">
        <label
          htmlFor="json-file"
          className="block w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <FileJsonIcon className="mb-2" />
            <span className="text-sm font-medium">
              {fileName ? fileName : "ファイルを選択またはドラッグ&ドロップ"}
            </span>
            <span className="text-xs text-gray-500">
              .エクスポートされたデータを保存したファイルを選択
            </span>
          </div>
          <input
            id="json-file"
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {error && (
        <div className="p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">
          エクスポートされたデータ詳細
        </h2>
        <div className="flex items-center justify-between mb-2">
          <div>コピーしたデータを直接以下に貼り付けても読み込めます</div>
          <Button
            variant="outline"
            onClick={handlePaste}
            className="flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            クリップボードから貼り付け
          </Button>
        </div>
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-md overflow-auto">
          <textarea
            className="w-full h-96 font-mono text-sm"
            value={jsonText}
            onChange={handleTextChange}
            spellCheck={false}
          />
        </div>

        <div className="mt-4">
          <Button
            onClick={handleSave}
            disabled={!jsonData || jsonText.trim() === ""}
          >
            保存
          </Button>

          {saveStatus && (
            <span className="ml-2 text-gray-500">{saveStatus}</span>
          )}
        </div>
      </div>
    </div>
  );
}

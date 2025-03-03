"use client";

import { useState } from "react";
import { FileJsonIcon } from "@/components/icon/FileJsonIcon";
import { saveJsonData } from "./actions";

export default function LoadPage() {
  const [jsonData, setJsonData] = useState<Record<string, unknown> | null>(
    null
  );
  const [jsonText, setJsonText] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    setSaveStatus(null);

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
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
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
  };

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

      if (result.success) {
        setSaveStatus("データが正常に保存されました。");
      } else {
        throw new Error(result.error || "保存に失敗しました。");
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">JSONファイルローダー</h1>

      <div className="mb-8">
        <label
          htmlFor="json-file"
          className="block w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <FileJsonIcon className="mb-2" />
            <span className="text-sm font-medium">
              {fileName
                ? fileName
                : "JSONファイルを選択またはドラッグ&ドロップ"}
            </span>
            <span className="text-xs text-gray-500">
              .json形式のファイルのみ
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

      {jsonData && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">JSONデータ</h2>
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md overflow-auto">
            <textarea
              className="w-full h-96 font-mono text-sm"
              value={jsonText}
              onChange={handleTextChange}
              spellCheck={false}
            />
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              disabled={!jsonData}
            >
              保存
            </button>

            {saveStatus && (
              <div className="p-2 bg-green-50 border border-green-200 rounded-md text-green-600">
                {saveStatus}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

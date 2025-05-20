"use client";
import React, { useState, useEffect } from "react";

interface CommentFormProps {
  initialText?: string;
  label: string; // e.g., "Update", "Reply"
  onSubmit: (text: string) => void;
  onCancel: () => void;
}

const CommentForm: React.FC<CommentFormProps> = ({
  initialText = "",
  label,
  onSubmit,
  onCancel,
}) => {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText); // Reset when switching between edit/reply
  }, [initialText]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (text.trim()) {
          onSubmit(text.trim());
          setText("");
        }
      }}
      className="flex flex-col gap-2"
    >
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        placeholder="Write your message..."
        className="w-full rounded-lg border border-gray-300 p-3 text-gray-800 placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-none"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm px-4 py-1.5 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="text-sm px-4 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {label}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;

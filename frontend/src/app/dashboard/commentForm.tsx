"use client";
import React, { useState } from "react";
import moment from "moment";
import CommentForm from "./cmtform"; // Assumes you have this reusable

interface Comment {
  author: string;
  text: string;
  date: string;
}

interface BlogPost {
  _id: string;
  title: string;
  comments?: Comment[];
}

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPost: BlogPost | null;
  commentText: string;
  setCommentText: (text: string) => void;
  onSubmit: () => void;
}

export default function CommentModal({
  isOpen,
  onClose,
  selectedPost,
  commentText,
  setCommentText,
  onSubmit,
}: CommentModalProps) {
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [replyIndex, setReplyIndex] = useState<number | null>(null);
  
  const handleEdit = (index: number) => {
    setEditIndex(index);
    setReplyIndex(null);
  };

  const handleReply = (index: number) => {
    setReplyIndex(index);
    setEditIndex(null);
  };

  const handleCancel = () => {
    setEditIndex(null);
    setReplyIndex(null);
  };

  if (!isOpen || !selectedPost) return null;


  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 md:mx-0 p-8 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="flex justify-between items-center mb-6">
          <h2
            id="modal-title"
            className="text-2xl font-semibold text-gray-900 leading-tight"
          >
            Comments on: <span className="italic text-indigo-600">{selectedPost.title}</span>
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <section className="flex-grow overflow-y-auto max-h-96 mb-6 pr-2">
          {selectedPost.comments && selectedPost.comments.length > 0 ? (
            selectedPost.comments.map((comment, idx) => (
              <article
                key={idx}
                className="border-b border-gray-200 py-4 last:border-0"
                role="article"
                aria-label={`Comment by ${comment.author}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-gray-800">{comment.author}</h3>
                  <time
                    className="text-xs text-gray-400"
                    dateTime={comment.date}
                    title={moment(comment.date).format("LLL")}
                  >
                    {moment(comment.date).fromNow()}
                  </time>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>

                 <div className="flex gap-4 mt-2 text-sm text-blue-600">
                  <button onClick={() => handleEdit(idx)}>✏️ Edit</button>
                  <button onClick={() => handleReply(idx)}>💬 Reply</button>
                </div>

                {editIndex === idx && (
                  <div className="mt-2">
                    <CommentForm
                      initialText={comment.text}
                      label="Update"
                      onSubmit={(updatedText) => {
                        console.log("Update comment:", updatedText, "at index:", idx);
                        handleCancel();
                      }}
                      onCancel={handleCancel}
                    />
                  </div>
                )}

                {replyIndex === idx && (
                  <div className="mt-2">
                    <CommentForm
                      label="Reply"
                      onSubmit={(replyText) => {
                        console.log("Reply to comment:", replyText, "at index:", idx);
                        handleCancel();
                      }}
                      onCancel={handleCancel}
                    />
                  </div>
                )}
              </article>
            ))
          ) : (
            <p className="text-center text-gray-400 italic">No comments yet. Be the first!</p>
          )}
        </section>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex flex-col space-y-4"
        >
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Write your comment here..."
            rows={4}
            className="resize-none rounded-lg border border-gray-300 p-4 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
            required
          />

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold"
            >
              Submit Comment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

export default function PostEditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const splitTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    setTags(splitTags);
  }, [tagsInput]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Start writing your blog..." }),
    ],
    content: "",
      immediatelyRender: false,  // <--- Add this

  });

  useEffect(() => {
  if (!postId) return;
  if (!editor || !editor.isEditable) return; // Wait until editor is ready

  setLoading(true);

  fetch(`http://localhost:5000/api/blogs/${postId}`)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load post");
      return res.json();
    })
    .then((data) => {
      setTitle(data.title);
      setTagsInput(data.tags?.join(", ") || "");
      setExistingImageUrl(data.image || null);

      // 👇 Ensure editor is actually ready before setting content
      setTimeout(() => {
        editor.commands.setContent(data.content || "");
      }, 0);
    })
    .catch((err) => {
      console.error(err);
      alert("Error loading post");
    })
    .finally(() => setLoading(false));
}, [postId, editor]);


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setExistingImageUrl(null);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async () => {
    const content = editor?.getHTML();
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username") || "anonymous";

    if (!token) {
        alert("User not authenticated. Please log in.");
        router.push("/login")
        return;
    }
    if (!title.trim() || !content?.trim()) {
      alert("Please add title and content");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("author", username);
    formData.append("tags", tags.join(","));
    if (image) formData.append("image", image);
    else if (existingImageUrl) formData.append("image", existingImageUrl);

    try {
      const res = await fetch(
        postId
          ? `http://localhost:5000/api/blogs/${postId}`
          : "http://localhost:5000/api/blogs",
        {
          method: postId ? "PUT" : "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Failed to save post");

      alert(postId ? "Post updated!" : "Post created!");
      router.push("/dashboard");
    } catch (err) {
      alert("Error saving post");
      console.error(err);
    }
  };

  if (loading) return <p>Loading post...</p>;

  return (
    <main className="min-h-screen flex justify-center pt-12 px-4 bg-gradient-to-br from-blue-100 to-blue-50 font-poppins text-gray-700">
      <section className="bg-white rounded-2xl max-w-4xl w-full p-8 shadow-lg">
        <h1 className="text-center font-semibold mb-8 text-3xl text-blue-800">
          {postId ? "Edit Your Blog Post" : "Write Your Blog Post"}
        </h1>

        {/* Title */}
        <label htmlFor="title" className="block font-semibold mb-2">
          Post Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
  className="w-full px-4 py-3 mb-6 rounded-xl border-2 border-gray-300 bg-white text-gray-900"
        />

        {/* Tags */}
        <label htmlFor="tags-input" className="block font-semibold mb-2">
          Tags (comma separated)
        </label>
        <input
          id="tags-input"
          type="text"
          placeholder="Add tags separated by commas"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
className="w-full px-4 py-3 mb-6 rounded-xl border-2 border-gray-300 bg-white text-gray-900"
  style={{ caretColor: "black" }}        />

        {/* Image */}
        <label htmlFor="photo" className="block font-semibold mb-2">
          Select Photo
        </label>
        <input
          id="photo"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full mb-6"
        />
        {(imagePreview || existingImageUrl) && (
          <div className="relative mb-4">
            <img
              src={imagePreview || existingImageUrl!}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded"
            />
            <button
              onClick={() => {
                setImage(null);
                setImagePreview(null);
                setExistingImageUrl(null);
              }}
              className="absolute top-2 right-2 bg-white rounded-full px-2 text-red-600"
              aria-label="Remove image"
            >
              ✕
            </button>
          </div>
        )}

        {/* Editor toolbar */}
        <div className="flex gap-4 bg-gray-100 rounded-xl px-4 py-2 mb-4">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            aria-pressed={editor?.isActive("bold")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              editor?.isActive("bold") ? "text-blue-600 scale-125" : "text-gray-600"
            }`}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            aria-pressed={editor?.isActive("italic")}
            className={`w-10 h-10 flex items-center justify-center rounded-lg ${
              editor?.isActive("italic") ? "text-blue-600 scale-125" : "text-gray-600"
            }`}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
        </div>

        {/* Editor content */}
        <div className="rounded-2xl border border-gray-300 bg-gray-50 p-6 min-h-[250px] max-h-[600px] overflow-auto prose prose-lg">
          <EditorContent editor={editor} />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded-xl px-6 py-3 bg-gray-300 text-gray-800 font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold shadow-lg"
          >
            {postId ? "Update Post" : "Publish Post"}
          </button>
        </div>
      </section>
    </main>
  );
}

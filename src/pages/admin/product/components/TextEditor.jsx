import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TextEditor = ({ defaultDes, onChange }) => {
  const [content, setContent] = useState("");

  useEffect(() => {
    if (defaultDes) {
      setContent(defaultDes);
    }
  }, [defaultDes]);

  const handleEditorChange = (newValue) => {
    setContent(newValue);
    if (onChange) {
      onChange(newValue); // Gửi nội dung lên component cha
    }
  };

  return (
    <div className="w-full">
      <p className="mb-1">Mô tả</p>
      <Editor
        apiKey="moe3bztof70vvogqr7l0lzbvet2o4o79cptwecrhv1v0krj3"
        value={content}
        onEditorChange={handleEditorChange}
        init={{
          height: 300,
          menubar: false,
          plugins: "lists link image code",
          toolbar:
            "undo redo | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link image | code",
          images_upload_url: "/upload",
        }}
      />
    </div>
  );
};

export default TextEditor;

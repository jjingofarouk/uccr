// StepContent.jsx
import dynamic from 'next/dynamic';
import Image from 'next/image';
import styles from '../../styles/caseForm.module.css';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import Link from '@tiptap/extension-link';
import LineHeight from 'tiptap-extension-line-height';

const TiptapEditor = dynamic(() => Promise.resolve(EditorContent), { ssr: false });

const TiptapToolbar = ({ editor }) => {
  if (!editor) return null;

  return (
    <div className={styles.toolbar}>
      <select
        onChange={(e) => editor.chain().focus().toggleHeading({ level: Number(e.target.value) }).run()}
        value={editor.isActive('heading') ? editor.getAttributes('heading').level || '' : ''}
      >
        <option value="">Normal</option>
        <option value="1">H1</option>
        <option value="2">H2</option>
      </select>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? styles.active : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? styles.active : ''}
      >
        Italic
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? styles.active : ''}
      >
        Underline
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? styles.active : ''}
      >
        Ordered List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? styles.active : ''}
      >
        Bullet List
      </button>
      <button
        onClick={() =>
          editor.chain().focus().setLink({ href: prompt('Enter URL') || '' }).run()
        }
        className={editor.isActive('link') ? styles.active : ''}
      >
        Link
      </button>
      <select
        onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
        value={editor.getAttributes('lineHeight')?.lineHeight || '1'}
      >
        <option value="1">1</option>
        <option value="1.15">1.15</option>
        <option value="1.5">1.5</option>
        <option value="1.75">1.75</option>
        <option value="2">2</option>
      </select>
      <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
        Insert Table
      </button>
      <button
        onClick={() => editor.chain().focus().addRowAfter().run()}
        disabled={!editor.can().addRowAfter()}
      >
        Add Row
      </button>
      <button
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        disabled={!editor.can().addColumnAfter()}
      >
        Add Column
      </button>
      <button
        onClick={() => editor.chain().focus().deleteTable().run()}
        disabled={!editor.can().deleteTable()}
      >
        Delete Table
      </button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
        Clean
      </button>
    </div>
  );
};

export default function StepContent({
  steps,
  currentStep,
  formData,
  handleChange,
  handleDeleteMedia,
  widgetRef,
  isUploading,
  isEditMode = false,
}) {
  const step = steps[currentStep];

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Link.configure({
        openOnClick: false,
      }),
      LineHeight,
    ],
    content: formData[step.name],
    onUpdate: ({ editor }) => handleChange(editor.getHTML(), step.name),
  });

  return (
    <div className={styles.carousel}>
      <div
        className={styles.carouselInner}
        style={{
          display: 'flex',
          width: `${steps.length * 100}%`,
          transition: 'transform 0.4s ease-in-out',
          transform: `translateX(-${currentStep * (100 / steps.length)}%)`,
        }}
      >
        {steps.map((step, index) => (
          <div
            key={step.name}
            className={`${styles.carouselItem} ${index === currentStep ? styles.active : ''}`}
            style={{
              width: `${100 / steps.length}%`,
              flexShrink: 0,
              padding: '0 1.5rem',
              boxSizing: 'border-box',
            }}
          >
            <div className={styles.stepContent}>
              <label className={styles.fieldLabel}>{step.label}</label>
              {step.type === 'richtext' && (
                <div className={styles.quillEditor}>
                  <TiptapToolbar editor={editor} />
                  <TiptapEditor editor={editor} placeholder={step.placeholder} />
                </div>
              )}
              {step.type === 'select' && (
                <select
                  name={step.name}
                  value={formData[step.name]}
                  onChange={(e) => handleChange(e, step.name)}
                  multiple
                  size="5"
                  className={styles.selectInput}
                >
                  {step.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {step.type === 'media' && (
                <div className={styles.mediaSection}>
                  <button
                    type="button"
                    onClick={() => {
                      widgetRef.current?.open();
                      if (window.gtag && !isEditMode) {
                        window.gtag('event', 'media_upload_button_clicked', {
                          event_category: 'CaseForm',
                          event_label: 'Upload Media Button Clicked',
                        });
                      }
                    }}
                    disabled={!widgetRef.current || isUploading}
                    className={styles.uploadButton}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.uploadIcon}
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    {isUploading ? 'Uploading...' : 'Upload Media'}
                  </button>
                  {formData.mediaUrls.length > 0 && (
                    <div className={styles.mediaPreview}>
                      <p className={styles.mediaPreviewLabel}>Uploaded media:</p>
                      <div className={styles.mediaGrid}>
                        {formData.mediaUrls.map((url, index) => (
                          <div key={index} className={styles.mediaItem}>
                            <Image
                              src={url}
                              alt={`Uploaded media ${index + 1}`}
                              width={140}
                              height={140}
                              className={styles.mediaImage}
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteMedia(index)}
                              disabled={isUploading}
                              className={styles.deleteButton}
                              aria-label="Delete media"
                            >
                              <svg
                                xmlns="http://www.w3.org/200观念/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className={styles.deleteIcon}
                              >
                                <path d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
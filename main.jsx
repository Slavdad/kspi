import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function DocumentViewer({ imageUrl, title, onUpload }) {
  const [imageOffset, setImageOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  useEffect(() => {
    setImageOffset({ x: 0, y: 0 });
    dragRef.current = null;
    setIsDragging(false);
  }, [imageUrl]);

  function handleImagePointerDown(event) {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: imageOffset.x,
      originY: imageOffset.y,
    };

    setIsDragging(true);
  }

  function handleImagePointerMove(event) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    setImageOffset({
      x: drag.originX + event.clientX - drag.startX,
      y: drag.originY + event.clientY - drag.startY,
    });
  }

  function handleImagePointerUp(event) {
    const drag = dragRef.current;

    if (!drag || drag.pointerId !== event.pointerId) {
      return;
    }

    dragRef.current = null;
    setIsDragging(false);
  }

  return (
    <section className="document-card" aria-label={title}>
      <div className="document-image-area">
        {imageUrl ? (
          <img
            className={`document-image${isDragging ? ' document-image-dragging' : ''}`}
            src={imageUrl}
            alt={title}
            draggable="false"
            style={{ transform: `translate3d(${imageOffset.x}px, ${imageOffset.y}px, 0)` }}
            onPointerDown={handleImagePointerDown}
            onPointerMove={handleImagePointerMove}
            onPointerUp={handleImagePointerUp}
            onPointerCancel={handleImagePointerUp}
          />
        ) : (
          <button className="document-placeholder" type="button" onClick={onUpload}>
            <span className="document-placeholder-icon" aria-hidden="true">
              🖼
            </span>
            <span className="document-placeholder-title">Загрузите фото документа</span>
            <span className="document-placeholder-subtitle">PNG, JPG, HEIC</span>
          </button>
        )}
      </div>
    </section>
  );
}

function IdentityDocumentScreen() {
  const [imageUrl, setImageUrl] = useState();
  const inputRef = useRef(null);

  function handleUploadClick() {
    inputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageUrl(URL.createObjectURL(file));
  }

  return (
    <main className="identity-screen">
      <div className="identity-safe-area">
        <header className="identity-header">
          <button className="header-back-button" type="button" aria-label="Назад">
            ‹
          </button>

          <h1 className="identity-title">Удостоверение личности</h1>

          <div className="header-spacer" aria-hidden="true" />
        </header>

        <div className="identity-content">
          <div className="document-tabs" role="tablist" aria-label="Разделы документа">
            <button className="document-tab document-tab-active" type="button" role="tab" aria-selected="true">
              Документ
            </button>

            <button className="document-tab" type="button" role="tab" aria-selected="false">
              Реквизиты
            </button>
          </div>

          <DocumentViewer imageUrl={imageUrl} title="Фото удостоверения личности" onUpload={handleUploadClick} />

          <button className="primary-action-button" type="button">
            <img
              className="button-icon qr-button-icon"
              src="/qr_icon_vector_full_canvas.svg"
              alt=""
              aria-hidden="true"
            />
            <span>Предъявить документ</span>
          </button>

          <button className="secondary-action-button" type="button">
            <img className="button-icon" src="/share_icon.svg" alt="" aria-hidden="true" />
            <span>Отправить документ</span>
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/heic,image/heif"
        hidden
        onChange={handleFileChange}
      />
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <IdentityDocumentScreen />
  </React.StrictMode>,
);

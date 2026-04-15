"use client";

const WHATSAPP_URL = "https://wa.me/16048335801?text=";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-[9999] flex h-12 w-12 items-center justify-center rounded-full border border-[#25d366]/60 bg-[#25d366] text-white shadow-[0_10px_32px_-10px_rgba(37,211,102,0.7)] transition-[transform,filter,box-shadow] hover:brightness-110 hover:shadow-[0_14px_36px_-10px_rgba(37,211,102,0.8)] active:scale-95 print:hidden max-[380px]:bottom-3 max-[380px]:right-3 bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-[max(1rem,env(safe-area-inset-right,0px))]"
      aria-label="Open WhatsApp chat"
      title="WhatsApp"
    >
      <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden>
        <path d="M19.11 17.29c-.28-.14-1.64-.81-1.9-.9-.25-.09-.44-.14-.62.14-.18.28-.72.9-.88 1.09-.16.19-.33.21-.61.07-.28-.14-1.17-.43-2.23-1.37-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.41-.49.14-.16.18-.28.28-.46.09-.19.05-.35-.02-.49-.07-.14-.62-1.5-.85-2.06-.22-.53-.45-.46-.62-.47l-.53-.01c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.35s1 2.74 1.14 2.93c.14.19 1.96 2.99 4.75 4.2.66.28 1.17.45 1.57.57.66.21 1.26.18 1.74.11.53-.08 1.64-.67 1.87-1.32.23-.65.23-1.2.16-1.32-.06-.11-.24-.18-.52-.32M16 4.8c-6.17 0-11.2 5.02-11.2 11.2 0 1.96.51 3.88 1.47 5.57L4.7 27.2l5.79-1.52a11.16 11.16 0 0 0 5.51 1.49c6.17 0 11.2-5.02 11.2-11.2S22.17 4.8 16 4.8m0 20.38c-1.69 0-3.34-.46-4.78-1.32l-.34-.2-3.44.9.92-3.35-.22-.35a9.2 9.2 0 0 1-1.42-4.9c0-5.09 4.14-9.23 9.23-9.23s9.23 4.14 9.23 9.23-4.14 9.22-9.23 9.22" />
      </svg>
    </a>
  );
}

"use client";

import { useRouter } from "next/navigation";

export function BackToShowCatalog() {
  const router = useRouter();

  function goBack() {
    if (typeof window !== "undefined" && window.history.length > 1 && document.referrer.startsWith(window.location.origin)) {
      router.back();
      return;
    }
    router.push("/spektakli");
  }

  return (
    <button className="back-to-show-catalog" type="button" onClick={goBack}>
      <span aria-hidden="true">←</span> Вернуться к спектаклям
    </button>
  );
}

import { useEffect, useState } from "react";

interface Signature {
  id: string;
  message: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface GuestbookPage {
  content: Signature[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export default function Guestbook() {
  const [data, setData] = useState<GuestbookPage | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/signature?page=${currentPage}&size=4`)
      .then((res) => res.json())
      .then((json) => setData(json));
  }, [currentPage]);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")} - ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="flex flex-col min-h-100 md:h-full px-8 py-6 bg-[#d2cec649]">
      <h2 className="text-3xl font-light mb-6 text-[#026773]">Guestbook</h2>

      <div className="flex flex-col gap-6 flex-1">
        {data?.content.map((sig) => (
          <div key={sig.id} className="border-b border-gray-400 pb-4">
            <p className="text-sm text-gray-600 mb-1">{sig.author}</p>
            <p className="text-base">{sig.message}</p>
            <p className="text-xs text-gray-600 text-right mt-2">{formatDate(sig.createdAt)}</p>
          </div>
        ))}
      </div>

      {data && data.page.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: data.page.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i)}
              className={`w-2 h-2 rounded-full ${i === currentPage ? "bg-gray-800" : "bg-gray-300"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}


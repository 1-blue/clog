import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import useDebounce from "#web/hooks/useDebounce";
import useReplaceQueryParams from "#web/hooks/useReplaceQueryParams";

const GymSearchInput: React.FC = () => {
  const searchParams = useSearchParams();
  const { replaceQueryParams } = useReplaceQueryParams();

  const search = searchParams.get("search") ?? "";
  const [draftSearch, setDraftSearch] = useState(search);
  const debouncedSearch = useDebounce(draftSearch, 300);

  // 뒤로가기/앞으로가기 등으로 query가 바뀌면 입력값도 동기화
  useEffect(() => {
    setDraftSearch(search);
  }, [search]);

  // 입력은 즉시 반영하지 않고, 디바운스된 값만 query-string에 반영
  useEffect(() => {
    if (debouncedSearch.trim() === search) return;

    replaceQueryParams(
      { search: debouncedSearch },
      { trim: true, scroll: false },
    );
  }, [debouncedSearch, replaceQueryParams, search]);

  return (
    <div className="relative">
      <Search
        className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-on-surface-variant"
        strokeWidth={2}
        aria-hidden
      />
      <input
        type="text"
        value={draftSearch}
        onChange={(e) => setDraftSearch(e.target.value)}
        placeholder="암장 이름 또는 주소 검색"
        className="w-full rounded-2xl bg-surface-container-high py-3 pr-4 pl-10 text-sm text-on-surface placeholder:text-on-surface-variant focus:ring-1 focus:ring-primary focus:outline-none"
      />
    </div>
  );
};

export default GymSearchInput;

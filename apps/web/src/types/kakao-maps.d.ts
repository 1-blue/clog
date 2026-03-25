/** 카카오맵 JS SDK (동적 로드, libraries=services 선택) */
interface Window {
  kakao?: {
    maps: {
      load: (callback: () => void) => void;
      LatLng: new (lat: number, lng: number) => object;
      Map: new (
        container: HTMLElement,
        options: { center: object; level: number },
      ) => object;
      Marker: new (options: {
        position: object;
        map: object;
        title?: string;
      }) => { setMap: (v: unknown) => void };
      /** `libraries=services` 로드 시에만 존재 */
      services?: {
        Places: new () => {
          categorySearch: (
            code: string,
            callback: (result: unknown, status: unknown) => void,
            options: Record<string, unknown>,
          ) => void;
        };
        Status: { OK: unknown };
        SortBy: { DISTANCE: unknown };
      };
    };
  };
}

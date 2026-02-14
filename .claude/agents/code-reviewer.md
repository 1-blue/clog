# Agent: Code Reviewer (코드 리뷰어)

## 역할
프로젝트 컨벤션에 맞는지 코드를 검토하고, 개선점을 제안한다.

## 사용 시나리오
- "이 파일 리뷰해줘"
- "컨벤션 지키고 있는지 확인해줘"
- "코드 품질 점검해줘"

## 체크리스트

### 구조
- [ ] _source 디렉토리 패턴 준수
- [ ] page.tsx에 metadata + ErrorBoundary + Suspense 포함
- [ ] Skeleton 컴포넌트 존재 (Suspense 사용 시)

### Import
- [ ] 워크스페이스 패키지: `@clog/db`, `@clog/libs`
- [ ] 앱 내부: `#/src/` path alias
- [ ] "use client" 필요한 곳에만 사용

### 데이터 패칭
- [ ] Query Keys Factory 패턴 사용
- [ ] useSuspenseQuery / useQuery 적절한 사용
- [ ] mutation의 onSuccess에서 invalidateQueries
- [ ] Supabase 쿼리에 에러 처리 (if (error) throw error)

### UI/UX
- [ ] cn() 유틸리티 사용
- [ ] clog-section 클래스 적용
- [ ] Badge로 상태 표시
- [ ] 한국어 UI 텍스트
- [ ] 날짜 형식: yyyy.MM.dd (date-fns + ko locale)
- [ ] 빈 상태 처리

### 폼
- [ ] Zod 스키마 정의
- [ ] FormProvider 사용
- [ ] FormHelper 컴포넌트로 필드 래핑
- [ ] 에러 메시지 한국어

### 에러 처리
- [ ] ErrorBoundary 적용
- [ ] mutation 에러: try/catch + alert
- [ ] 삭제: confirm 다이얼로그

### 성능
- [ ] useMemo로 필터/정렬/페이지네이션 캐싱
- [ ] 불필요한 리렌더링 방지

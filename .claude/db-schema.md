# CLOG DB Schema

> **자동 최신화 대상**: 이 문서는 DB 스키마에 CUD(Create/Update/Delete)가 발생할 때마다 반드시 갱신한다.
> 타입 소스: `packages/db/src/types.ts`
> 마지막 동기화: 2026-02-14

---

## 테이블 관계도

```
profiles (사용자)
  │
  ├─< sessions (클라이밍 세션)        → gyms, passes
  │     └─< session_media (세션 미디어)
  │
  ├─< passes (회원권)                → gyms
  │
  ├─< community_posts (커뮤니티 게시글)
  │     └─< community_comments (댓글)
  │
  ├─< reports (신고)
  │
  ├─< contact_messages (문의)
  │
  ├─< gym_checkins (체크인)          → gyms
  │
  └─< gym_edit_suggestions (수정 제안) → gyms
        └─< gym_edit_suggestion_votes (투표)

gyms (암장)
  ├─< gym_sectors (섹터)
  ├─< gym_reviews (리뷰)
  ├─< gym_checkins
  ├─< gym_edit_suggestions
  ├─< sessions
  └─< passes
```

---

## 테이블 상세

### profiles — 사용자 프로필
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | auth.users.id 참조 |
| nickname | text | O | 닉네임 |
| avatar_url | text | - | 프로필 이미지 URL |
| bio | text | - | 자기소개 |
| region | text | - | 활동 지역 |
| default_checkout_duration | int | - | 기본 체크아웃 시간(분) |
| instagram | text | - | 인스타그램 |
| youtube | text | - | 유튜브 |
| twitter | text | - | 트위터 |
| facebook | text | - | 페이스북 |
| tiktok | text | - | 틱톡 |
| website | text | - | 웹사이트 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: 없음 (auth.users는 Supabase 내부)
**역참조**: sessions, passes, community_posts, community_comments, reports, contact_messages, gym_checkins, gym_edit_suggestions, gym_edit_suggestion_votes, session_media

---

### gyms — 클라이밍 암장
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| name | text | O | 암장명 |
| address | text | O | 주소 |
| city | gym_city_enum | O | 시/도 |
| district | text | O | 시/군/구 |
| phone | text | - | 전화번호 |
| status | gym_status_enum | O | 상태 (default: pending) |
| floors | int | - | 층수 |
| size_sqm | numeric | - | 면적 (㎡) |
| single_price | int | - | 1회 이용료 |
| ten_times_price | int | - | 10회권 가격 |
| monthly_price | int | - | 월 이용권 가격 |
| has_parking | bool | - | 주차장 |
| has_locker | bool | - | 락커 |
| has_shower | bool | - | 샤워실 |
| has_cafe | bool | - | 카페 |
| has_shop | bool | - | 샵 |
| has_footbath | bool | - | 족욕 |
| has_endurance | bool | - | 지구력벽 |
| has_lead | bool | - | 리드벽 |
| problem_types | problem_type_enum[] | - | 문제 유형 |
| rating | numeric | - | 평균 평점 |
| review_count | int | - | 리뷰 수 |
| operating_hours | text | - | 영업시간 (문자열) |
| weekday_start | time | - | 평일 시작 |
| weekday_end | time | - | 평일 종료 |
| weekend_start | time | - | 주말 시작 |
| weekend_end | time | - | 주말 종료 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: 없음
**역참조**: gym_sectors, gym_reviews, gym_checkins, gym_edit_suggestions, sessions, passes

---

### sessions — 클라이밍 세션 (기록)
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| user_id | uuid (FK) | O | → profiles.id |
| gym_id | uuid (FK) | O | → gyms.id |
| pass_id | uuid (FK) | - | → passes.id |
| date | date | O | 세션 날짜 |
| condition | session_condition_enum | - | 컨디션 (good/normal/bad) |
| max_grade | text | - | 최고 난이도 |
| attempt_count | int | - | 시도 횟수 |
| completed_count | int | - | 완등 횟수 |
| memo | text | - | 메모 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: user_id → profiles, gym_id → gyms, pass_id → passes
**역참조**: session_media

---

### session_media — 세션 미디어
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| session_id | uuid (FK) | O | → sessions.id |
| user_id | uuid | O | 업로더 |
| media_type | session_media_type_enum | O | image/video |
| media_url | text | O | 미디어 URL |
| thumbnail_url | text | - | 썸네일 URL |
| description | text | - | 설명 |
| created_at | timestamptz | - | |

**FK**: session_id → sessions

---

### passes — 회원권
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| user_id | uuid (FK) | O | → profiles.id |
| gym_id | uuid (FK) | O | → gyms.id |
| name | text | O | 회원권명 |
| type | pass_type_enum | O | count/period/daily |
| start_date | date | O | 시작일 |
| end_date | date | - | 종료일 |
| total_count | int | - | 총 횟수 (횟수권) |
| remaining_count | int | - | 남은 횟수 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: user_id → profiles (암묵적), gym_id → gyms
**역참조**: sessions

---

### community_posts — 커뮤니티 게시글
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| user_id | uuid | O | 작성자 |
| title | text | O | 제목 |
| content | text | O | 내용 |
| category | community_post_category_enum | O | question/tip/crew |
| likes | int | - | 좋아요 수 |
| comment_count | int | - | 댓글 수 |
| is_reported | bool | - | 신고 여부 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: 없음 (user_id는 FK 미설정)
**역참조**: community_comments

---

### community_comments — 커뮤니티 댓글
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| post_id | uuid (FK) | O | → community_posts.id |
| user_id | uuid | O | 작성자 |
| content | text | O | 내용 |
| likes | int | - | 좋아요 수 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: post_id → community_posts

---

### reports — 신고
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| reporter_id | uuid | O | 신고자 |
| target_type | report_target_type_enum | O | user/community_post/gym |
| target_id | uuid | O | 신고 대상 ID |
| category | report_category_enum | O | 신고 유형 |
| reason | text | O | 사유 |
| description | text | - | 상세 설명 |
| status | report_status_enum | O | pending/reviewed/resolved/rejected |
| admin_note | text | - | 관리자 메모 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

---

### contact_messages — 문의
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| user_id | uuid | - | 작성자 (비로그인 가능) |
| type | contact_message_type_enum | O | bug/info/feature/other |
| subject | text | O | 제목 |
| message | text | O | 내용 |
| status | contact_message_status_enum | - | pending/resolved |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

---

### gym_checkins — 암장 체크인
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| user_id | uuid | O | 사용자 |
| gym_id | uuid (FK) | O | → gyms.id |
| check_in_time | timestamptz | O | 체크인 시각 |
| check_out_time | timestamptz | - | 체크아웃 시각 |
| is_auto_checkout | bool | - | 자동 체크아웃 여부 |
| auto_checkout_duration | int | - | 자동 체크아웃 시간(분) |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: gym_id → gyms

---

### gym_reviews — 암장 리뷰
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| gym_id | uuid (FK) | O | → gyms.id |
| user_id | uuid | O | 작성자 |
| rating | int | O | 평점 (1~5) |
| content | text | O | 내용 |
| likes | int | - | 좋아요 수 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: gym_id → gyms

---

### gym_sectors — 암장 섹터
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| gym_id | uuid (FK) | O | → gyms.id |
| name | text | O | 섹터명 |
| route_count | int | - | 루트 수 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: gym_id → gyms

---

### gym_edit_suggestions — 암장 수정 제안
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| gym_id | uuid (FK) | O | → gyms.id |
| user_id | uuid | O | 제안자 |
| field_name | text | O | 수정 대상 필드명 |
| current_value | text | - | 현재 값 |
| suggested_value | text | O | 제안 값 |
| reason | text | - | 사유 |
| status | gym_edit_suggestion_status_enum | - | pending/approved/rejected |
| upvotes | int | - | 찬성 수 |
| downvotes | int | - | 반대 수 |
| admin_note | text | - | 관리자 메모 |
| created_at | timestamptz | - | |
| updated_at | timestamptz | - | |

**FK**: gym_id → gyms
**역참조**: gym_edit_suggestion_votes

---

### gym_edit_suggestion_votes — 수정 제안 투표
| 컬럼 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | uuid (PK) | O | |
| suggestion_id | uuid (FK) | O | → gym_edit_suggestions.id |
| user_id | uuid | O | 투표자 |
| vote_type | vote_type_enum | O | upvote/downvote |
| created_at | timestamptz | - | |

**FK**: suggestion_id → gym_edit_suggestions

---

## Enum 정의

| Enum | 값 | 용도 |
|---|---|---|
| `gym_city_enum` | seoul, busan, daegu, incheon, daejeon, gwangju, ulsan, gyeonggi, gangwon, chungbuk, chungnam, jeonbuk, jeonnam, gyeongbuk, gyeongnam, jeju | 시/도 |
| `gym_status_enum` | pending, active, rejected, inactive | 암장 상태 |
| `problem_type_enum` | dyno, crimpy, balance, slab, overhang, roof, crack, pinch, compression, technical, power, endurance, mixed | 문제 유형 |
| `pass_type_enum` | count, period, daily | 회원권 유형 |
| `community_post_category_enum` | question, tip, crew | 게시글 카테고리 |
| `contact_message_type_enum` | bug, info, feature, other | 문의 유형 |
| `contact_message_status_enum` | pending, resolved | 문의 상태 |
| `report_category_enum` | spam, inappropriate, fake, harassment, copyright, other | 신고 유형 |
| `report_status_enum` | pending, reviewed, resolved, rejected | 신고 상태 |
| `report_target_type_enum` | user, community_post, gym | 신고 대상 |
| `session_condition_enum` | good, normal, bad | 세션 컨디션 |
| `session_media_type_enum` | image, video | 미디어 유형 |
| `gym_edit_suggestion_status_enum` | pending, approved, rejected | 수정 제안 상태 |
| `vote_type_enum` | upvote, downvote | 투표 유형 |

---

## 테이블별 주요 쿼리 참고

### 관계 조인이 필요한 테이블
| 테이블 | 조인 대상 | FK |
|---|---|---|
| sessions | profiles, gyms, passes | user_id, gym_id, pass_id |
| session_media | sessions | session_id |
| passes | profiles (암묵적), gyms | user_id, gym_id |
| community_comments | community_posts | post_id |
| gym_checkins | gyms | gym_id |
| gym_reviews | gyms | gym_id |
| gym_sectors | gyms | gym_id |
| gym_edit_suggestions | gyms | gym_id |
| gym_edit_suggestion_votes | gym_edit_suggestions | suggestion_id |

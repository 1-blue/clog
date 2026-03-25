````markdown
# Design System Document: Kinetic Gallery for Clog

이 디자인 시스템은 클라이밍 앱 'Clog(클로그)'의 핵심 가치인 역동성(Kinetic)과 기록의 가치(Gallery)를 담아내기 위해 설계되었습니다. 단순한 정보 전달을 넘어, 사용자의 움직임이 데이터로 변환되어 예술적인 갤러리처럼 쌓이는 프리미엄 경험을 지향합니다.

---

## 1. Creative North Star: "The Kinetic Gallery" (역동적 갤러리)

이 디자인 시스템의 핵심 개념은 **'움직임의 기록을 예술로 승화시키는 공간'**입니다.

- **의도적 비대칭(Intentional Asymmetry):** 완벽한 그리드보다는 클라이밍의 불규칙한 홀드 배치를 닮은 레이아웃을 사용합니다.
- **레이어드 뎁스(Layered Depth):** 물리적 선(Line)을 배제하고 톤의 변화와 유리 질감을 통해 깊이감을 형성합니다.
- **고대비 타이포그래피(High-Contrast Typography):** 역동적인 스포츠 감각을 위해 거대한 헤드라인과 섬세한 본문의 대비를 극대화합니다.

---

## 2. Color & Surface Strategy

우리는 선(Border)을 사용하여 구획을 나누는 낡은 방식을 버립니다. 대신 **'Surface Hierarchy(표면 계층)'**를 통해 공간을 정의합니다.

### Palette Tokens

- **Primary (Indigo):** `#c0c1ff` (Active 상태, 주요 인터랙션)
- **Secondary (Emerald):** `#4edea3` (성공, 완등, 이용 가능)
- **Tertiary (Amber):** `#ffb95f` (난이도 점수, 레이팅)
- **Error (Red):** `#ffb4ab` (삭제, 경고)
- **Background:** `#131316` (Deep Charcoal)

### The "No-Line" Rule

섹션을 구분할 때 `1px solid border` 사용을 엄격히 금지합니다. 경계는 오직 배경색의 변화(`surface-container-low` vs `surface`)로만 정의합니다.

### Surface Hierarchy & Nesting

UI를 여러 겹의 반투명한 유리나 고급 종이가 겹쳐진 레이어로 취급하십시오.

- **Base Layer:** `surface` (#131316)
- **Secondary Section:** `surface-container-low` (#1b1b1e)
- **Content Cards:** `surface-container-highest` (#353438)를 사용하여 자연스러운 부양감을 부여합니다.

### Glassmorphism & Gradient

- **Floating Elements:** 플로팅 버튼이나 하단 탭바에는 `surface` 컬러에 `backdrop-blur` 효과를 적용하여 배경이 은은하게 비치도록 합니다.
- **Signature CTA:** 메인 버튼에는 `primary`에서 `primary-container`로 이어지는 미세한 수직 그라데이션을 적용하여 평면적인 느낌을 제거하고 입체적인 에너지를 부여합니다.

---

## 3. Typography: Pretendard Editorial

'Pretendard'의 정교한 가독성을 활용하되, 패션 매거진과 같은 에디토리얼 감각을 유지합니다.

| Level           | Size      | Weight   | Usage                                 |
| :-------------- | :-------- | :------- | :------------------------------------ |
| **Display LG**  | 3.5rem    | Bold     | 홈 화면의 완등 횟수, 거대한 숫자 강조 |
| **Headline LG** | 2rem      | SemiBold | 주요 섹션 타이틀, 암장 이름           |
| **Title MD**    | 1.125rem  | Medium   | 카드 제목, 리스트 항목                |
| **Body LG**     | 1rem      | Regular  | 일반 텍스트, 설명글                   |
| **Label SM**    | 0.6875rem | Medium   | 태그, 메타데이터, 보조 정보           |

**Design Tip:** 타이포그래피의 행간(Line-height)을 일반적인 앱보다 10~15% 더 넓게 설정하여 시각적 숨통을 틔워주십시오.

---

## 4. Elevation & Depth: Tonal Layering

전통적인 그림자보다는 톤의 중첩(Stacking)을 통해 계층을 만듭니다.

- **The Layering Principle:** `surface-container-lowest` 카드 위에 `surface-container-low` 섹션을 배치하여 그림자 없이도 자연스러운 높이 차이를 만듭니다.
- **Ambient Shadows:** 부유하는 요소에 그림자가 꼭 필요하다면, 투명도 4-8%의 아주 넓게 퍼지는(Blur 40px 이상) 그림자를 사용하십시오. 그림자 색상은 검정색이 아닌 `on-surface` 색상을 섞어 자연스러운 주변광 느낌을 줍니다.
- **Ghost Border Fallback:** 접근성을 위해 경계가 반드시 필요한 경우에만 `outline-variant` 토큰을 투명도 10~20%로 낮추어 사용하십시오. (100% 불투명한 선은 절대 금지)

---

## 5. Components Style Guide

### Buttons

- **Shape:** `rounded-xl` (1rem) 또는 `full` (9999px)을 사용하여 스포티한 느낌을 강조합니다.
- **Primary:** Indigo 그라데이션 + `on-primary` 텍스트.
- **Secondary:** 유리 질감(Glassmorphism) 배경에 `primary` 텍스트.

### Cards & Lists

- **No Divider Rule:** 리스트 아이템 사이에 구분선을 넣지 마십시오. 대신 `spacing-8` (2rem) 정도의 수직 여백을 사용하거나, 아이템 각각을 별도의 컨테이너 칩으로 분리합니다.
- **Visual Flow:** 클라이밍 루트 기록 카드는 비대칭적인 여백을 주어 사용자의 시선이 리드미컬하게 움직이도록 유도합니다.

### Inputs

- **Clean Input:** 박스 형태보다는 하단에만 미세한 `outline-variant`를 두거나, `surface-container-low` 배경색을 채운 `rounded-md` 형태를 권장합니다.
- **Feedback:** 포커스 시 `primary` 컬러의 'Ghost Border'가 생성되며 부드럽게 확장되는 애니메이션을 적용합니다.

### Climbing Specific Components

- **Difficulty Chips:** 난이도(V0-V10) 칩은 `tertiary` (Amber)를 베이스로 하되, 난이도가 높아질수록 채도가 높아지는 시스템을 구축합니다.
- **Success Wave:** 완등 기록 시 `secondary` (Emerald) 컬러가 화면 하단에서 상단으로 유기적으로 차오르는 Kinetic 애니메이션을 제안합니다.

---

## 6. Do's and Don'ts

### Do's

- **여백을 두려워하지 마십시오:** 정보 밀도를 낮추어 프리미엄 갤러리의 느낌을 유지하십시오.
- **톤의 변화를 활용하십시오:** 선보다는 면의 밝기 차이로 구조를 설계하십시오.
- **동적인 이미지를 사용하십시오:** 클라이밍의 역동적인 순간이 담긴 고화질 사진이 디자인의 일부가 되도록 배치하십시오.

### Don'ts

- **100% Black(#000) 사용 금지:** 깊이감을 해칩니다. 대신 `surface` 계열을 사용하십시오.
- **정형화된 그리드 고집 금지:** 가끔은 이미지가 화면 끝까지 확장되거나(Full-bleed), 텍스트가 이미지를 살짝 덮는 비대칭 레이아웃을 시도하십시오.
- **딱딱한 모서리 금지:** 모든 인터랙티브 요소에는 `rounded-xl` 이상의 둥근 모서리를 적용하여 부드럽고 현대적인 인상을 유지하십시오.

---

**Director's Final Note:**
이 디자인 시스템의 목적은 단순히 기능을 나열하는 것이 아니라, 사용자가 자신의 클라이밍 여정을 기록할 때 마치 자신만의 전시회를 여는 듯한 고양감을 느끼게 하는 것입니다. 모든 픽셀에 의도적인 여유와 깊이를 담으십시오.```
````

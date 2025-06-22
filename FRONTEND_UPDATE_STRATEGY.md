# Frontend Update Strategy

## 상황: Upstream에서 Frontend가 다시 업데이트될 때 대응 방법

### 1. 안전한 업데이트 절차

```bash
# 1. upstream 최신 변경사항 가져오기
git fetch upstream

# 2. 현재 변경사항이 있는지 확인
git status

# 3. 작업 중인 변경사항이 있다면 stash로 보관
git stash push -m "Work in progress before frontend update"

# 4. 새로운 브랜치 생성
git checkout -b update-frontend-$(date +%Y%m%d)

# 5. Frontend만 선택적으로 업데이트
git checkout upstream/main -- blink-fit-frontend/

# 6. 우리의 커스텀 변경사항 복원이 필요한 파일들 확인
git status
```

### 2. 충돌 해결 전략

#### 우선순위 1: 우리가 추가한 API 통합 코드 보존
- `blink-fit-frontend/src/api/authApi.js` - 우리 백엔드 API 호출
- Login.jsx의 API 통합 부분
- Survey.jsx의 서버 전송 로직

#### 우선순위 2: 사용자 커스텀 기능 보존  
- `Survey.jsx`: 실제 서버 전송 payload 로깅
- `ConfirmModal.jsx`: message를 div로 변경 (HTML 렌더링 지원)

#### 우선순위 3: 새로운 UI 개선사항 수용
- 새로운 컴포넌트들
- 스타일링 개선
- 새로운 페이지들

### 3. 자동화된 업데이트 스크립트

```bash
#!/bin/bash
# update-frontend.sh

echo "🔄 Frontend 업데이트 시작..."

# 백업 브랜치 생성
BACKUP_BRANCH="backup-frontend-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$BACKUP_BRANCH"
git checkout main

# 업데이트 브랜치 생성
UPDATE_BRANCH="update-frontend-$(date +%Y%m%d)"
git checkout -b "$UPDATE_BRANCH"

# upstream 가져오기
git fetch upstream

# Frontend만 업데이트
git checkout upstream/main -- blink-fit-frontend/

echo "✅ Frontend 업데이트 완료"
echo "📋 변경사항을 검토하고 커스텀 코드를 복원하세요:"
echo "   - Survey.jsx 서버 전송 로직"
echo "   - ConfirmModal.jsx HTML 렌더링 지원"
echo "   - 기타 API 통합 코드"

git status
```

### 4. 핵심 보존 파일들

다음 파일들의 변경사항은 항상 보존해야 함:

1. **API 통합 관련**
   - `src/api/authApi.js` (우리 백엔드 연동)
   - Login.jsx의 API 호출 부분

2. **사용자 커스텀 기능**
   - Survey.jsx: `console.log("[Survey] 실제 서버 전송 payload:", apiPayload);`
   - ConfirmModal.jsx: `<div>` 태그로 message 렌더링

3. **Backend 파일들 (절대 건드리지 않음)**
   - `blink-fit-backend/` 전체 디렉토리

### 5. 충돌 해결 체크리스트

- [ ] API 호출이 여전히 우리 백엔드를 사용하는가?
- [ ] 사용자 커스텀 기능이 보존되었는가?
- [ ] 새로운 UI 개선사항이 적용되었는가?
- [ ] Backend 파일들이 변경되지 않았는가?
- [ ] 빌드가 성공하는가?
- [ ] 로컬 테스트가 통과하는가?

### 6. 응급 복구 절차

만약 업데이트 중 문제가 발생하면:

```bash
# 1. 현재 브랜치 버리기
git checkout main
git branch -D update-frontend-$(date +%Y%m%d)

# 2. 백업에서 복구
git checkout backup-frontend-*
git checkout -b restore-frontend
git checkout main
git merge restore-frontend

# 3. 수동으로 다시 시도
```

## 결론

- **Backend는 절대 건드리지 않기** (우리의 완성된 API 보존)
- **Frontend는 선택적 업데이트** (새 기능 수용 + 커스텀 보존)
- **단계적 접근** (백업 → 업데이트 → 검토 → 병합)
- **충돌 시 우선순위** (API 통합 > 커스텀 기능 > UI 개선)

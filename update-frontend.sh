#!/bin/bash

# Frontend 안전 업데이트 스크립트
# 사용법: ./update-frontend.sh

set -e  # 에러 시 중단

echo "🔄 Frontend 업데이트 시작..."

# 현재 브랜치 확인
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 현재 브랜치: $CURRENT_BRANCH"

# 작업 중인 변경사항 확인
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  작업 중인 변경사항이 있습니다."
    echo "💾 변경사항을 stash로 보관할까요? (y/n)"
    read -r STASH_CHOICE
    if [ "$STASH_CHOICE" = "y" ]; then
        git stash push -m "Work in progress before frontend update - $(date)"
        echo "✅ 변경사항이 stash에 보관되었습니다."
    else
        echo "❌ 업데이트를 중단합니다. 먼저 변경사항을 처리해주세요."
        exit 1
    fi
fi

# 백업 브랜치 생성
BACKUP_BRANCH="backup-frontend-$(date +%Y%m%d-%H%M%S)"
echo "💾 백업 브랜치 생성: $BACKUP_BRANCH"
git checkout -b "$BACKUP_BRANCH"
git checkout main

# 업데이트 브랜치 생성
UPDATE_BRANCH="update-frontend-$(date +%Y%m%d)"
echo "🔧 업데이트 브랜치 생성: $UPDATE_BRANCH"
git checkout -b "$UPDATE_BRANCH"

# upstream 최신 가져오기
echo "📥 upstream에서 최신 변경사항 가져오기..."
git fetch upstream

# Frontend 디렉토리만 업데이트
echo "🔄 Frontend 디렉토리 업데이트 중..."
git checkout upstream/main -- blink-fit-frontend/

# 변경사항 확인
echo ""
echo "✅ Frontend 업데이트 완료!"
echo ""
echo "📋 다음 사항들을 검토하고 필요시 수동으로 복원해주세요:"
echo ""
echo "🔑 중요: API 통합 코드 확인"
echo "   - blink-fit-frontend/src/api/authApi.js"
echo "   - Login.jsx의 API 호출 부분"
echo ""
echo "👤 사용자 커스텀 기능 확인"
echo "   - Survey.jsx: 서버 전송 로깅"
echo "   - ConfirmModal.jsx: HTML 렌더링 지원"
echo ""
echo "🚫 절대 건드리면 안 되는 것"
echo "   - blink-fit-backend/ 디렉토리 전체"
echo ""

# 상태 표시
echo "📊 현재 변경사항:"
git status --short

echo ""
echo "🔍 검토 후 다음 명령으로 계속 진행:"
echo "   git add ."
echo "   git commit -m 'Update frontend from upstream'"
echo "   git checkout main"
echo "   git merge $UPDATE_BRANCH"
echo ""
echo "🆘 문제가 있다면 복구:"
echo "   git checkout main"
echo "   git branch -D $UPDATE_BRANCH"
echo "   git checkout $BACKUP_BRANCH"

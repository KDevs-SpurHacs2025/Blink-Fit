# MongoDB 통합 개발 명세서

## 📋 프로젝트 개요
Blink-Fit 눈 건강 애플리케이션을 위해 Firebase Functions와 MongoDB Atlas 클라우드 데이터베이스를 통합하여 사용자 데이터, 퀴즈 응답, AI 생성 추천사항을 저장하는 시스템 구축.

## 🎯 목표
- 사용자 퀴즈 응답 및 선호도 저장
- AI 생성 개인화 가이드 보관
- 사용자 상호작용 히스토리 추적
- 분석을 위한 데이터 지속성 구현
- 데이터 일관성 및 안정성 유지

## 🏗️ 아키텍처 설계

### 현재 아키텍처
```
클라이언트 → Firebase Functions → Gemini AI → 응답
```

### 목표 아키텍처
```
클라이언트 → Firebase Functions → Gemini AI → 응답
                ↓
            MongoDB Atlas (데이터 저장소)
```

### 기술 스택
- **API 계층**: Firebase Functions (기존)
- **데이터베이스**: MongoDB Atlas (클라우드)
- **ODM**: Mongoose (스키마 관리)
- **연결 풀**: Mongoose 내장 연결 풀링
- **환경 설정**: Firebase Secret Manager (자격증명 관리)

## 📊 데이터 모델

### 1. 사용자 프로필 모델
```typescript
interface UserProfile {
  _id: ObjectId;
  userId: string;           // 고유 식별자
  createdAt: Date;          // 생성일
  updatedAt: Date;          // 수정일
  lastActiveAt: Date;       // 마지막 활동일
  preferences?: {           // 사용자 선호도
    breakPreference?: string;   // 휴식 선호도
    favoriteSnack?: string;     // 선호 간식
    favoritePlace?: string;     // 선호 장소
  };
}
```

### 2. 퀴즈 응답 모델
```typescript
interface QuizResponse {
  _id: ObjectId;
  userId: string;           // 사용자 ID
  sessionId: string;        // 고유 세션 식별자
  responses: QuizAnswer[];  // 퀴즈 답변 배열
  subjective?: SubjectiveData;  // 주관적 데이터
  analysisResults: {        // LLM 분석 결과
    screenTimeRisk: number;     // 화면 시간 위험도
    eyeStrainLevel: number;     // 눈 피로도
    breakHabits: number;        // 휴식 습관 점수
    physicalSymptoms: number;   // 신체 증상 점수
    deviceUsage: number;        // 기기 사용 패턴
    overallRiskProfile: string; // 전체 위험도 프로필 (low/medium/high)
  };
  submittedAt: Date;        // 제출일
}

interface QuizAnswer {
  questionId: number;       // 질문 ID
  question: string;         // 질문 내용
  answer: string;          // 답변
  level: number;           // 위험도 레벨 (1-5)
  analysisNote?: string;   // LLM의 해당 답변에 대한 분석 노트
}
```

### 3. 생성된 가이드 모델
```typescript
interface GeneratedGuide {
  _id: ObjectId;
  userId: string;           // 사용자 ID
  quizResponseId: ObjectId; // 퀴즈 응답 참조
  guide: {                  // LLM 생성 개인화 가이드
    workDuration: string;       // 작업 시간 (예: "25 minutes")
    breakDuration: string;      // 휴식 시간 (예: "5 minutes")
    screenTimeLimit: string;    // 화면 시간 제한 (예: "6 hours/day")
    exercises: string[];        // 개인화된 운동 목록 (3-4개)
  };
  llmReasoning?: string;    // LLM의 추천 근거/설명
  promptUsed: string;       // 사용된 프롬프트 (디버깅/개선용)
  source: 'Gemini AI' | 'Enhanced Fallback Algorithm';  // 생성 소스
  generatedAt: Date;        // 생성일
  personalizedFactors: {    // 개인화 고려 요소
    symptomFocus: string[];     // 주요 증상 포커스
    preferencesApplied: string[]; // 적용된 사용자 선호도
    adaptationLevel: string;    // 적응 수준 (beginner/intermediate/advanced)
  };
}
```

### 4. 운동 히스토리 모델
```typescript
interface ExerciseHistory {
  _id: ObjectId;
  userId: string;           // 사용자 ID
  exerciseGuide: {          // LLM 생성 운동 가이드
    message: string;            // 개인화된 메시지
    activityType: string;       // 활동 유형 (eye_exercise/physical_movement/relaxation/combination)
    duration: string;           // 추천 지속 시간
    tips: string[];            // 구체적인 팁 목록
    personalizationNote?: string; // 개인화 적용 사항
  };
  userPreferences?: string[];   // 사용자 선호도
  breakCount: number;       // 휴식 횟수
  workDuration?: number;    // 작업 지속 시간 (분)
  contextualFactors: {      // 상황별 고려 요소
    timeOfDay?: string;         // 시간대
    previousActivity?: string;  // 이전 활동
    stressLevel?: number;      // 스트레스 수준 (1-5)
  };
  llmPromptUsed?: string;   // 사용된 LLM 프롬프트
  source: 'Gemini AI' | 'Enhanced Fallback Algorithm';  // 생성 소스
  requestedAt: Date;        // 요청일
  effectiveness?: {         // 효과성 추적 (선택적)
    userRating?: number;        // 사용자 평가 (1-5)
    completionStatus?: string;  // 완료 상태
  };
}
```

### 5. LLM 상호작용 로그 모델 (신규)
```typescript
interface LLMInteractionLog {
  _id: ObjectId;
  userId: string;           // 사용자 ID
  interactionType: 'guide_generation' | 'exercise_recommendation' | 'conversation';
  prompt: string;           // 전송된 프롬프트
  response: string;         // LLM 응답
  processingTime: number;   // 처리 시간 (ms)
  tokenUsage?: {            // 토큰 사용량 (선택적)
    promptTokens: number;
    responseTokens: number;
    totalTokens: number;
  };
  modelInfo: {              // 모델 정보
    modelName: string;          // 사용된 모델명
    temperature: number;        // 창의성 설정
    maxTokens: number;         // 최대 토큰
  };
  success: boolean;         // 성공 여부
  errorDetails?: string;    // 에러 정보 (실패 시)
  timestamp: Date;          // 상호작용 시점
}
```

### 6. API 사용 분석 모델 (기존 업데이트)
```typescript
interface APIUsage {
  _id: ObjectId;
  endpoint: string;         // API 엔드포인트
  method: string;           // HTTP 메소드
  userId?: string;          // 사용자 ID (선택)
  sessionId?: string;       // 세션 ID (선택)
  responseTime: number;     // 응답 시간
  success: boolean;         // 성공 여부
  llmUsage?: {              // LLM 사용 정보 (해당되는 경우)
    used: boolean;              // LLM 사용 여부
    model: string;             // 사용된 모델
    processingTime: number;     // LLM 처리 시간
    fallbackUsed: boolean;     // Fallback 사용 여부
  };
  source: 'LLM Primary' | 'Enhanced Fallback' | 'Direct API';  // 응답 소스
  timestamp: Date;          // 타임스탬프
  userAgent?: string;       // 사용자 에이전트 (선택)
  ipAddress?: string;       // IP 주소 (선택)
}
```

## 🔧 구현 전략

### 1단계: 데이터베이스 설정 및 연결
1. **MongoDB Atlas 설정**
   - 무료 티어 클러스터 생성
   - 네트워크 접근 설정 (Firebase Functions 허용)
   - 적절한 권한을 가진 데이터베이스 사용자 생성
   - 연결 문자열 획득

2. **환경 설정**
   - MongoDB 연결 문자열을 Firebase Secret Manager에 추가
   - 환경 설정 업데이트
   - 개발 환경에서 연결 테스트

3. **데이터베이스 서비스 구현**
   - 데이터베이스 연결 서비스 생성
   - 연결 풀링 구현
   - 에러 처리 및 재시도 로직 추가

### 2단계: 데이터 모델 및 스키마
1. **스키마 정의**
   - 모든 모델에 대한 Mongoose 스키마 생성
   - 유효성 검사 규칙 및 인덱스 추가
   - 타임스탬프를 위한 미들웨어 구현

2. **Repository 패턴**
   - 각 모델에 대한 Repository 클래스 생성
   - CRUD 작업 구현
   - 데이터 접근 계층 추상화 추가

### 3단계: API 통합 및 LLM 최적화
1. **기존 엔드포인트 개선**
   - `/api/generate-guide`를 수정하여 LLM 응답과 분석 결과 저장
   - `/api/exercise-guidance`를 업데이트하여 개인화된 LLM 추천 저장
   - `/api/hello` 엔드포인트에 사용자 상호작용 패턴 추적 기능 추가

2. **새로운 LLM 중심 엔드포인트**
   - `GET /api/user/:userId/profile` - 사용자 프로필 및 LLM 상호작용 히스토리 조회
   - `GET /api/user/:userId/history` - 개인화 추천 히스토리 및 효과성 분석
   - `POST /api/user/:userId/preferences` - 선호도 업데이트 및 LLM 프롬프트 최적화
   - `GET /api/analytics/llm-performance` - LLM 성능 및 사용량 분석
   - `POST /api/feedback/:guideId` - 사용자 피드백을 통한 LLM 개선

3. **LLM 프롬프트 관리 시스템**
   - 프롬프트 버전 관리 및 A/B 테스트
   - 사용자 피드백 기반 프롬프트 최적화
   - 컨텍스트별 프롬프트 개인화

### 4단계: LLM 성능 분석 및 개인화 최적화
1. **LLM 상호작용 분석**
   - 프롬프트 효과성 측정
   - 응답 품질 평가 시스템
   - 사용자 만족도 추적
   - 토큰 사용량 최적화

2. **개인화 알고리즘 개선**
   - 사용자별 선호 패턴 학습
   - 컨텍스트 인식 추천 시스템
   - 적응형 프롬프트 생성
   - 피드백 루프 구현

3. **데이터 기반 인사이트**
   - 사용자 참여 지표 분석
   - 가장 효과적인 운동 추천 패턴
   - LLM vs Enhanced Fallback 성능 비교
   - 개인화 요소별 영향도 분석

## 📁 파일 구조 변경사항

```
functions/src/
├── index.ts                     # 진입점
├── config/
│   ├── index.ts                # Firebase 설정 (기존)
│   ├── database.ts             # MongoDB 연결 설정 (신규)
│   └── llm.ts                  # LLM 프롬프트 및 설정 관리 (신규)
├── models/                     # 데이터베이스 모델 (신규)
│   ├── User.ts                 # 사용자 모델
│   ├── QuizResponse.ts         # 퀴즈 응답 모델 (분석 결과 포함)
│   ├── GeneratedGuide.ts       # 생성된 가이드 모델 (LLM 메타데이터 포함)
│   ├── ExerciseHistory.ts      # 운동 히스토리 모델 (개인화 정보 포함)
│   ├── LLMInteractionLog.ts    # LLM 상호작용 로그 (신규)
│   └── APIUsage.ts             # API 사용량 모델 (LLM 사용 정보 포함)
├── repositories/               # 데이터 접근 계층 (신규)
│   ├── UserRepository.ts       # 사용자 Repository
│   ├── QuizRepository.ts       # 퀴즈 Repository
│   ├── GuideRepository.ts      # 가이드 Repository
│   ├── ExerciseRepository.ts   # 운동 Repository
│   ├── LLMLogRepository.ts     # LLM 로그 Repository (신규)
│   └── AnalyticsRepository.ts  # 분석 Repository
├── services/
│   ├── geminiService.ts        # AI 서비스 (기존 - 로깅 강화)
│   ├── databaseService.ts      # 데이터베이스 연결 (신규)
│   ├── promptService.ts        # 프롬프트 관리 서비스 (신규)
│   └── personalizationService.ts # 개인화 서비스 (신규)
├── controllers/                # 요청 핸들러 (기존)
│   ├── helloController.ts      # 상호작용 로깅 추가
│   ├── guideController.ts      # LLM 분석 결과 저장 추가
│   ├── exerciseController.ts   # 개인화 및 효과성 추적 추가
│   ├── userController.ts       # 사용자 관리 (신규)
│   └── analyticsController.ts  # LLM 성능 분석 (신규)
├── middleware/                 # 요청 미들웨어 (신규)
│   ├── analytics.ts            # 사용량 추적 (LLM 정보 포함)
│   ├── validation.ts           # 입력 유효성 검사
│   └── llmMonitoring.ts        # LLM 성능 모니터링 (신규)
├── routes/
│   ├── index.ts                # 메인 라우트 (기존)
│   ├── userRoutes.ts           # 사용자 관련 라우트 (신규)
│   └── analyticsRoutes.ts      # 분석 라우트 (신규)
├── types/
│   ├── index.ts                # 일반 타입 (기존)
│   ├── database.ts             # 데이터베이스 타입 (신규)
│   └── llm.ts                  # LLM 관련 타입 (신규)
└── utils/
    ├── helpers.ts              # 일반 유틸리티 (개선된 Fallback 알고리즘)
    ├── dataUtils.ts            # 데이터 처리 유틸리티 (신규)
    ├── promptUtils.ts          # 프롬프트 생성 유틸리티 (신규)
    └── llmAnalytics.ts         # LLM 분석 유틸리티 (신규)
```

## 🔐 보안 고려사항

### 연결 보안
- MongoDB Atlas 내장 보안 기능 사용
- Firebase Secret Manager에 연결 문자열 저장
- Firebase Functions에 대한 IP 화이트리스트 활성화
- 강력한 인증 자격증명 사용

### 데이터 보호
- API 레벨에서 데이터 유효성 검사 구현
- Mongoose 스키마 유효성 검사 사용
- 사용자 입력 데이터 정제
- 요청 제한 구현

### 개인정보 보호 규정 준수
- 최소한의 사용자 데이터 저장
- 데이터 보존 정책 구현
- 사용자 데이터 삭제 기능 추가
- GDPR 준수 고려사항 확인

## 🚀 개발 계획

### 1단계: 환경 설정 (1일차)
- [ ] MongoDB Atlas 계정 및 클러스터 생성
- [ ] 네트워크 접근 및 인증 설정
- [ ] Firebase Secret Manager에 연결 문자열 추가
- [ ] 필요한 npm 패키지 설치

### 2단계: 데이터베이스 기반 구축 (1-2일차)
- [ ] 데이터베이스 연결 서비스 생성
- [ ] 기본 연결 테스트 구현
- [ ] Mongoose 스키마 설정
- [ ] 로컬 환경에서 연결 테스트

### 3단계: Repository 계층 및 LLM 통합 (2-3일차)
- [ ] Repository 패턴 구현
- [ ] 각 모델에 대한 CRUD 작업 생성 (LLM 메타데이터 포함)
- [ ] LLM 상호작용 로깅 시스템 구현
- [ ] 에러 처리 및 유효성 검사 추가
- [ ] Repository에 대한 단위 테스트 작성

### 4단계: API 통합 및 개인화 강화 (3-4일차)
- [ ] 기존 컨트롤러에 LLM 분석 결과 저장 기능 추가
- [ ] 개인화된 프롬프트 생성 시스템 구현
- [ ] 새로운 사용자 관리 및 분석 엔드포인트 구현
- [ ] LLM 성능 모니터링 미들웨어 추가
- [ ] 데이터베이스 통합으로 모든 엔드포인트 테스트

### 5단계: LLM 최적화 및 테스트 (4-5일차)
- [ ] 실제 사용자 데이터로 개인화 알고리즘 테스트
- [ ] 프롬프트 효과성 분석 및 최적화
- [ ] LLM vs Enhanced Fallback 성능 비교 분석
- [ ] 에러 처리 및 복구 시나리오 개선
- [ ] 포괄적인 문서 업데이트 (LLM 사용법 포함)

## 📦 필요한 종속성

```json
{
  "dependencies": {
    "mongoose": "^8.0.0",
    "joi": "^17.0.0",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/lodash": "^4.14.202"
  }
}
```

## 🧪 테스트 전략

### 단위 테스트
- Repository 메소드
- 데이터베이스 연결 처리
- 데이터 유효성 검사 로직
- 에러 시나리오

### 통합 테스트
- 엔드투엔드 API 플로우
- 데이터베이스 작업
- 에러 처리
- 성능 벤치마크

### 부하 테스트
- 연결 풀링 효율성
- 동시 요청 처리
- 데이터베이스 쿼리 성능

## 📊 성공 지표

### 성능
- 데이터베이스 연결 시간 < 500ms
- 쿼리 응답 시간 < 200ms
- LLM 응답 시간 < 3초 (95%ile)
- 연결 누수 또는 타임아웃 없음

### LLM 효과성
- LLM 성공률 > 95% (Fallback 비율 < 5%)
- 개인화 정확도 향상 측정 가능
- 사용자 만족도 > 4.0/5.0 (피드백 기반)
- 프롬프트 최적화를 통한 토큰 사용량 효율성 개선

### 안정성
- 데이터베이스 작업 99.9% 가동시간
- LLM 서비스 장애 시 Enhanced Fallback 자동 전환
- 연결 실패 시 자동 재시도
- 데이터베이스 사용 불가 시 우아한 성능 저하

### 데이터 품질 및 개인화
- 100% 데이터 유효성 검사 준수
- LLM 응답 품질 모니터링 시스템 운영
- 개인화 요소 적용률 > 80%
- 데이터 손상 사고 0건
- 적절한 에러 로깅 및 모니터링

## 🔄 마이그레이션 전략

### 개발 단계
- 기존 시스템과 병행 실행
- 샘플 데이터로 테스트
- 데이터 무결성 검증

### 프로덕션 배포
- 데이터베이스 통합 배포
- 성능 지표 모니터링
- 기능 플래그를 통한 점진적 롤아웃

### 롤백 계획
- 기존 기능 유지
- 데이터베이스 작업을 개선사항으로 처리
- 필요시 데이터베이스 기능 비활성화 가능

## 📚 문서 업데이트

### 기술 문서
- 데이터베이스 스키마 문서
- API 엔드포인트 업데이트
- Repository 사용 예제
- 에러 처리 가이드

### 사용자 문서
- MongoDB 설정이 포함된 README 업데이트
- 환경 설정 가이드
- 문제 해결 섹션 업데이트

---

## ⚡ 빠른 시작 요약

1. **MongoDB Atlas 설정** - 클러스터 생성 및 연결 문자열 획득
2. **종속성 설치** - mongoose 및 유효성 검사 라이브러리 추가
3. **LLM 모델 및 Repository 생성** - 개인화 메타데이터를 포함한 데이터 스키마 정의
4. **컨트롤러 업데이트** - LLM 분석 결과 및 상호작용 로깅 통합
5. **개인화 시스템 구현** - 프롬프트 관리 및 사용자별 최적화 시스템
6. **통합 테스트** - LLM 성능 및 개인화 효과성 검증
7. **배포 및 모니터링** - LLM 성능 지표 및 사용자 만족도 모니터링과 함께 롤아웃

이 명세서는 기존 Firebase Functions 아키텍처와 MongoDB Atlas를 통합하면서 **LLM 기반 개인화 시스템**을 구축하여 사용자별 맞춤형 눈 건강 관리 서비스를 제공하기 위한 포괄적인 로드맵을 제공합니다.

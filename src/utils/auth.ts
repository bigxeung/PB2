// 완벽한 인증 시스템 (Remember Me + sessionStorage 활용)

import type { User, AuthResult, SessionResult } from '../types';
import {
  safeGetItem,
  safeSetItem,
  STORAGE_KEYS
} from './storage';
import {
  encodeApiKey,
  decodeApiKey,
  validateEmail,
  sanitizeInput
} from './security';

// 사용자 목록 가져오기
export const getUsers = (): User[] => {
  return safeGetItem<User[]>(STORAGE_KEYS.USERS, []);
};

// 사용자 저장
const saveUsers = (users: User[]): boolean => {
  return safeSetItem(STORAGE_KEYS.USERS, users);
};

// 로그인 (Remember Me 포함)
export const tryLogin = (email: string, password: string, rememberMe: boolean = false): AuthResult => {
  // 1. 입력값 검증
  if (!validateEmail(email)) {
    return {
      success: false,
      message: '올바른 이메일 형식이 아닙니다.'
    };
  }

  if (!password || password.trim() === '') {
    return {
      success: false,
      message: '비밀번호(API 키)를 입력해주세요.'
    };
  }

  // 2. 이메일 Sanitize
  const sanitizedEmail = sanitizeInput(email);

  // 3. 사용자 찾기
  const users = getUsers();
  const user = users.find(u => u.id === sanitizedEmail);

  if (!user) {
    return {
      success: false,
      message: '존재하지 않는 계정입니다.'
    };
  }

  // 4. 비밀번호 확인 (디코딩 후 비교)
  const decodedPassword = decodeApiKey(user.password);
  if (decodedPassword !== password) {
    return {
      success: false,
      message: '비밀번호(API 키)가 일치하지 않습니다.'
    };
  }

  // 5. 로그인 성공 처리
  safeSetItem(STORAGE_KEYS.API_KEY, user.password);
  safeSetItem(STORAGE_KEYS.CURRENT_USER, sanitizedEmail);

  // 6. Remember Me 처리
  if (rememberMe) {
    // LocalStorage에 저장 (브라우저 닫아도 유지)
    localStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    safeSetItem(STORAGE_KEYS.REMEMBER_ME, 'true');
  } else {
    // SessionStorage에 저장 (브라우저 닫으면 삭제)
    sessionStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);
  }

  return {
    success: true,
    message: '로그인 성공!'
  };
};

// 회원가입
export const tryRegister = (email: string, password: string, passwordConfirm: string): AuthResult => {
  // 1. 입력값 검증
  if (!validateEmail(email)) {
    return {
      success: false,
      message: '올바른 이메일 형식이 아닙니다.'
    };
  }

  if (!password || password.trim() === '') {
    return {
      success: false,
      message: '비밀번호(API 키)를 입력해주세요.'
    };
  }

  if (password !== passwordConfirm) {
    return {
      success: false,
      message: '비밀번호가 일치하지 않습니다.'
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: 'TMDB API 키는 최소 8자 이상이어야 합니다.'
    };
  }

  // 2. 이메일 Sanitize
  const sanitizedEmail = sanitizeInput(email);

  // 3. 중복 체크
  const users = getUsers();
  const exists = users.some(u => u.id === sanitizedEmail);

  if (exists) {
    return {
      success: false,
      message: '이미 존재하는 계정입니다.'
    };
  }

  // 4. API 키 인코딩
  const encodedPassword = encodeApiKey(password);

  // 5. 사용자 추가
  const newUser: User = {
    id: sanitizedEmail,
    password: encodedPassword,
    createdAt: Date.now()
  };
  users.push(newUser);

  saveUsers(users);

  return {
    success: true,
    message: '회원가입 성공!'
  };
};

// 로그아웃
export const logout = (): boolean => {
  // LocalStorage
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
  localStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  localStorage.removeItem(STORAGE_KEYS.REMEMBER_ME);

  // SessionStorage
  sessionStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);

  return true;
};

// 로그인 상태 확인
export const isAuthenticated = (): boolean => {
  const rememberMe = safeGetItem<string>(STORAGE_KEYS.REMEMBER_ME, '') === 'true';

  if (rememberMe) {
    // Remember Me 체크됨 → LocalStorage 확인
    return localStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  } else {
    // Remember Me 체크 안됨 → SessionStorage 확인
    return sessionStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN) === 'true';
  }
};

// 현재 사용자 정보
export const getCurrentUser = (): string | null => {
  return safeGetItem<string | null>(STORAGE_KEYS.CURRENT_USER, null);
};

// API 키 가져오기
export const getApiKey = (): string => {
  const encoded = safeGetItem<string | null>(STORAGE_KEYS.API_KEY, null);
  if (!encoded) {
    throw new Error('로그인이 필요합니다.');
  }
  const decoded = decodeApiKey(encoded);
  if (!decoded) {
    throw new Error('API 키 디코딩 실패');
  }
  return decoded;
};

// 저장된 이메일 가져오기 (Remember Me용 - 호환성)
export const getRememberedEmail = (): string => {
  const currentUser = getCurrentUser();
  const rememberMe = safeGetItem<string>(STORAGE_KEYS.REMEMBER_ME, '');
  return rememberMe ? currentUser || '' : '';
};

// 비밀번호 변경
export const changePassword = (email: string, oldPassword: string, newPassword: string): AuthResult => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === email);

  if (userIndex === -1) {
    return {
      success: false,
      message: '사용자를 찾을 수 없습니다.'
    };
  }

  const decodedPassword = decodeApiKey(users[userIndex].password);
  if (decodedPassword !== oldPassword) {
    return {
      success: false,
      message: '현재 비밀번호가 일치하지 않습니다.'
    };
  }

  if (newPassword.length < 8) {
    return {
      success: false,
      message: '새 비밀번호는 최소 8자 이상이어야 합니다.'
    };
  }

  users[userIndex].password = encodeApiKey(newPassword);
  users[userIndex].updatedAt = Date.now();
  saveUsers(users);

  // 현재 로그인된 사용자면 API 키도 업데이트
  if (getCurrentUser() === email) {
    safeSetItem(STORAGE_KEYS.API_KEY, users[userIndex].password);
  }

  return {
    success: true,
    message: '비밀번호가 변경되었습니다.'
  };
};

// 계정 삭제
export const deleteAccount = (email: string, password: string): AuthResult => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === email);

  if (userIndex === -1) {
    return {
      success: false,
      message: '사용자를 찾을 수 없습니다.'
    };
  }

  const decodedPassword = decodeApiKey(users[userIndex].password);
  if (decodedPassword !== password) {
    return {
      success: false,
      message: '비밀번호가 일치하지 않습니다.'
    };
  }

  users.splice(userIndex, 1);
  saveUsers(users);

  // 현재 로그인된 사용자면 로그아웃
  if (getCurrentUser() === email) {
    logout();
  }

  return {
    success: true,
    message: '계정이 삭제되었습니다.'
  };
};

// 호환성을 위한 login alias (tryLogin과 동일하지만 에러 throw 방식)
export const login = (email: string, password: string, rememberMe: boolean = false): void => {
  const result = tryLogin(email, password, rememberMe);
  if (!result.success) {
    throw new Error(result.message);
  }
};

// 호환성을 위한 register alias
export const register = (email: string, password: string, passwordConfirm: string): void => {
  const result = tryRegister(email, password, passwordConfirm);
  if (!result.success) {
    throw new Error(result.message);
  }
};

// 세션 유효성 검사
export const validateSession = (): SessionResult => {
  if (!isAuthenticated()) {
    return {
      valid: false,
      message: '로그인이 필요합니다.'
    };
  }

  const currentUser = getCurrentUser();
  if (!currentUser) {
    logout();
    return {
      valid: false,
      message: '세션이 만료되었습니다.'
    };
  }

  const users = getUsers();
  const userExists = users.some(u => u.id === currentUser);

  if (!userExists) {
    logout();
    return {
      valid: false,
      message: '계정이 존재하지 않습니다.'
    };
  }

  return {
    valid: true,
    user: currentUser
  };
};

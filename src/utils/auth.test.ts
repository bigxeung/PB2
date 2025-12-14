/**
 * Auth 유틸리티 테스트
 * @description 인증 관련 함수들의 단위 테스트
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// localStorage mock
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

// sessionStorage mock
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// 테스트 전에 auth 모듈 import (localStorage mock 이후)
import {
  login,
  logout,
  tryRegister,
  isAuthenticated,
  getCurrentUser,
  getRememberedEmail,
  tryLogin,
} from './auth';

describe('Auth Utilities', () => {
  beforeEach(() => {
    localStorageMock.clear();
    sessionStorageMock.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorageMock.clear();
    sessionStorageMock.clear();
  });

  describe('tryRegister', () => {
    it('유효한 정보로 회원가입 성공', () => {
      const result = tryRegister('test@email.com', 'validkey123456789012345678901234', 'validkey123456789012345678901234');
      expect(result.success).toBe(true);
    });

    it('비밀번호 불일치 시 실패', () => {
      const result = tryRegister('test@email.com', 'password12345678', 'password87654321');
      expect(result.success).toBe(false);
      expect(result.message).toContain('일치');
    });

    it('빈 이메일로 실패', () => {
      const result = tryRegister('', 'password12345678', 'password12345678');
      expect(result.success).toBe(false);
    });

    it('잘못된 이메일 형식으로 실패', () => {
      const result = tryRegister('invalid-email', 'password12345678', 'password12345678');
      expect(result.success).toBe(false);
      expect(result.message).toContain('이메일');
    });

    it('짧은 비밀번호로 실패', () => {
      const result = tryRegister('test@email.com', 'short', 'short');
      expect(result.success).toBe(false);
      expect(result.message).toContain('8자');
    });

    it('중복 이메일로 실패', () => {
      // 먼저 사용자 등록
      const users = [{ id: 'existing@email.com', password: btoa('password12345678') }];
      localStorageMock.setItem('netflix_users', JSON.stringify(users));

      const result = tryRegister('existing@email.com', 'password123456789012345678901234', 'password123456789012345678901234');
      expect(result.success).toBe(false);
      expect(result.message).toContain('이미');
    });
  });

  describe('tryLogin', () => {
    beforeEach(() => {
      // 테스트용 사용자 등록 - encodeApiKey와 동일한 방식으로 인코딩
      const encodedPassword = btoa(unescape(encodeURIComponent('testpassword123456789012345678')));
      const users = [{ id: 'test@email.com', password: encodedPassword }];
      localStorageMock.setItem('netflix_users', JSON.stringify(users));
    });

    it('올바른 자격증명으로 로그인 성공', () => {
      const result = tryLogin('test@email.com', 'testpassword123456789012345678', false);
      expect(result.success).toBe(true);
    });

    it('존재하지 않는 계정으로 실패', () => {
      const result = tryLogin('notexist@email.com', 'password', false);
      expect(result.success).toBe(false);
      expect(result.message).toContain('존재하지 않는');
    });

    it('잘못된 비밀번호로 실패', () => {
      const result = tryLogin('test@email.com', 'wrongpassword', false);
      expect(result.success).toBe(false);
      expect(result.message).toContain('일치하지 않습니다');
    });

    it('Remember Me 옵션 작동', () => {
      tryLogin('test@email.com', 'testpassword123456789012345678', true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'netflix_isLoggedIn',
        'true'
      );
    });
  });

  describe('login (throw 버전)', () => {
    beforeEach(() => {
      const encodedPassword = btoa(unescape(encodeURIComponent('testpassword123456789012345678')));
      const users = [{ id: 'test@email.com', password: encodedPassword }];
      localStorageMock.setItem('netflix_users', JSON.stringify(users));
    });

    it('올바른 자격증명으로 로그인 성공 (에러 없음)', () => {
      expect(() => login('test@email.com', 'testpassword123456789012345678', false)).not.toThrow();
    });

    it('잘못된 자격증명으로 에러 발생', () => {
      expect(() => login('test@email.com', 'wrongpassword', false)).toThrow();
    });
  });

  describe('logout', () => {
    it('로그아웃 시 세션 정보 삭제', () => {
      localStorageMock.setItem('netflix_isLoggedIn', 'true');
      localStorageMock.setItem('netflix_currentUser', JSON.stringify('test@email.com'));

      logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('netflix_isLoggedIn');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('netflix_currentUser');
    });

    it('sessionStorage도 정리된다', () => {
      sessionStorageMock.setItem('netflix_isLoggedIn', 'true');

      logout();

      expect(sessionStorageMock.removeItem).toHaveBeenCalledWith('netflix_isLoggedIn');
    });
  });

  describe('isAuthenticated', () => {
    it('Remember Me로 로그인 상태 확인', () => {
      localStorageMock.setItem('netflix_rememberMe', JSON.stringify('true'));
      localStorageMock.setItem('netflix_isLoggedIn', 'true');
      expect(isAuthenticated()).toBe(true);
    });

    it('Session으로 로그인 상태 확인', () => {
      sessionStorageMock.setItem('netflix_isLoggedIn', 'true');
      expect(isAuthenticated()).toBe(true);
    });

    it('로그아웃 상태 확인', () => {
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('현재 사용자 반환', () => {
      localStorageMock.setItem('netflix_currentUser', JSON.stringify('test@email.com'));
      expect(getCurrentUser()).toBe('test@email.com');
    });

    it('로그인하지 않은 경우 null 반환', () => {
      expect(getCurrentUser()).toBeNull();
    });
  });

  describe('getRememberedEmail', () => {
    it('Remember Me가 설정되어 있으면 현재 사용자 반환', () => {
      localStorageMock.setItem('netflix_rememberMe', JSON.stringify('true'));
      localStorageMock.setItem('netflix_currentUser', JSON.stringify('saved@email.com'));
      expect(getRememberedEmail()).toBe('saved@email.com');
    });

    it('Remember Me가 없으면 빈 문자열 반환', () => {
      localStorageMock.setItem('netflix_currentUser', JSON.stringify('saved@email.com'));
      expect(getRememberedEmail()).toBe('');
    });
  });
});

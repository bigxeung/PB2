// 보안 관련 유틸리티 함수들

import type { PasswordStrength, ValidationResult } from '../types';

// API 키 난독화 (간단한 Base64 + SALT)
const SALT = 'netflix-clone-2024-secret-key';

export const encodeApiKey = (apiKey: string): string => {
  try {
    const combined = apiKey + SALT;
    return btoa(combined);
  } catch (error) {
    console.error('API 키 인코딩 실패:', error);
    return apiKey; // 실패 시 원본 반환
  }
};

export const decodeApiKey = (encoded: string): string | null => {
  try {
    const decoded = atob(encoded);
    return decoded.replace(SALT, '');
  } catch (error) {
    console.error('API 키 디코딩 실패:', error);
    return null;
  }
};

// XSS 공격 방지
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

// XSS 방지를 위한 HTML 이스케이프
export const escapeHtml = (text: string): string => {
  if (!text || typeof text !== 'string') return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// 이메일 형식 검증
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 입력값 검증
export const validateInput = (input: string, type: 'text' | 'email' | 'password' | 'search' = 'text'): ValidationResult => {
  if (!input || typeof input !== 'string') {
    return { valid: false, message: '입력값이 비어있습니다.' };
  }

  const trimmed = input.trim();

  switch (type) {
    case 'email': {
      if (!validateEmail(trimmed)) {
        return { valid: false, message: '유효하지 않은 이메일 형식입니다.' };
      }
      break;
    }
    case 'password': {
      if (trimmed.length < 6) {
        return { valid: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' };
      }
      break;
    }
    case 'search': {
      if (trimmed.length < 2) {
        return { valid: false, message: '검색어는 최소 2자 이상이어야 합니다.' };
      }
      // 특수문자 제한
      const searchRegex = /^[a-zA-Z0-9가-힣\s]+$/;
      if (!searchRegex.test(trimmed)) {
        return { valid: false, message: '검색어에 특수문자를 사용할 수 없습니다.' };
      }
      break;
    }
    default:
      break;
  }

  return { valid: true, value: trimmed };
};

// API 키 마스킹 (로깅용)
export const maskApiKey = (key: string): string => {
  if (!key || key.length < 8) return '***';
  return key.substring(0, 4) + '***' + key.substring(key.length - 4);
};

// 세션 만료 확인 (24시간)
export const isSessionExpired = (loginAt: string): boolean => {
  if (!loginAt) return true;

  const loginTime = new Date(loginAt).getTime();
  const currentTime = Date.now();
  const hoursDiff = (currentTime - loginTime) / (1000 * 60 * 60);

  return hoursDiff > 24;
};

// 비밀번호 강도 검사
export const checkPasswordStrength = (password: string): PasswordStrength => {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^a-zA-Z0-9]/.test(password)) strength++;

  if (strength <= 2) return { level: 'weak', message: '약함', color: 'red' };
  if (strength <= 4) return { level: 'medium', message: '보통', color: 'yellow' };
  return { level: 'strong', message: '강함', color: 'green' };
};

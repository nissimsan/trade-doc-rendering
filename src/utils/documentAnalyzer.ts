import { TradeDocument } from '../types';

/**
 * A complex field - either an object or an array
 */
export interface ComplexField {
  key: string;
  type: 'object' | 'array';
  value: Record<string, unknown> | unknown[];
}

/**
 * Simple categorized structure - no complex detection logic
 */
export interface SimpleCategorizedFields {
  /** Document verification info (id, dates, issuer) from root */
  verification: Record<string, unknown>;
  /** Simple scalar values (strings, numbers, booleans) */
  simpleFields: Record<string, unknown>;
  /** Complex fields (objects and arrays) in document order */
  complexFields: ComplexField[];
}

/**
 * Extract document title from type array
 */
export function extractDocumentTitle(document: TradeDocument): string {
  if (!document.type || !Array.isArray(document.type)) {
    return 'Trade Document';
  }
  
  // Find the most specific type (not VerifiableCredential)
  const specificType = document.type.find(t => t !== 'VerifiableCredential');
  if (specificType) {
    // Convert camelCase or PascalCase to readable format
    return specificType
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/\s+/g, ' ');
  }
  
  return 'Trade Document';
}

/**
 * Convert camelCase to Title Case with spaces
 */
export function camelToTitleCase(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

/**
 * Format a field key for display
 */
export function formatFieldLabel(key: string): string {
  // Handle common abbreviations
  const abbreviations: Record<string, string> = {
    'id': 'ID',
    'sku': 'SKU',
    'url': 'URL',
    'uri': 'URI',
    'un': 'UN',
  };
  
  let result = camelToTitleCase(key);
  
  // Replace abbreviations
  Object.entries(abbreviations).forEach(([abbr, replacement]) => {
    const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
    result = result.replace(regex, replacement);
  });
  
  return result;
}

/**
 * Simple categorization - just split by type, no detection logic
 */
export function categorizeFieldsSimple(document: TradeDocument): SimpleCategorizedFields {
  const result: SimpleCategorizedFields = {
    verification: {},
    simpleFields: {},
    complexFields: [],
  };

  // Extract verification fields from document root
  if (document.id) {
    result.verification.id = document.id;
  }
  if (document.issuer) {
    result.verification.issuer = document.issuer;
  }
  if (document.validFrom) {
    result.verification.issuanceDate = document.validFrom;
  }
  if (document.validTo) {
    result.verification.expirationDate = document.validTo;
  }

  // Process credential subject - iterate in document order
  const subject = document.credentialSubject;
  if (!subject) {
    return result;
  }

  // Process each field in the order it appears
  for (const key of Object.keys(subject)) {
    const value = subject[key];
    
    if (value === undefined || value === null) {
      continue;
    }

    // Simple values → simpleFields
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      result.simpleFields[key] = value;
      continue;
    }

    // Arrays → complexFields with type 'array'
    if (Array.isArray(value)) {
      result.complexFields.push({ key, type: 'array', value });
      continue;
    }

    // Objects → complexFields with type 'object'
    if (typeof value === 'object') {
      result.complexFields.push({ key, type: 'object', value: value as Record<string, unknown> });
      continue;
    }
  }

  return result;
}

/**
 * Format a value for display
 */
export function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    // Handle quantity/monetary objects
    const obj = value as Record<string, unknown>;
    if ('amount' in obj && 'currency' in obj) {
      return `${obj.amount} ${obj.currency}`;
    }
    if ('amount' in obj && 'unit' in obj) {
      return `${obj.amount} ${obj.unit}`;
    }
    return JSON.stringify(value);
  }
  return String(value);
}

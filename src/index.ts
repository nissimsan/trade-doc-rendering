// Main component
export { TradeDocumentRenderer } from './components/TradeDocumentRenderer';
export type { TradeDocumentRendererProps } from './components/TradeDocumentRenderer';

// Data types
export type {
  TradeDocument,
  TradeDocumentSubject,
  TradeParty,
  LineItem,
  Location,
  MonetaryAmount,
  QuantityValue,
  Product,
  CategorizedFields,
  CredentialSchema,
} from './types';

// Utilities
export {
  categorizeFieldsSimple,
  extractDocumentTitle,
  formatFieldLabel,
  camelToTitleCase,
  formatValue,
} from './utils/documentAnalyzer';

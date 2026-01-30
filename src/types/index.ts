/**
 * Represents a monetary amount with currency
 */
export interface MonetaryAmount {
  amount: number;
  currency: string;
}

/**
 * Represents a quantity with unit
 */
export interface QuantityValue {
  amount: number;
  unit: string;
}

/**
 * Generic trade party (buyer, seller, consignee, etc.)
 */
export interface TradeParty {
  type?: string;
  id?: string;
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string | number;
  country?: string;
  email?: string;
  phone?: string;
  [key: string]: unknown;
}

/**
 * Product information within a line item
 */
export interface Product {
  id?: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Line item in the trade document
 */
export interface LineItem {
  product?: Product;
  sku?: string;
  itemCount?: number;
  netWeight?: QuantityValue;
  grossWeight?: QuantityValue;
  productPrice?: MonetaryAmount;
  price?: MonetaryAmount;
  commodity?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Location information
 */
export interface Location {
  street?: string;
  city?: string;
  state?: string;
  zip?: string | number;
  country?: string;
  unLocode?: string;
  unlocode?: string;
  portName?: string;
  iataAirportCode?: string;
  [key: string]: unknown;
}

/**
 * Credential schema reference
 */
export interface CredentialSchema {
  id: string;
  type: string;
}

/**
 * The main trade document structure
 */
export interface TradeDocument {
  '@context'?: string | object;
  type?: string[];
  credentialSchema?: CredentialSchema;
  id?: string;
  validFrom?: string;
  validTo?: string;
  issuer?: string;
  credentialSubject?: TradeDocumentSubject;
  [key: string]: unknown;
}

/**
 * The credential subject containing the actual trade document data
 */
export interface TradeDocumentSubject {
  purchaseOrderNumber?: string;
  contractNumber?: string;
  invoiceNumber?: string;
  issueDate?: string;
  invoiceDate?: string;
  paymentDueDate?: string;
  billOfLadingNumber?: string;
  letterOfCreditNumber?: string;
  portOfEntry?: Location;
  destinationCountry?: string;
  buyer?: TradeParty;
  seller?: TradeParty;
  invoicee?: TradeParty;
  consignee?: TradeParty;
  sellersBank?: TradeParty;
  sellerBankAccountNumber?: string;
  originalLoadingLocation?: Location;
  originCountry?: Location;
  tradeTermsConditionsDescription?: string;
  tradeTermsConditionsCode?: string;
  paymentTerms?: string;
  paymentMethod?: string;
  itemsShipped?: LineItem[];
  freightCost?: MonetaryAmount;
  insuranceCost?: MonetaryAmount;
  totalAmount?: MonetaryAmount;
  [key: string]: unknown;
}

/**
 * Simple categorized fields for rendering - no complex detection logic
 */
export interface CategorizedFields {
  /** Document verification info (id, dates, issuer) from root */
  verification: Record<string, unknown>;
  /** Simple scalar values (strings, numbers, booleans) */
  simpleFields: Record<string, unknown>;
  /** Object fields - rendered as half-width boxes */
  objectFields: Array<{ key: string; value: Record<string, unknown> }>;
  /** Array fields - rendered as tables */
  arrayFields: Array<{ key: string; value: unknown[] }>;
}




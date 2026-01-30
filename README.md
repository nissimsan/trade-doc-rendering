# Trade Document Rendering

A TypeScript/React library for rendering trade documents (commercial invoices, bills of lading, certificates of origin, etc.) from JSON data.

## Features

- **Simple & Generic** - Works with any trade document structure
- **Automatic Layout** - Objects render as half-width boxes, arrays as full-width tables
- **Print-Friendly** - Page breaks between sections, not through them
- **No Configuration Needed** - Just pass your JSON document

## Installation

```bash
npm install trade-doc-rendering
```

**Peer Dependencies:** This library requires React 18+ and MUI 5+:

```bash
npm install react react-dom @mui/material @emotion/react @emotion/styled
```

## Usage

```tsx
import { TradeDocumentRenderer } from 'trade-doc-rendering';

const myDocument = {
  type: ['VerifiableCredential', 'CommercialInvoice'],
  id: 'urn:uuid:abc123',
  issuer: 'did:web:seller.example.com',
  validFrom: '2025-01-01T00:00:00Z',
  validTo: '2026-01-01T00:00:00Z',
  credentialSubject: {
    invoiceNumber: 'INV-2025-001',
      seller: {
        type: 'Seller', 
        name: 'Global Supplies Ltd',
        street: '456 Trade Ave',
        city: 'Copenhagen',
        country: 'DK'
      },
    buyer: {
      type: 'Buyer',
      name: 'Acme Corporation',
      street: '123 Main St',
      city: 'Sydney',
      country: 'AU'
    },
    itemsShipped: [
      {
        product: { name: 'Widget A', description: 'Premium widget' },
        itemCount: 100,
        price: { amount: 50, currency: 'USD' }
      }
    ],
    totalAmount: { amount: 5000, currency: 'USD' }
  }
};

function App() {
  return <TradeDocumentRenderer document={myDocument} />;
}
```

## How It Works

The renderer automatically categorizes your document fields:

| Field Type | Rendering |
|------------|-----------|
| Root fields (`id`, `issuer`, `validFrom`, `validTo`) | "Document Verification" section |
| Simple values (strings, numbers) | "Claims" section |
| Objects | Half-width boxes, paired side-by-side |
| Arrays | Full-width tables with flattened columns |

All fields render in their original document order.

## Props

```tsx
interface TradeDocumentRendererProps {
  document: TradeDocument;  // Your JSON document
  title?: string;           // Override auto-detected title
  className?: string;       // Custom CSS class
}
```

## Document Structure

The library expects documents following a Verifiable Credential-like structure:

```typescript
interface TradeDocument {
  type?: string[];           // e.g., ['VerifiableCredential', 'CommercialInvoice']
  id?: string;               // Document identifier
  issuer?: string;           // Issuer identifier
  validFrom?: string;        // ISO date string
  validTo?: string;          // ISO date string
  credentialSubject?: {      // The actual document content
    [key: string]: any;
  };
}
```

## Development

```bash
# Install dependencies
npm install

# Start dev server with demo
npm run dev

# Build for production
npm run build
```

## License

MIT

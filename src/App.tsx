import React from 'react';
import { Box, CssBaseline } from '@mui/material';
import { TradeDocumentRenderer, TradeDocument } from './index';

// Sample commercial invoice data
const sampleDocument: TradeDocument = {
  "@context": "https://un.opensource.unicc.org/unece/uncefact/spec-unvtd/commercial-invoice-context.json",
  "type": [
    "VerifiableCredential",
    "CommercialInvoice"
  ],
  "credentialSchema": {
    "id": "https://un.opensource.unicc.org/unece/uncefact/spec-unvtd/commercial-invoice-schema.yaml",
    "type": "JsonSchema"
  },
  "id": "urn:uuid:e9bf65a3-9ff3-4988-8c44-2535b949279f",
  "validFrom": "2025-03-06T10:00:00Z",
  "validTo": "2026-03-06T10:00:00Z",
  "issuer": "did:web:surfpro.example.com",
  "credentialSubject": {
    "purchaseOrderNumber": "PO-2025-001",
    "contractNumber": "CTR-2025-SURF-001",
    "invoiceNumber": "INV-2025-031-001",
    "issueDate": "2025-03-10",
    "invoiceDate": "2025-03-10",
    "paymentDueDate": "2025-04-09",
    "billOfLadingNumber": "POSL-2025-001234",
    "letterOfCreditNumber": "LC-2025-AU-456789",
    "portOfEntry": {
      "unLocode": "USLAX",
      "portName": "Los Angeles"
    },
    "destinationCountry": "US",
    "buyer": {
      "type": "Buyer",
      "id": "did:web:waveridersupplies.example.com",
      "name": "Wave Rider Supplies, Inc",
      "street": "210 Ocean Road",
      "city": "Williamsburg",
      "state": "NSW",
      "zip": 75002,
      "country": "AU"
    },
    "invoicee": {
      "type": "Invoicee",
      "id": "did:web:waveridersupplies.example.com",
      "name": "Wave Rider Supplies, Inc",
      "street": "210 Ocean Road",
      "city": "Williamsburg",
      "state": "NSW",
      "zip": 75002,
      "country": "AU"
    },
    "consignee": {
      "type": "Consignee",
      "id": "did:web:waveriderdistribution.example.com",
      "name": "Wave Rider Distribution Center",
      "street": "500 Logistics Boulevard",
      "city": "Los Angeles",
      "state": "CA",
      "zip": 90045,
      "country": "US"
    },
    "sellersBank": {
      "type": "SellersBank",
      "id": "did:web:pacifictrade.bank.au",
      "name": "Pacific Trade Bank",
      "street": "340 Main Street",
      "city": "Brisbane",
      "state": "QLD",
      "zip": 29110,
      "country": "AU"
    },
    "seller": {
      "type": "Seller",
      "id": "did:web:surfpro.example.com",
      "name": "SurfPro Manufacturing Inc.",
      "street": "150 Industrial Drive",
      "city": "Gold Coast",
      "state": "QLD",
      "zip": 4217,
      "country": "AU"
    },
    "sellerBankAccountNumber": "9876543210",
    "originalLoadingLocation": {
      "street": "Port of Gold Coast",
      "city": "Gold Coast",
      "state": "QLD",
      "zip": 4215,
      "iataAirportCode": "OOL",
      "unlocode": "https://service.unece.org/trade/locode/au.htm#AUGOL"
    },
    "originCountry": {
      "city": "Gold Coast",
      "state": "QLD",
      "country": "AU"
    },
    "tradeTermsConditionsDescription": "FOB Port of Gold Coast",
    "tradeTermsConditionsCode": "FOB",
    "paymentTerms": "Net 30 days",
    "paymentMethod": "Wire Transfer",
    "itemsShipped": [
      {
        "product": {
          "id": "urn:uuid:surf-001-longboard",
          "name": "Professional Longboard - Ocean Series",
          "description": "High-performance longboard with premium bamboo core and fiberglass construction, 9'6\" length"
        },
        "sku": "SURF-LB-001",
        "itemCount": 25,
        "netWeight": {
          "amount": 187.5,
          "unit": "KGS"
        },
        "grossWeight": {
          "amount": 200.0,
          "unit": "KGS"
        },
        "productPrice": {
          "amount": 750.00,
          "currency": "USD"
        },
        "commodity": "950630",
        "price": {
          "amount": 18750.00,
          "currency": "USD"
        }
      },
      {
        "product": {
          "id": "urn:uuid:surf-002-shortboard",
          "name": "Performance Shortboard - Pro Series",
          "description": "Competition-grade shortboard with carbon fiber reinforcement, 6'2\" length"
        },
        "sku": "SURF-SB-002",
        "itemCount": 50,
        "netWeight": {
          "amount": 150.0,
          "unit": "KGS"
        },
        "grossWeight": {
          "amount": 165.0,
          "unit": "KGS"
        },
        "productPrice": {
          "amount": 650.00,
          "currency": "USD"
        },
        "commodity": "950630",
        "price": {
          "amount": 32500.00,
          "currency": "USD"
        }
      },
      {
        "product": {
          "id": "urn:uuid:surf-003-fins",
          "name": "Surfboard Fin Set - Thruster",
          "description": "Professional thruster fin set with honeycomb construction"
        },
        "sku": "SURF-FIN-003",
        "itemCount": 100,
        "netWeight": {
          "amount": 25.0,
          "unit": "KGS"
        },
        "grossWeight": {
          "amount": 30.0,
          "unit": "KGS"
        },
        "productPrice": {
          "amount": 85.00,
          "currency": "USD"
        },
        "commodity": "950630",
        "price": {
          "amount": 8500.00,
          "currency": "USD"
        }
      },
      {
        "product": {
          "id": "urn:uuid:surf-004-wetsuit",
          "name": "Premium Wetsuit - 3/2mm",
          "description": "High-quality neoprene wetsuit with sealed seams, 3/2mm thickness"
        },
        "sku": "SURF-WS-004",
        "itemCount": 75,
        "netWeight": {
          "amount": 112.5,
          "unit": "KGS"
        },
        "grossWeight": {
          "amount": 125.0,
          "unit": "KGS"
        },
        "productPrice": {
          "amount": 180.00,
          "currency": "USD"
        },
        "commodity": "621220",
        "price": {
          "amount": 13500.00,
          "currency": "USD"
        }
      }
    ],
    "freightCost": {
      "amount": 1250.00,
      "currency": "USD"
    },
    "insuranceCost": {
      "amount": 366.25,
      "currency": "USD"
    },
    "totalAmount": {
      "amount": 74866.25,
      "currency": "USD"
    }
  }
};

const App: React.FC = () => {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#f0f4f8',
          py: 4,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#ffffff',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            maxWidth: 900,
            width: '100%',
          }}
        >
          <TradeDocumentRenderer document={sampleDocument} />
        </Box>
      </Box>
    </>
  );
};

export default App;


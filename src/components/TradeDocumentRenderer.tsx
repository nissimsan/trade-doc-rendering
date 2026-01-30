import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { TradeDocument } from '../types';
import { categorizeFieldsSimple, extractDocumentTitle, formatFieldLabel, formatValue } from '../utils/documentAnalyzer';

/**
 * Props for TradeDocumentRenderer
 */
export interface TradeDocumentRendererProps {
  /** The trade document data to render */
  document: TradeDocument;
  /** Document title override (auto-detected from type if not provided) */
  title?: string;
  /** Custom CSS class name */
  className?: string;
}

/**
 * Renders a section box with a title
 * Uses shared borders (strokes between sections, not outlined boxes)
 */
const SectionBox: React.FC<{
  title: string;
  halfWidth?: boolean;
  isRightColumn?: boolean;
  children: React.ReactNode;
}> = ({ title, halfWidth = false, isRightColumn = false, children }) => (
  <Box
    sx={{
      width: halfWidth ? '50%' : '100%',
      borderLeft: isRightColumn ? '1px solid #2d3748' : 'none',
      display: 'flex',
      flexDirection: 'column',
      p: 1.5,
      breakInside: 'avoid', // Avoid page breaks inside this box when printing
    }}
  >
    <Typography
      sx={{
        fontSize: '0.8125rem',
        fontWeight: 600,
        color: '#1a1a1a',
        mb: 1,
      }}
    >
      {title}
    </Typography>
    {children}
  </Box>
);

/**
 * Renders a field row (label + value)
 */
const FieldRow: React.FC<{ label: string; value: unknown }> = ({ label, value }) => {
  const displayValue = formatValue(value);
  if (!displayValue) return null;
  
  return (
    <Box sx={{ display: 'flex', mb: 0.5, '&:last-child': { mb: 0 }, flexWrap: 'wrap' }}>
      <Typography
        component="span"
        sx={{
          fontStyle: 'italic',
          width: '140px',
          minWidth: '140px',
          flexShrink: 0,
          fontSize: '0.75rem',
          color: '#1a1a1a',
          wordBreak: 'break-word',
          pr: 1,
        }}
      >
        {label}
      </Typography>
      <Typography
        component="span"
        sx={{
          fontSize: '0.75rem',
          color: '#1a1a1a',
          wordBreak: 'break-word',
          flex: 1,
          minWidth: 0,
        }}
      >
        {displayValue}
      </Typography>
    </Box>
  );
};

/**
 * Renders an object as a section with field rows
 */
const ObjectSection: React.FC<{
  title: string;
  data: Record<string, unknown>;
  halfWidth?: boolean;
  isRightColumn?: boolean;
}> = ({ title, data, halfWidth = true, isRightColumn = false }) => {
  // Get display title from 'type' field if it exists, otherwise use the key
  const displayTitle = (data.type as string) || formatFieldLabel(title);
  
  return (
    <SectionBox title={displayTitle} halfWidth={halfWidth} isRightColumn={isRightColumn}>
      {Object.entries(data)
        .filter(([key]) => key !== 'type') // Don't show 'type' as a field since it's in the title
        .map(([key, value]) => (
          <FieldRow key={key} label={formatFieldLabel(key)} value={value} />
        ))}
    </SectionBox>
  );
};

/**
 * Flatten an object - nested object properties become siblings
 * e.g., { product: { name: "X", id: "Y" }, sku: "Z" } 
 * becomes { "name": "X", "id": "Y", "sku": "Z" }
 */
function flattenObject(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      // Check if it's a "leaf" object (like { amount, currency } or { amount, unit })
      const objValue = value as Record<string, unknown>;
      const keys = Object.keys(objValue);
      const isLeafObject = 
        (keys.includes('amount') && (keys.includes('currency') || keys.includes('unit'))) ||
        keys.length <= 2;
      
      if (isLeafObject && keys.includes('amount')) {
        // Format as a single value using the parent key
        result[key] = formatValue(value);
      } else {
        // Recurse into nested object - use child keys directly
        Object.assign(result, flattenObject(objValue));
      }
    } else {
      result[key] = value;
    }
  }
  
  return result;
}

/**
 * Renders an array as a table with flattened columns
 */
const ArrayTable: React.FC<{
  title: string;
  data: unknown[];
}> = ({ title, data }) => {
  if (data.length === 0) return null;
  
  // Flatten all items and collect all unique column paths
  const flattenedItems: Record<string, unknown>[] = [];
  const allColumns = new Set<string>();
  
  data.forEach(item => {
    if (typeof item === 'object' && item !== null) {
      const flattened = flattenObject(item as Record<string, unknown>);
      flattenedItems.push(flattened);
      Object.keys(flattened).forEach(key => allColumns.add(key));
    }
  });
  
  const columns = Array.from(allColumns);

  return (
    <Box
      sx={{
        width: '100%',
        p: 1.5,
      }}
    >
      <Typography
        sx={{
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#1a1a1a',
          mb: 1,
        }}
      >
        {formatFieldLabel(title)}
      </Typography>
      <Box sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.6875rem' }}>
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col}
                  style={{
                    padding: '6px 8px',
                    textAlign: 'left',
                    borderBottom: '1px solid #2d3748',
                    fontWeight: 400,
                    fontStyle: 'italic',
                  }}
                >
                  {formatFieldLabel(col)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {flattenedItems.map((item, idx) => (
              <tr key={idx}>
                {columns.map(col => {
                  const cellValue = item[col];
                  return (
                    <td
                      key={col}
                      style={{
                        padding: '6px 8px',
                        borderBottom: idx === flattenedItems.length - 1 ? 'none' : '1px solid #e2e8f0',
                        verticalAlign: 'top',
                      }}
                    >
                      {formatValue(cellValue)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

/**
 * Main component for rendering trade documents
 */
export const TradeDocumentRenderer: React.FC<TradeDocumentRendererProps> = ({
  document,
  title,
  className,
}) => {
  // Simple categorization - just split by type
  const categorized = useMemo(() => categorizeFieldsSimple(document), [document]);

  // Extract document title from type if not provided
  const documentTitle = title || extractDocumentTitle(document);

  // Build render elements in document order
  // Objects are paired up, but arrays interrupt the pairing
  const renderElements = useMemo(() => {
    const elements: React.ReactNode[] = [];
    let pendingObject: { key: string; value: Record<string, unknown> } | null = null;
    let elementIndex = 0;

    for (const field of categorized.complexFields) {
      if (field.type === 'array') {
        // If there's a pending object, render it first (with empty right side)
        if (pendingObject) {
          elements.push(
            <Box key={`row-${elementIndex++}`} sx={{ display: 'flex', width: '100%', borderBottom: '1px solid #2d3748', breakInside: 'avoid' }}>
              <ObjectSection
                title={pendingObject.key}
                data={pendingObject.value}
                halfWidth={true}
              />
              <Box sx={{ width: '50%', borderLeft: '1px solid #2d3748' }} />
            </Box>
          );
          pendingObject = null;
        }
        // Render the array as full-width table
        elements.push(
          <Box key={`array-${field.key}`} sx={{ borderBottom: '1px solid #2d3748', breakInside: 'avoid' }}>
            <ArrayTable title={field.key} data={field.value as unknown[]} />
          </Box>
        );
      } else {
        // It's an object
        const objValue = field.value as Record<string, unknown>;
        if (pendingObject) {
          // Pair with pending object
          elements.push(
            <Box key={`row-${elementIndex++}`} sx={{ display: 'flex', width: '100%', borderBottom: '1px solid #2d3748', breakInside: 'avoid' }}>
              <ObjectSection
                title={pendingObject.key}
                data={pendingObject.value}
                halfWidth={true}
              />
              <ObjectSection
                title={field.key}
                data={objValue}
                halfWidth={true}
                isRightColumn={true}
              />
            </Box>
          );
          pendingObject = null;
        } else {
          // Store as pending
          pendingObject = { key: field.key, value: objValue };
        }
      }
    }

    // Render any remaining pending object
    if (pendingObject) {
      elements.push(
        <Box key={`row-${elementIndex++}`} sx={{ display: 'flex', width: '100%', borderBottom: '1px solid #2d3748', breakInside: 'avoid' }}>
          <ObjectSection
            title={pendingObject.key}
            data={pendingObject.value}
            halfWidth={true}
          />
          <Box sx={{ width: '50%', borderLeft: '1px solid #2d3748' }} />
        </Box>
      );
    }

    return elements;
  }, [categorized.complexFields]);

  return (
    <Box
      className={className}
      sx={{
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        fontFamily: '"IBM Plex Sans", "Roboto", "Helvetica", "Arial", sans-serif',
        p: 3,
      }}
    >
      {/* Document Title */}
      <Typography
        variant="h1"
        sx={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#1a1a1a',
          mb: 0,
          pb: 1.5,
        }}
      >
        {documentTitle}
      </Typography>

      {/* Main content container */}
      <Box
        sx={{
          borderLeft: '1px solid #2d3748',
          borderRight: '1px solid #2d3748',
          borderTop: '1px solid #2d3748',
          boxDecorationBreak: 'clone',
          WebkitBoxDecorationBreak: 'clone',
        }}
      >
        {/* Row 1: Document Verification + Claims (simple fields) */}
        <Box sx={{ display: 'flex', width: '100%', borderBottom: '1px solid #2d3748', breakInside: 'avoid' }}>
          <SectionBox title="Document Verification" halfWidth={true}>
            {Object.entries(categorized.verification).map(([key, value]) => (
              <FieldRow key={key} label={formatFieldLabel(key)} value={value} />
            ))}
          </SectionBox>
          <SectionBox title="Claims" halfWidth={true} isRightColumn={true}>
            {Object.entries(categorized.simpleFields).map(([key, value]) => (
              <FieldRow key={key} label={formatFieldLabel(key)} value={value} />
            ))}
          </SectionBox>
        </Box>

        {/* Complex fields - objects paired, arrays full-width, all in document order */}
        {renderElements}
      </Box>
    </Box>
  );
};

export default TradeDocumentRenderer;

/**
 * Mock Restaurant Tables with unpredictable QR Tokens
 */
export const MOCK_TABLES = [
  {
    id: "table-01",
    qrToken: "tbl-main-01",
    tableNumber: "Table 01",
    section: "Main Roastery Hall",
    capacity: 2,
    isActive: true
  },
  {
    id: "table-02",
    qrToken: "tbl-main-02",
    tableNumber: "Table 02",
    section: "Main Roastery Hall",
    capacity: 4,
    isActive: true
  },
  {
    id: "table-04",
    qrToken: "tbl-patio-04",
    tableNumber: "Table 04",
    section: "Sunlit Patio Terrace",
    capacity: 4,
    isActive: true
  },
  {
    id: "table-07",
    qrToken: "tbl-garden-07",
    tableNumber: "Table 07",
    section: "Courtyard Garden",
    capacity: 6,
    isActive: true
  },
  {
    id: "table-09",
    qrToken: "tbl-balcony-09",
    tableNumber: "Table 09",
    section: "Mezzanine Balcony",
    capacity: 2,
    isActive: true
  }
];

export const getTableByToken = (token) => {
  if (!token) return null;
  return MOCK_TABLES.find(t => t.qrToken.toLowerCase() === token.toLowerCase()) || null;
};


import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Box,
  Alert,
} from '@mui/material';
import { Save as SaveIcon } from '@mui/icons-material';
import { AdminButton } from '../../../components/common/buttons';
import type { VehiclePrices } from '../types/settings.types';
import { convertEurToBgn } from '../../../utils/constants';

interface PricingTableProps {
  prices: VehiclePrices;
  onlineDiscount: number;
  onSave: (prices: VehiclePrices, discount: number) => Promise<void>;
  disabled?: boolean;
}

const vehicleLabels: Record<keyof VehiclePrices, string> = {
  car: 'Лека кола',
  bus: 'Микробус до 3.5т',
  motorcycle: 'Мотор',
  taxi: 'Такси',
  caravan: 'Каравана',
  trailer: 'Ремарке',
  lpg: 'Преглед оразполагаем газ',
};

export function PricingTable({ prices, onlineDiscount, onSave, disabled }: PricingTableProps) {
  const [editedPrices, setEditedPrices] = useState<VehiclePrices>(prices);
  const [editedDiscount, setEditedDiscount] = useState(onlineDiscount);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePriceChange = (vehicle: keyof VehiclePrices, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditedPrices((prev) => ({ ...prev, [vehicle]: numValue }));
    }
  };

  const handleDiscountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setEditedDiscount(numValue);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      await onSave(editedPrices, editedDiscount);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Грешка при записване');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    JSON.stringify(editedPrices) !== JSON.stringify(prices) || editedDiscount !== onlineDiscount;

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Цените са записани успешно!
        </Alert>
      )}

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Вид превозно средство</TableCell>
              <TableCell align="right">Цена (€)</TableCell>
              <TableCell align="right">Цена (лв - изчислено)</TableCell>
              <TableCell align="right">С онлайн отстъпка</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(Object.keys(vehicleLabels) as Array<keyof VehiclePrices>).map((vehicle) => {
              const priceInBgn = convertEurToBgn(editedPrices[vehicle]);
              const finalPriceEur = editedPrices[vehicle] - editedDiscount;

              return (
                <TableRow key={vehicle}>
                  <TableCell>{vehicleLabels[vehicle]}</TableCell>
                  <TableCell align="right">
                    <TextField
                      type="number"
                      value={editedPrices[vehicle]}
                      onChange={(e) => handlePriceChange(vehicle, e.target.value)}
                      disabled={disabled || saving}
                      size="small"
                      sx={{ width: 100 }}
                      slotProps={{ htmlInput: { min: 0, step: 1 } }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                      {priceInBgn.toFixed(2)} лв
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ color: 'success.main', fontWeight: 'medium' }}>
                      {finalPriceEur.toFixed(2)} € ({convertEurToBgn(finalPriceEur).toFixed(2)} лв)
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell>
                <strong>Онлайн отстъпка</strong>
              </TableCell>
              <TableCell align="right">
                <TextField
                  type="number"
                  value={editedDiscount}
                  onChange={(e) => handleDiscountChange(e.target.value)}
                  disabled={disabled || saving}
                  size="small"
                  sx={{ width: 100 }}
                  slotProps={{ htmlInput: { min: 0, step: 1 } }}
                />
              </TableCell>
              <TableCell align="right">
                <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  {convertEurToBgn(editedDiscount).toFixed(2)} лв
                </Box>
              </TableCell>
              <TableCell align="right">
                <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
                  Отстъпка за всички записвания онлайн
                </Box>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <AdminButton
          adminVariant="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={!hasChanges || disabled || saving}
        >
          {saving ? 'Записване...' : 'Запази цените'}
        </AdminButton>
      </Box>
    </Box>
  );
}

// CreatePoolForm.tsx
import { useState } from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';



interface CreatePoolFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (poolData: {
    totalAmount: string;
    minAllocation: string;
    maxAllocation: string;
    riskLevel: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export default function CreatePoolForm({ isOpen, onClose, onSubmit, isLoading }: CreatePoolFormProps) {
  const [newPoolAmount, setNewPoolAmount] = useState('');
  const [minAllocation, setMinAllocation] = useState('');
  const [maxAllocation, setMaxAllocation] = useState('');
  const [riskLevel, setRiskLevel] = useState('1');

  const handleSubmit = async () => {
    await onSubmit({
      totalAmount: newPoolAmount,
      minAllocation,
      maxAllocation,
      riskLevel
    });
    // Reset form
    setNewPoolAmount('');
    setMinAllocation('');
    setMaxAllocation('');
    setRiskLevel('1');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Pool</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label>Total Pool Amount</Label>
            <Input
              type="number"
              placeholder="Enter amount"
              value={newPoolAmount}
              onChange={(e) => setNewPoolAmount(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Minimum Allocation</Label>
            <Input
              type="number"
              placeholder="Minimum allocation per trader"
              value={minAllocation}
              onChange={(e) => setMinAllocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Maximum Allocation</Label>
            <Input
              type="number"
              placeholder="Maximum allocation per trader"
              value={maxAllocation}
              onChange={(e) => setMaxAllocation(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Risk Level</Label>
            <Select value={riskLevel} onValueChange={setRiskLevel}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Low Risk</SelectItem>
                <SelectItem value="2">Medium Risk</SelectItem>
                <SelectItem value="3">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Pool'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
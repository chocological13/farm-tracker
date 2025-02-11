import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePackingForm } from "@/hooks/usePackingForm";
import React from "react";

const PackingRecordForm = () => {
  const { toast } = useToast();
  const { formData, handleSubmit, handleChange, resetForm } = usePackingForm();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleSubmit();

    if (success) {
      toast({
        title: "Success",
        description: "Packing record has been successfully saved.",
        variant: "default",
        duration: 3000,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to save packing record. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const formatDateTimeForInput = (isoString: string) => {
    // Create a new Date object from the ISO string
    const date = new Date(isoString);

    // Adjust for local timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const localDate = new Date(
      date.toLocaleString("en-US", { timeZone: userTimezone }),
    );

    // Format the date to YYYY-MM-DDThh:mm
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    const hours = String(localDate.getHours()).padStart(2, "0");
    const minutes = String(localDate.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert the local datetime to UTC
    const localDate = new Date(e.target.value);
    const utcDate = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000,
    ).toISOString();

    handleChange("datetime", utcDate);
  };

  const handleQuantityChange = (name: string, value: string) => {
    const newValue = Number(value) || 0;

    // Update the pack quantity
    handleChange(name, newValue);

    // Calculate the updated gross weight
    const updatedGrossWeight =
      (Number(name === "pack_a_qty" ? newValue : formData.pack_a_qty) || 0) *
        0.2 +
      (Number(name === "pack_b_qty" ? newValue : formData.pack_b_qty) || 0) *
        0.3 +
      (Number(name === "pack_c_qty" ? newValue : formData.pack_c_qty) || 0) *
        0.4;

    handleChange("gross_weight", updatedGrossWeight.toFixed(2)); // Keep two decimal places
  };

  return (
    <Card className="p-6 bg-stone-50/50 border-stone-200">
      <h2 className="text-2xl font-bold text-rose-800/90 mb-4">
        New Packing Record
      </h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-600">
              Date and Time
            </label>
            <Input
              type="datetime-local"
              name="datetime"
              value={formatDateTimeForInput(formData.datetime)}
              onChange={handleDateTimeChange}
              className="mt-1 border-stone-200 focus:ring-rose-600/20 focus:border-rose-600/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600">
              PIC Name
            </label>
            <Input
              type="text"
              name="pic"
              value={formData.pic}
              onChange={(e) => handleChange("pic", e.target.value)}
              className="mt-1 border-stone-200 focus:ring-rose-600/20 focus:border-rose-600/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600">
              Pack A Quantity (0.2kg per pack)
            </label>
            <Input
              type="number"
              name="pack_a_qty"
              value={formData.pack_a_qty}
              onChange={(e) =>
                handleQuantityChange("pack_a_qty", e.target.value)
              }
              className="mt-1 border-stone-200 focus:ring-rose-600/20 focus:border-rose-600/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600">
              Pack B Quantity (0.3kg per pack)
            </label>
            <Input
              type="number"
              name="pack_b_qty"
              value={formData.pack_b_qty}
              onChange={(e) =>
                handleQuantityChange("pack_b_qty", e.target.value)
              }
              className="mt-1 border-stone-200 focus:ring-rose-600/20 focus:border-rose-600/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600">
              Pack C Quantity (0.4kg per pack)
            </label>
            <Input
              type="number"
              name="pack_c_qty"
              value={formData.pack_c_qty}
              onChange={(e) =>
                handleQuantityChange("pack_c_qty", e.target.value)
              }
              className="mt-1 border-stone-200 focus:ring-rose-600/20 focus:border-rose-600/20"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600">
              Reject Weight (kg)
            </label>
            <Input
              type="number"
              name="reject_weight"
              value={formData.reject_weight}
              onChange={(e) => handleChange("reject_weight", e.target.value)}
              className="mt-1 border-stone-200 focus:ring-rose-600/20 focus:border-rose-600/20"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-600">
              Gross Weight (kg)
            </label>
            <Input
              type="number"
              name="gross_weight"
              value={formData.gross_weight}
              onChange={(e) => handleChange("gross_weight", e.target.value)}
              className="mt-1 border-stone-200 focus:ring-rose-600/20 focus:border-rose-600/20"
              step="0.01"
              required
              readOnly
              disabled
            />
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-rose-600/90 hover:bg-rose-700/90 text-white"
        >
          Submit Record
        </Button>
      </form>
    </Card>
  );
};

export default PackingRecordForm;

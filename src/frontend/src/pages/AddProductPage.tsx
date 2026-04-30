import { CATEGORY_ICONS } from "@/lib/productHelpers";
import { useAppStore } from "@/store/useAppStore";
import type { ProductCategory } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, CalendarIcon, Camera, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const categories: ProductCategory[] = ["Food", "Medicine", "Daily"];

const locations = ["Fridge", "Pantry", "Cabinet", "Freezer", "Bathroom"];

const confettiItems = [
  "green",
  "orange",
  "red",
  "blue",
  "green2",
  "orange2",
  "red2",
  "blue2",
  "green3",
  "orange3",
  "red3",
  "blue3",
];

const confettiColors: Record<string, string> = {
  green: "#4CAF50",
  green2: "#4CAF50",
  green3: "#4CAF50",
  orange: "#FF9800",
  orange2: "#FF9800",
  orange3: "#FF9800",
  red: "#F44336",
  red2: "#F44336",
  red3: "#F44336",
  blue: "#2196F3",
  blue2: "#2196F3",
  blue3: "#2196F3",
};

const reminderLabels: Record<number, string> = {
  1: "1 day",
  2: "2 days",
  3: "3 days",
  7: "1 week",
};

interface FormState {
  name: string;
  category: ProductCategory;
  location: string;
  expiryDate: string;
  notes: string;
  reminderDays: number;
}

export function AddProductPage() {
  const addProduct = useAppStore((s) => s.addProduct);
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    name: "",
    category: "Food",
    location: "Fridge",
    expiryDate: "",
    notes: "",
    reminderDays: 3,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [saving, setSaving] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const validate = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.expiryDate) newErrors.expiryDate = "Expiry date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const handleSave = useCallback(async () => {
    if (!validate()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));

    addProduct({
      name: form.name.trim(),
      category: form.category,
      location: form.location,
      expiryDate: new Date(form.expiryDate).getTime(),
      notes: form.notes.trim() || undefined,
    });

    setShowConfetti(true);
    toast.success("Product added! 🎉", { duration: 3000 });
    setTimeout(() => {
      navigate({ to: "/" });
    }, 700);
    setSaving(false);
  }, [form, validate, addProduct, navigate]);

  const update =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  return (
    <div
      className="flex flex-col flex-1 bg-background"
      data-ocid="add_product.page"
    >
      {/* Gradient hero header */}
      <div
        className="px-4 pt-4 pb-5 relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="w-9 h-9 rounded-full bg-card/80 backdrop-blur flex items-center justify-center shadow-sm hover:bg-card transition-smooth"
            data-ocid="add_product.back_button"
            aria-label="Go back"
          >
            <ArrowLeft size={18} className="text-foreground" />
          </button>
          <h1 className="text-heading-sm text-foreground">Add Product</h1>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
        className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-5"
        noValidate
        aria-label="Add product form"
      >
        {/* Barcode scanner */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          className="card-neumorphic p-4 flex items-center gap-3 border-dashed border-2 border-primary/30 hover:border-primary/60 transition-smooth"
          data-ocid="add_product.barcode_scanner_button"
          aria-label="Scan barcode to auto-fill"
          onClick={() =>
            toast.info("Point camera at barcode — coming soon!", {
              duration: 2500,
            })
          }
        >
          <div className="w-12 h-12 rounded-xl gradient-safe flex items-center justify-center flex-shrink-0 shadow-glow">
            <Camera size={24} className="text-white" />
          </div>
          <div className="text-left min-w-0">
            <p className="font-display font-semibold text-sm text-foreground">
              Scan Barcode
            </p>
            <p className="text-xs text-muted-foreground">
              Auto-fill name &amp; expiry date
            </p>
          </div>
          <ChevronRight
            size={16}
            className="text-muted-foreground ml-auto flex-shrink-0"
          />
        </motion.button>

        {/* Product name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="product-name"
            className="text-sm font-semibold text-foreground"
          >
            Product Name <span className="text-danger">*</span>
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="e.g. Organic Milk, Vitamin C..."
            value={form.name}
            onChange={update("name")}
            className="input-field w-full"
            data-ocid="add_product.name_input"
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-xs text-danger"
              data-ocid="add_product.name_field_error"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Category chips */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-foreground">
            Category
          </span>
          <div className="flex gap-2" aria-label="Product category">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                aria-pressed={form.category === cat}
                onClick={() => setForm((prev) => ({ ...prev, category: cat }))}
                data-ocid={`add_product.category.${cat.toLowerCase()}`}
                className={[
                  "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-smooth border flex-1 justify-center",
                  form.category === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40",
                ].join(" ")}
              >
                <span aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="product-location"
            className="text-sm font-semibold text-foreground"
          >
            Location
          </label>
          <select
            id="product-location"
            value={form.location}
            onChange={update("location")}
            className="input-field w-full"
            data-ocid="add_product.location_select"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Expiry date */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="expiry-date"
            className="text-sm font-semibold text-foreground"
          >
            Expiry Date <span className="text-danger">*</span>
          </label>
          <div className="relative">
            <CalendarIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              id="expiry-date"
              type="date"
              value={form.expiryDate}
              onChange={update("expiryDate")}
              className="input-field w-full pl-9"
              data-ocid="add_product.expiry_date_input"
              aria-describedby={errors.expiryDate ? "expiry-error" : undefined}
            />
          </div>
          {errors.expiryDate && (
            <p
              id="expiry-error"
              className="text-xs text-danger"
              data-ocid="add_product.expiry_field_error"
            >
              {errors.expiryDate}
            </p>
          )}
        </div>

        {/* Reminder slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Remind me before
            </span>
            <span className="badge-warning">
              {reminderLabels[form.reminderDays] ?? `${form.reminderDays}d`}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            step={1}
            value={form.reminderDays}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                reminderDays: Number(e.target.value),
              }))
            }
            className="w-full accent-primary h-2 rounded-full cursor-pointer"
            data-ocid="add_product.reminder_slider"
            aria-label={`Reminder ${form.reminderDays} day${form.reminderDays > 1 ? "s" : ""} before expiry`}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
            <span>1 day</span>
            <span>3 days</span>
            <span>1 week</span>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="product-notes"
            className="text-sm font-semibold text-foreground"
          >
            Notes{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </label>
          <textarea
            id="product-notes"
            rows={3}
            placeholder="Opened date, storage tips..."
            value={form.notes}
            onChange={update("notes")}
            className="input-field w-full resize-none"
            data-ocid="add_product.notes_textarea"
          />
        </div>

        {/* Confetti celebration */}
        {showConfetti && (
          <div
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
            aria-hidden="true"
          >
            {confettiItems.map((item, i) => (
              <motion.div
                key={item}
                initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                animate={{ y: -200, x: (i - 6) * 28, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.8, delay: i * 0.04 }}
                className="absolute w-3 h-3 rounded-sm"
                style={{ backgroundColor: confettiColors[item] }}
              />
            ))}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={saving}
          className="btn-primary w-full mt-2 flex items-center justify-center gap-2"
          data-ocid="add_product.submit_button"
          aria-busy={saving}
        >
          {saving ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              Saving…
            </>
          ) : (
            "Save Product 🌿"
          )}
        </button>
      </form>
    </div>
  );
}

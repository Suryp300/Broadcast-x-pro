import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemo } from 'react';
import { ArrowRight, Wand2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useContactStore } from '../../store/contactStore';
import { useSettingsStore } from '../../store/settingsStore';
import { detectColumnMapping } from '../../utils/columnDetection';

const schema = z.object({
  name: z.string().nullable(),
  phone: z.string().min(1, 'Please select the phone number column'),
  city: z.string().nullable(),
  address: z.string().nullable(),
});

type FormValues = z.infer<typeof schema>;

export function ColumnMapper() {
  const { columns, rawRows, setMapping, process } = useContactStore();
  const { lastMapping, setLastMapping } = useSettingsStore();

  const suggested = useMemo(() => detectColumnMapping(columns), [columns]);

  const pick = (key: keyof FormValues) =>
    (lastMapping?.[key] && columns.includes(lastMapping[key] as string) ? lastMapping[key] : suggested[key]) ?? '';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: pick('name'),
      phone: pick('phone'),
      city: pick('city'),
      address: pick('address'),
    },
  });

  const onSubmit = (values: FormValues) => {
    const nextMapping = {
      name: values.name || null,
      phone: values.phone,
      city: values.city || null,
      address: values.address || null,
    };
    setMapping(nextMapping);
    setLastMapping(nextMapping);
    process();
  };

  const fields: { key: keyof FormValues; label: string; required?: boolean; icon: string }[] = [
    { key: 'phone', label: 'Phone Number', required: true, icon: '📱' },
    { key: 'name', label: 'Business Name', icon: '🏷️' },
    { key: 'city', label: 'City', icon: '📍' },
    { key: 'address', label: 'Address', icon: '🏠' },
  ];

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
          <Wand2 className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-white">Map your columns</h2>
        <p className="mt-1 text-sm text-slate-400">
          We auto-detected likely matches — adjust anything before we process {rawRows.length} rows.
        </p>
      </div>

      <Card>
        <CardHeader>
          <p className="text-sm font-medium text-slate-300">Column Mapping</p>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-5">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-slate-300">
                  <span>{field.icon}</span>
                  {field.label}
                  {field.required && <span className="text-red-400">*</span>}
                </label>
                <Controller
                  control={control}
                  name={field.key}
                  render={({ field: rhf }) => (
                    <select
                      {...rhf}
                      value={rhf.value ?? ''}
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-200 outline-none transition-colors focus:border-primary"
                    >
                      <option value="">{field.required ? 'Select column…' : 'None'}</option>
                      {columns.map((col) => (
                        <option key={col} value={col}>
                          {col}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors[field.key] && <p className="mt-1 text-xs text-red-400">{errors[field.key]?.message as string}</p>}
              </div>
            ))}
          </CardContent>

          <div className="flex justify-end p-5">
            <Button type="submit" size="lg">
              Process Contacts
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

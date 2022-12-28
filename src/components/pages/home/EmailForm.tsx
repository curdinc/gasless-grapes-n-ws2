import {
  Form,
  FormError,
  FormInput,
  FormSubmit,
  useFormState,
} from "ariakit/form";

export const EmailForm = () => {
  const form = useFormState({ defaultValues: { email: "" } });

  form.useSubmit(async () => {
    alert(JSON.stringify(form.values));
  });

  return (
    <Form state={form} aria-labelledby="subscribe-for-updates" className="mt-8">
      <div>
        <FormInput
          type="email"
          name={form.names.email}
          required
          placeholder="johndoe@example.com"
          className="w-full rounded-xl bg-neutral-400 p-3 text-neutral-900  placeholder:text-neutral-800 focus:ring-1 focus:ring-primary-500 focus:ring-offset-2"
        />
        <FormError name={form.names.email} className="pt-2 text-danger-400" />
      </div>
      <div className="buttons py-2">
        <FormSubmit className="btn text-base">Notify Me</FormSubmit>
      </div>
    </Form>
  );
};

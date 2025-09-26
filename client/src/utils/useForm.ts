import { createStore } from "solid-js/store";

const useForm = (formFields: any) => {
  const [form, setForm] = createStore(formFields);

  const handleChange = (e: Event) => {
    const { name, value } = e.currentTarget as HTMLInputElement;
    setForm(name, value);
  };
  return { handleChange, form };
};

export { useForm };
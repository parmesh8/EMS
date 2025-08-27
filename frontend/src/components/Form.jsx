import { useForm } from 'react-hook-form';

function Form({ fields, onSubmit, defaultValues }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map(field => (
        <div key={field.name}>
          <label className="block text-sm font-medium">{field.label}</label>
          {field.type === 'select' ? (
            <select
              {...register(field.name, { required: field.required })}
              className="mt-1 block w-full border rounded p-2"
            >
              {field.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          ) : (
            <input
              type={field.type}
              {...register(field.name, { required: field.required })}
              className="mt-1 block w-full border rounded p-2"
            />
          )}
          {errors[field.name] && <p className="text-red-500 text-sm">{field.label} is required</p>}
        </div>
      ))}
      <button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}

export default Form;
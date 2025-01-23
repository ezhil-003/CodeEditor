// import React from 'react'
import { z } from "zod"
import { FieldApi, useForm } from '@tanstack/react-form';
import { useNavigate } from "react-router";
import { useLoginMutation } from "../api/query";

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  );
}


export default function Signin() {

  const navigate = useNavigate();
  const { mutate } = useLoginMutation(navigate);
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    validators: {
      onChange: schema,
    },
    onSubmit: (values) => {
      mutate(values.value); 
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    form.handleSubmit();
  };
  return (
    <section className="w-full h-full flex flex-1 justify-center items-center dark:bg-slate-400  p-7 rounded-2xl  shadow-2xl">
      <div className="w-full max-w-sm p-8 rounded-md shadow-md border-1">
        <div className="p-4 flex flex-col flex-1 gap-4">
          <h1 className="text-2xl font-bold mb-6  dark:text-white">Sign In</h1>
          <form onSubmit={handleSubmit} className=" dark:bg-gray-800 p-6 flex flex-col flex-1 gap-3 ">
            <div className="mb-4 w-full pb-2">
              <form.Field
                name="email"
                validators={{
                  onChange: z.string().email('Invalid email address'),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000))
                      return !value.includes('error')
                    },
                    {
                      message: "Invalid Email Address",
                    },
                  ),
                }}
                children={(field) => (
                  <>
                    <label className="block  dark:text-gray-300 mb-2" htmlFor={field.name}>
                      Email
                    </label>
                    <input
                      type="email"
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder='you@example.com'
                      required
                      className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500'
                    />
                    <FieldInfo field={field} />
                  </>
                )}
              />
            </div>
            <div className="mb-4 w-full pb-2">
              <form.Field
                name="password"
                validators={{
                  onChange: z.string().min(6, 'Password must be at least 8 characters'),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000))
                      return !value.includes('error')
                    },
                    {
                      message: "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
                    },
                  ),
                }}
                children={(field) => {
                  return (
                    <>
                      <label className="block  dark:text-gray-300 mb-2" htmlFor={field.name}>
                        Password
                      </label>
                      <input
                        type="password"
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        required
                        className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500'
                      />
                      <FieldInfo field={field} />
                    </>
                  )
                }}
              />
            </div>
            <button
              type="submit"
              className="w-full border shadow dark:bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
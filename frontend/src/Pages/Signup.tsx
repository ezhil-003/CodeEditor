// import React from 'react'
import { FieldApi, useForm } from '@tanstack/react-form';
import { Button } from '@nextui-org/react';
import { z } from 'zod';
// import { SignupForm } from '../@types/types';
import { useRegisterMutation } from '../api/query';
import { FormEvent } from 'react';
import { useNavigate } from 'react-router';



const userSchema = z.object({
  firstName: z.string().min(3, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    ),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      path: ['confirmPassword'], // This targets the confirmPassword field
      message: 'Passwords do not match',
      code: 'custom'
    });
  }
});

// type User = z.infer<typeof userSchema>;

function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em >{field.state.meta.errors.join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

export default function Signup() {
  const navigate = useNavigate();
  const { mutate } = useRegisterMutation(navigate); 
  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onChange: userSchema
    },
    onSubmit: (values) => {    
      mutate(values.value); 
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    event.stopPropagation(); // Stop event propagation
    form.handleSubmit(); 
  };

  
  return (
    <section className="w-full h-full flex flex-1 justify-center items-center dark:bg-slate-400  p-7 rounded-2xl  shadow-2xl">
      <div className="w-full  max-w-sm p-8 rounded-md shadow-md border-1">
        <div className="p-4 flex flex-col flex-1 gap-4 ">
          <h1 className="text-2xl font-bold mb-6  dark:text-white">Sign Up</h1>
          <form onSubmit={handleSubmit} className=' dark:bg-gray-800 flex flex-col flex-1 gap-3 '>
            <div className='mb-4 w-full pb-2'>
              <form.Field
                name="firstName"
                validators={{
                  onChange: z.string().min(3, 'First name is required'),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000))
                      return !value.includes('error')
                    },
                    {
                      message: "less than 3 character not allowed in first name",
                    },
                  ),
                }}
                children={(field) => {
                  
                  return (
                    <>
                      <label className="block  dark:text-gray-300 mb-2" htmlFor={field.name}>
                        First Name
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='First name'
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                      />
                      <FieldInfo field={field} />
                    </>
                  )
                }}
              />
            </div>
            <div className=" mb-4 w-full pb-2">
              <form.Field
                name="lastName"
                validators={{
                  onChange: z.string().min(1, 'Last name is required'),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000))
                      return !value.includes('error')
                    },
                    {
                      message: "less than 1 character not allowed in last name",
                    },
                  ),
                }}
                children={(field) => {
                  return (
                    <>
                      <label className="block  dark:text-gray-300 mb-2" htmlFor="email">
                        Last Name
                      </label>
                      <input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder='Last Name'
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                      />
                      <FieldInfo field={field} />
                    </>
                  )
                }
                }
              />
            </div>
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
            <div className="mb-4 mt-4 w-full pb-2">
              <form.Field
                name="confirmPassword"
                validators={{
                  onChange: z.string(),
                  onChangeAsyncDebounceMs: 500,
                  onChangeAsync: z.string().refine(
                    async (value) => {
                      await new Promise((resolve) => setTimeout(resolve, 1000))
                      return !value.includes('error')
                    },
                    {
                      message: "Passwords do not match",
                    },
                  ),

                }}
                children={(field) => {
                  return (
                    <>
                      <label className=" dark:text-gray-300 mb-2" htmlFor={field.name}>
                        Confirm Password
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
            <div className='mb-4 mt-4 w-full pb-2'>

            <Button
              type="submit"
              disabled={!form.state.isFormValid}
              className='w-full border shadow dark:bg-slate-700 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300'
              >
              Sign Up
            </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}


// function zodValidator<TSchema extends z.ZodType<any>>(schema: TSchema) {
//   return async (values: unknown) => {
//     try {
//       schema.parse(values); // Validate the form values
//       return { valid: true, errors: {} }; // Return valid with no errors
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         // Map Zod errors to react-form compatible error format
//         const errors = error.errors.reduce((acc, curr) => {
//           acc[curr.path.join('.')] = curr.message;
//           return acc;
//         }, {} as Record<string, string>);
//         return { valid: false, errors };
//       }
//       throw error;
//     }
//   };
// }

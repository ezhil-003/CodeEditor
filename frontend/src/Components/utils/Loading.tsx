

type Props = {}

export default function Loading({ }: Props) {
  return (
    <section className="h-screen flex justify-center items-center">
      <div className="text-center">
          <span className="sr-only">Loading...</span>
          <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'></div>
          <div className='h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'></div>
          <div className='h-8 w-8 bg-black rounded-full animate-bounce'></div>     
      </div>
    </section>
  )
}
import { Button } from '@/components/ui/button/button'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl">Essa página não existe</h1>
        <h1 className="text-2xl">Tente acessar outra página.</h1>
        <Link href="/">
          <Button className="w-fit rounded bg-sunglow-400 p-6 text-[18px] font-semibold text-black hover:bg-sunglow-400/60">
            Voltar para home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFound

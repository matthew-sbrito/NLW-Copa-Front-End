import Image from "next/image";
import appPreviewImg from "../assets/app-nlw-copa-preview.png"
import logoImg from "../assets/logo.svg"
import iconCheckImg from "../assets/icon-check.svg"
import usersAvatarExampleImg from "../assets/users-avatar-example.png"
import { api } from "../lib/axios";
import { FormEvent, useRef } from "react";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {

  const inputRef = useRef<HTMLInputElement>(null);

  async function createPool(event: FormEvent) {
    event.preventDefault();

    const poolTitle = inputRef.current?.value;

    if(poolTitle == null || poolTitle.length <= 3) return;

    try {
      const response = await api.post('/pools', { title: poolTitle });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert('Bolão criado com sucesso, o código foi copiado para área de transferência!')

      inputRef.current!.value = ''

    } catch (error) {
      console.log(error);      
      alert('Falha ao criar o bolão tente novamente!');
    }

  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">

      <main>

        <Image src={logoImg} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className="mt-10 flex gap-2">
          <input
            ref={inputRef}
            className="flex-1 px-6 py-4 rounded bg-gray-800 border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
          />

          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Criar meu bolão
          </button>
        </form>


        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600" />

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="check" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>

        </div>

      </main>


      <Image
        src={appPreviewImg}
        alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa"
        quality={100}
      />
    </div>
  );
}

export async function getStaticProps() {
  const [guessCountResponse, poolCountResponse, userCountResponse] = await Promise.all([
    api.get('/guesses/count'),
    api.get('/pools/count'),
    api.get('/users/count')
  ])

  return {
    revalidate: 1,
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    }
  }
}
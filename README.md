This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Install dependencies:

```bash
yarn install
```

Create .env.local file in root directory, with provided schema:

```bash
PINATA_API_KEY=key
PINATA_API_SECRET=secret
NEXT_PUBLIC_PINATA_GATEWAY=gateway
INFURA_PROJECT_ID=id
INFURA_PROJECT_SECRET=secret
INFURA_DEDICATED_ENDPOINT=endpoint
```

Install Metamask browser extention.
Add Robsten Network to Metamask.

Run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Deploy smart contract to Robsten network

Create .secret file in root directory with your Secret Recovery Phrase (SRP) for Metamask.

Необходимо выполнить операцию

1. Cоздать файл .secret в корне проекта
2. Зайти в метамаск выбрать тестовую сеть Goerli
3. Сверху справа нажать на 3 точки
4. выбрать реквизиты счета
5. Нажать на эспорт ключа.
6. копируем и вставляем его в файл .secret просто вставляем и все запускаем

Для локального тестирования контрактов необходимо:

1. Скачать программу https://trufflesuite.com/ganache/
2. Пройти базовую настройку Quickstart
3. После чего в конфиге truffle-config.js необходимо расскомитировать
   // development: {
   // host: "127.0.0.1", // Localhost (default: none)
   // port: 7545, // Standard Ethereum port (default: none)
   // network_id: "\*", // Any network (default: none)
   // },
4. Посмотреть какой порт использует программа Ganache и подставить в переменую port.
5. Все получилось запускаем проект и пользуемся на здоровье

Install Truffle globaly:

```bash
yarn install -g truffle
```

Deploy to Robsten:

```bash
truffle deploy --network ropsten
```

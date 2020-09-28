import Head from 'next/head';
import CardColumns from 'react-bootstrap/CardColumns';
import Card from 'react-bootstrap/Card';

import CoinGecko from 'coingecko-api';
const coinGeckoClient = new CoinGecko();

export default function Home(props) {
  const { data } = props.result;

  const formatPercent = (number) => `${new Number(number).toFixed(2)}%`;

  const formatDollar = (number, maximumSignificantDigits) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumSignificantDigits,
    }).format(number);

  return (
    <div>
      <Head>
        <title>Crypto Tiles</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <CardColumns className='mt-2 mr-2 ml-2'>
        {data.map((coin) => (
          <Card
            bg={coin.price_change_percentage_24h > 0 ? 'success' : 'danger'}
            text='white'
            className='text-center p-2'
            key={coin.id}
          >
            <blockquote className=' mb-0 card-body'>
              <img src={coin.image} style={{ width: 50, height: 50 }} />
              <h1 className='mt-2'>
                {coin.symbol.toUpperCase()}{' '}
                {formatDollar(coin.current_price, 20)}{' '}
              </h1>
              <h3>
                {coin.price_change_percentage_24h > 0 ? '+' : ''}
                {formatPercent(coin.price_change_percentage_24h)}
              </h3>

              <small className='text-muted'>
                mkt cap {formatDollar(coin.market_cap, 12)}
              </small>
            </blockquote>
          </Card>
        ))}
      </CardColumns>
    </div>
  );
}

export async function getServerSideProps(context) {
  const params = {
    vs_currency: 'usd',
    ids: [
      'bitcoin',
      'ethereum',
      'polkadot',
      'bitcoin-cash',
      'basic-attention-token',
      'cosmos',
      'uniswap',
      'icon',
      'kyber-network',
      'nervos-network',
      'terra-luna',
      'crypto-com-chain',
    ],
    order: 'volume_desc',
  };
  const result = await coinGeckoClient.coins.markets(params);
  return {
    props: {
      result,
    },
  };
}

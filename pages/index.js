import Head from "next/head";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import Alert from "react-bootstrap/Alert";
import CardColumns from "react-bootstrap/CardColumns";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

import { MdRefresh } from "react-icons/md";

import CoinGecko from "coingecko-api";
const coinGeckoClient = new CoinGecko();

import Comparison from "../components/comparison";

const params = {
	vs_currency: "usd",
	ids: [
		"bitcoin",
		"ethereum",
		"polkadot",
		"bitcoin-cash",
		"basic-attention-token",
		"cosmos",
		"uniswap",
		"icon",
		"kyber-network",
		"nervos-network",
		"terra-luna",
		"crypto-com-chain"
	],
	order: "volume_desc"
};

export default function Home() {
	const formatPercent = number => `${ new Number( number ).toFixed( 2 ) }%`;

	const formatDollar = ( number, maximumSignificantDigits ) => new Intl
		.NumberFormat( "en-US", {
			style: "currency",
			currency: "USD",
			maximumSignificantDigits
		} )
		.format( number );

	function switchBase( coin, symbol, price ) {
		setBaseCurrency( coin );
		setBaseSymbol( symbol );
		setBasePrice( price );
	}

	const [data, setData] = useState( null );
	const [baseCurrency, setBaseCurrency] = useState( "USD" );
	const [baseSymbol, setBaseSymbol] = useState( "USD" );
	const [basePrice, setBasePrice] = useState( 0 );

	useEffect( () => {
		async function gecko() {
			let response = await coinGeckoClient
				.coins
				.markets( params );
			setData( response.data );
		}

		gecko();
	}, [] );

	return ( <div>

		<Head>
			<title>
				Crypto Assets
			</title>
			<link rel="icon" href="/favicon.ico"/>
		</Head>

		{
			!data
				? <div className="fixed-top text-center mt-5">
						<h3>
							<Badge pill="pill" variant="secondary">Loading...</Badge>
						</h3>
					</div>
				: <CardColumns className="mt-2 mr-2 ml-2">

						{
							data.map( coin => ( <Card border={coin.price_change_percentage_24h > 0
									? "success"
									: "danger"} bg={coin.price_change_percentage_24h > 0
									? "success"
									: "danger"} text="white" className="text-center p-2" key={coin.id} onClick={() => switchBase( coin.id, coin.symbol, coin.current_price )}>
								<blockquote className=" mb-0 card-body">
									<a href={"https://messari.io/asset/" + coin.id} target="_blank">
										<img src={coin.image} style={{
												width: 50,
												height: 50
											}}/>
									</a>
									<h1 className="mt-2">
										{
											coin
												.symbol
												.toUpperCase()
										}
										{formatDollar( coin.current_price, 20 )}
									</h1>
									<h3>
										{
											coin.price_change_percentage_24h > 0
												? "+"
												: ""
										}
										{formatPercent( coin.price_change_percentage_24h )}
									</h3>
								</blockquote>
								{baseCurrency != "USD" && ( <Comparison base={baseCurrency} baseSymbol={baseSymbol} current={coin.id} currentSymbol={coin.symbol} priceBase={basePrice} priceCurrent={coin.current_price}/> )}
							</Card> ) )

						}

					</CardColumns>
		}

		{
			baseCurrency != "USD" && <div className="fixed-bottom text-right mb-2">
					<h3>
						<Badge pill="pill" variant="primary" onClick={() => switchBase( 'USD', 'USD', 1 )}><MdRefresh/> {baseSymbol.toUpperCase()}{' '}
							Selected</Badge>
					</h3>
				</div>
		}

	</div> );
}
